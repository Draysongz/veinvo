import { Request, Response } from "express";
import { logger } from "../config/logger";

export const notFound = (req: Request, res: Response): void => {
  logger.warn("Route not found", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.status(404).json({
    error: {
      message: "Route not found",
      code: "ROUTE_NOT_FOUND",
      statusCode: 404,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  });
};
