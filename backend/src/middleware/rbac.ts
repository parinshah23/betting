import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from './errorHandler';

/**
 * RBAC (Role-Based Access Control) Middleware
 *
 * Restricts access to routes based on user roles.
 * Must be used AFTER authentication middleware (req.user must exist).
 *
 * Usage:
 *   router.get('/admin/users', authenticate, authorize(['admin']), getUsers);
 *   router.get('/dashboard', authenticate, authorize(['user', 'admin']), getDashboard);
 */

export type UserRole = 'user' | 'admin';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Authorize middleware that checks if the user's role is in the allowed roles.
 *
 * @param allowedRoles - Array of roles that are permitted to access the route
 * @returns Express middleware function
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    // Check if user exists (should be set by auth middleware)
    if (!authReq.user) {
      return next(ForbiddenError('Access denied. User not authenticated.'));
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(authReq.user.role)) {
      return next(ForbiddenError('Access denied. Insufficient permissions.'));
    }

    next();
  };
};
