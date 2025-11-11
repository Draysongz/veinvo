import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index";
import { logger } from "../config/logger";
import { AppError } from "./errorHandler";
import { User } from "../models/User";

// Extend Express Request interface
// declare global {
//   namespace Express {
//     interface Request {
//       user?: IUserDocument;
//       token?: string;
//     }
//   }
// }

interface DecodedToken {
  id: string;
  iat: number;
}

// Authentication middleware
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError("Access denied. No token provided.", 401, "NO_TOKEN");
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;

    // Check if user still exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new AppError("User no longer exists.", 401, "USER_NOT_FOUND");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(
        "User account is deactivated.",
        401,
        "USER_DEACTIVATED"
      );
    }

    // Check if user changed password after token was issued
    // if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
    //   throw new AppError('User recently changed password. Please log in again.', 401, 'PASSWORD_CHANGED');
    // }

    if (user.passwordChangedAt && user.passwordChangedAt instanceof Date) {
      const changedTimestamp = user.passwordChangedAt.getTime() / 1000;
      if (decoded.iat < changedTimestamp) {
        throw new AppError(
          "User recently changed password! Please log in again.",
          401
        );
      }
    }

    // Grant access to protected route
    req.user = user;
    req.token = token;

    // Log successful authentication
    logger.info("User authenticated successfully", {
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      requestId: req.id,
    });

    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid token.", 401, "INVALID_TOKEN"));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Token expired.", 401, "TOKEN_EXPIRED"));
    } else {
      next(new AppError("Authentication failed.", 401, "AUTH_FAILED"));
    }
  }
};

// Role-based access control middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401, "AUTH_REQUIRED");
    }

    if (!roles.includes(req.user.role)) {
      logger.warn("Unauthorized access attempt", {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
        path: req.path,
        method: req.method,
        ip: req.ip,
        requestId: req.id,
      });

      throw new AppError(
        "You do not have permission to perform this action.",
        403,
        "INSUFFICIENT_PERMISSIONS"
      );
    }

    next();
  };
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Don't throw error, just continue without user
    next();
  }
};

// Rate limiting for authentication attempts
export const authRateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!req.app.locals.authAttempts) {
    req.app.locals.authAttempts = new Map();
  }

  const clientData = req.app.locals.authAttempts.get(clientIP) || {
    attempts: 0,
    resetTime: now + windowMs,
    blockedUntil: 0,
  };

  // Check if IP is blocked
  if (now < clientData.blockedUntil) {
    const remainingTime = Math.ceil((clientData.blockedUntil - now) / 1000);

    logger.warn("Authentication attempts blocked", {
      ip: clientIP,
      remainingBlockTime: remainingTime,
      requestId: req.id,
    });

    res.status(429).json({
      error: "Too Many Authentication Attempts",
      message: `Account temporarily locked. Try again in ${remainingTime} seconds.`,
      retryAfter: remainingTime,
    });
  }

  // Reset counter if window has passed
  if (now > clientData.resetTime) {
    clientData.attempts = 0;
    clientData.resetTime = now + windowMs;
    clientData.blockedUntil = 0;
  }

  // Increment attempts
  clientData.attempts++;

  // Block IP if max attempts exceeded
  if (clientData.attempts >= maxAttempts) {
    clientData.blockedUntil = now + 30 * 60 * 1000; // Block for 30 minutes

    logger.warn("IP blocked due to excessive authentication attempts", {
      ip: clientIP,
      attempts: clientData.attempts,
      blockedUntil: new Date(clientData.blockedUntil).toISOString(),
      requestId: req.id,
    });
  }

  req.app.locals.authAttempts.set(clientIP, clientData);

  // Add remaining attempts info to response headers
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(0, maxAttempts - clientData.attempts)
  );
  res.setHeader(
    "X-RateLimit-Reset",
    new Date(clientData.resetTime).toISOString()
  );

  next();
};

// Validate refresh token middleware
export const validateRefreshToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(
        "Refresh token is required.",
        400,
        "REFRESH_TOKEN_REQUIRED"
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;

    // Check if user exists and is active
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      throw new AppError(
        "Invalid refresh token.",
        401,
        "INVALID_REFRESH_TOKEN"
      );
    }

    // Check if refresh token is in user's valid tokens list (if implemented)
    // This would require storing valid refresh tokens in the user document

    req.user = user;
    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(
        new AppError("Invalid refresh token.", 401, "INVALID_REFRESH_TOKEN")
      );
    } else if (error instanceof jwt.TokenExpiredError) {
      next(
        new AppError("Refresh tok  en expired.", 401, "REFRESH_TOKEN_EXPIRED")
      );
    } else {
      next(
        new AppError(
          "Refresh token validation failed.",
          401,
          "REFRESH_TOKEN_VALIDATION_FAILED"
        )
      );
    }
  }
};
