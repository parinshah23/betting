import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { UnauthorizedError } from './errorHandler';

/**
 * Authentication Middleware
 *
 * Verifies JWT token from Authorization header and attaches user info to req.user
 */
export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw UnauthorizedError('Token not provided');
    }

    const decoded = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = decoded;

    next();
  } catch (error) {
    if (error instanceof Error && error.message === 'jwt expired') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token expired',
        },
      });
    }

    if (error instanceof Error && error.message === 'invalid token') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token',
        },
      });
    }

    if (error && typeof error === 'object' && 'statusCode' in error) {
      return res.status((error as any).statusCode).json({
        success: false,
        error: {
          code: (error as any).code || 'UNAUTHORIZED',
          message: (error as any).message,
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed',
      },
    });
  }
};
