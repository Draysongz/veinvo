import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { config } from "../config/index";

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code || "";

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let code: string | undefined;

  if (res.headersSent) {
    return; // or return _next(error);
  }

  // Handle AppError instances
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
  }
  // Handle Mongoose validation errors
  else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    code = "VALIDATION_ERROR";
  }
  // Handle Mongoose cast errors
  else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    code = "INVALID_ID";
  }
  // Handle Mongoose duplicate key errors
  else if (error.name === "MongoError" && (error as any).code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";
    code = "DUPLICATE_KEY";
  }
  // Handle JWT errors
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    code = "INVALID_TOKEN";
  }
  // Handle JWT expiration errors
  else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    code = "TOKEN_EXPIRED";
  }
  // Handle Multer errors
  else if (error.name === "MulterError") {
    statusCode = 400;
    message = "File upload error";
    code = "FILE_UPLOAD_ERROR";
  }

  // Log error with context
  const logData: any = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code,
    },
    request: {
      id: req.id,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      userId: (req as any).user?.id,
    },
    timestamp: new Date().toISOString(),
  };

  // Log different levels based on error type
  if (statusCode >= 500) {
    logger.error("Server Error:", logData);
  } else if (statusCode >= 400) {
    logger.warn("Client Error:", logData);
  } else {
    logger.info("Application Error:", logData);
  }

  // Send error response
  const errorResponse: any = {
    error: {
      message,
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  };

  // Include additional details in development
  if (config.nodeEnv === "development") {
    errorResponse.error.stack = error.stack;
    errorResponse.error.name = error.name;
  }

  // Set response status and send
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFound = (req: Request, res: Response): void => {
  const notFoundError = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    "ROUTE_NOT_FOUND"
  );

  logger.warn("Route not found", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    error: notFoundError,
  });

  res.status(404).json({
    error: {
      message: notFoundError.message,
      code: notFoundError.code,
      statusCode: notFoundError.statusCode,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  });
};

// Graceful shutdown error handler
export const gracefulShutdown = (error?: Error): void => {
  if (error) {
    logger.error("Unhandled error, shutting down gracefully:", error);
  } else {
    logger.error("Shutting down gracefully");
  }
  process.exit(1);
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  gracefulShutdown(error);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Promise Rejection:", reason);
  gracefulShutdown(new Error(`Unhandled Promise Rejection: ${reason}`));
});
