import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { logger } from "../config/logger";

interface ValidatedRequestData {
  body?: any;
  params?: any;
  query?: any;
}

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate the entire request object (body, params, query)
      const validatedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as ValidatedRequestData;

      // Replace request data with validated data
      if (validatedData.body) {
        req.body = validatedData.body;
      }
      if (validatedData.params) {
        req.params = validatedData.params;
      }
      if (validatedData.query) {
        req.query = validatedData.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Use the correct properties from ZodError
        const errors = error.issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        logger.warn("Request validation failed", {
          path: req.path,
          method: req.method,
          errors,
          body: req.body,
          params: req.params,
          query: req.query,
        });

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
        return;
      }

      logger.error("Validation middleware error", error);
      res.status(500).json({
        success: false,
        message: "Internal validation error",
      });
      return;
    }
  };
};
