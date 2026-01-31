/**
 * Global Error Handler Middleware
 *
 * Catches all errors and formats them consistently.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'ERROR',
    details?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.flatten().fieldErrors,
      },
    });
  }

  // Custom app errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'ERROR',
        message: err.message,
        details: err.details,
      },
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};

// Common error factories
export const NotFoundError = (message: string = 'Resource not found') =>
  new AppError(message, 404, 'NOT_FOUND');

export const UnauthorizedError = (message: string = 'Unauthorized') =>
  new AppError(message, 401, 'UNAUTHORIZED');

export const ForbiddenError = (message: string = 'Forbidden') =>
  new AppError(message, 403, 'FORBIDDEN');

export const BadRequestError = (message: string, details?: Record<string, string[]>) =>
  new AppError(message, 400, 'BAD_REQUEST', details);

export const ConflictError = (message: string) =>
  new AppError(message, 409, 'CONFLICT');
