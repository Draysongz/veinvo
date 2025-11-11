import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

// Security middleware to add additional security headers and validations
export const securityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // Remove sensitive headers
  res.removeHeader("X-Powered-By");
  res.removeHeader("Server");

  // Add security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  // Log security-relevant requests
  if (
    req.headers["user-agent"]?.includes("sqlmap") ||
    req.headers["user-agent"]?.includes("nikto") ||
    req.headers["user-agent"]?.includes("nmap")
  ) {
    logger.warn("Potential security scan detected", {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      path: req.path,
      method: req.method,
    });
  }

  // Validate request size
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > 10 * 1024 * 1024) {
    // 10MB limit
    logger.warn("Request too large", {
      ip: req.ip,
      contentLength,
      path: req.path,
    });
    return res.status(413).json({
      error: "Request entity too large",
      message: "Request size exceeds the limit of 10MB",
    });
  }

  // Validate content type for POST/PUT requests
  if (
    (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") &&
    req.headers["content-type"] &&
    !req.headers["content-type"].includes("application/json") &&
    !req.headers["content-type"].includes("multipart/form-data") &&
    !req.headers["content-type"].includes("application/x-www-form-urlencoded")
  ) {
    logger.warn("Invalid content type", {
      ip: req.ip,
      contentType: req.headers["content-type"],
      path: req.path,
      method: req.method,
    });
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid content type",
    });
  }

  // Rate limiting per IP (additional to express-rate-limit)
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 1000;

  // This is a simple in-memory rate limiter (in production, use Redis)
  if (!req.app.locals["rateLimit"]) {
    req.app.locals["rateLimit"] = new Map();
  }

  const clientData = req.app.locals["rateLimit"].get(clientIP) || {
    count: 0,
    resetTime: now + windowMs,
  };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count++;
  }

  req.app.locals["rateLimit"].set(clientIP, clientData);

  if (clientData.count > maxRequests) {
    logger.warn("Rate limit exceeded", {
      ip: clientIP,
      count: clientData.count,
      path: req.path,
    });
    return res.status(429).json({
      error: "Too Many Requests",
      message: "Rate limit exceeded",
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
    });
  }

  // Validate request path
  if (req.path.includes("..") || req.path.includes("//")) {
    logger.warn("Path traversal attempt", {
      ip: req.ip,
      path: req.path,
      userAgent: req.headers["user-agent"],
    });
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid path",
    });
  }

  // Validate query parameters
  //   const suspiciousParams = ['__proto__', 'constructor', 'prototype'];
  //  for (const param of suspiciousParams) {
  //   // Check if any header contains the malicious parameter
  //   for (const headerName in req.headers) {
  //     const headerValue = req.headers[headerName];
  //     if (typeof headerValue === 'string' && headerValue.includes(param)) {
  //       logger.warn('Prototype pollution attempt in headers', {
  //         ip: req.ip,
  //         param,
  //         header: headerName,
  //         path: req.path,
  //         userAgent: req.headers['user-agent'],
  //       });
  //       return res.status(400).json({
  //         error: 'Bad Request',
  //         message: 'Invalid parameter in headers',
  //       });
  //     }
  //   }

  //   if (req.query[param] || req.body[param]) {
  //     logger.warn('Prototype pollution attempt', {
  //       ip: req.ip,
  //       param,
  //       path: req.path,
  //       userAgent: req.headers['user-agent'],
  //     });
  //     return res.status(400).json({
  //       error: 'Bad Request',
  //       message: 'Invalid parameter',
  //     });
  //   }
  //  }

  //   suspiciousParams.forEach(param => {
  //   if (req.query[param]) {
  //     logger.warn('Prototype pollution parameter removed from query', {
  //       ip: req.ip,
  //       param,
  //       path: req.path
  //     });
  //     delete req.query[param];
  //   }
  // });

  // // Clean body parameters
  // suspiciousParams.forEach(param => {
  //   if (req.body && req.body[param]) {
  //     logger.warn('Prototype pollution parameter removed from body', {
  //       ip: req.ip,
  //       param,
  //       path: req.path
  //     });
  //     delete req.body[param];
  //   }
  // });

  // Add request ID for tracking
  req.id = (req.headers["x-request-id"] as string) || generateRequestId();

  next();
};

// Generate unique request ID
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
