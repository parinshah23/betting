import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate Limiting Middleware
 *
 * Different rate limiters for different endpoint categories:
 * - Auth endpoints: 5 requests per 15 minutes
 * - General API: 100 requests per 1 minute
 * - Ticket purchase: 10 requests per 1 minute
 * - Admin endpoints: 200 requests per 1 minute
 */

// Standard error response formatter
const createRateLimitResponse = (req: Request, res: Response) => {
  return res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  });
};

// Auth endpoints rate limiter (login/register)
// 20 requests per 1 minute (increased for testing)
export const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute (reduced from 15 minutes)
  max: 20, // 20 attempts (increased from 5)
  message: createRateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  },
});

// General API rate limiter
// 100 requests per 1 minute
export const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: createRateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  },
});

// Ticket purchase rate limiter
// 10 requests per 1 minute
export const ticketPurchaseRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: createRateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise fall back to IP
    return (req as any).user?.id || req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  },
});

// Admin endpoints rate limiter
// 200 requests per 1 minute
export const adminRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
  message: createRateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise fall back to IP
    return (req as any).user?.id || req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  },
});
