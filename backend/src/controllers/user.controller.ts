import { Request, Response, NextFunction } from 'express';
import { userModel } from '../models/user.model';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { comparePassword, hashPassword } from '../utils/password';
import { BadRequestError } from '../middleware/errorHandler';

/**
 * Get user profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const user = await userModel.findById(userId);
    
    if (!user) {
      throw BadRequestError('User not found');
    }

    sendSuccess(res, {
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
        created_at: user.created_at,
      },
      message: 'Profile retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { first_name, last_name, phone } = req.body;

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | null)[] = [];
    let paramIndex = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramIndex}`);
      values.push(first_name);
      paramIndex++;
    }

    if (last_name !== undefined) {
      updates.push(`last_name = $${paramIndex}`);
      values.push(last_name);
      paramIndex++;
    }

    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex}`);
      values.push(phone);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw BadRequestError('No fields to update');
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await userModel.findById(userId);
    if (!result) {
      throw BadRequestError('User not found');
    }

    // Execute update query
    const { query } = await import('../config/database');
    const updateResult = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    const updatedUser = updateResult.rows[0];

    sendSuccess(res, {
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        email_verified: updatedUser.email_verified,
        updated_at: updatedUser.updated_at,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change user password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { currentPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      throw BadRequestError('User not found');
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw BadRequestError('Current password is incorrect');
    }

    // Hash and update new password
    const newPasswordHash = await hashPassword(newPassword);
    await userModel.updatePassword(userId, newPasswordHash);

    // Revoke all refresh tokens for security
    await userModel.revokeRefreshTokens(userId);

    sendSuccess(res, {
      data: null,
      message: 'Password changed successfully. Please log in again.',
    });
  } catch (error) {
    next(error);
  }
};
