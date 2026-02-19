import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { emailService } from '../services/email.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { ConflictError, UnauthorizedError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);

    // Send welcome email (non-blocking — don't fail registration if email fails)
    emailService.sendWelcomeEmail(user.email, user.first_name).catch(err =>
      console.error('Failed to send welcome email:', err)
    );

    sendSuccess(res, { data: user, message: 'User registered successfully' }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Email already in use') {
      return next(ConflictError('Email already in use'));
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    // In a real app, you might set the refresh token as an httpOnly cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: true, // Always true for cross-site
      sameSite: 'none', // Allow cross-site usage
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    sendSuccess(res, { data: result, message: 'Login successful' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid email or password') {
      return next(UnauthorizedError('Invalid email or password'));
    }
    if (error instanceof Error && error.message === 'Account is banned') {
      return next(UnauthorizedError('Account is banned'));
    }
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear cookie
    res.clearCookie('refreshToken');
    sendSuccess(res, { data: null, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    sendSuccess(res, { data: result, message: 'Token refreshed successfully' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    // Always return success to prevent email enumeration
    sendSuccess(res, { data: null, message: 'If an account exists with this email, a password reset link has been sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    sendSuccess(res, { data: null, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const user = await authService.getMe(userId);
    sendSuccess(res, { data: user, message: 'User profile retrieved successfully' });
  } catch (error) {
    next(error);
  }
};
