import crypto from 'crypto';
import { userModel } from '../models/user.model';
import { emailService } from './email.service';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

// In-memory store for password reset tokens (in production, use Redis or database)
interface PasswordResetToken {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

const passwordResetTokens = new Map<string, PasswordResetToken>();

export const authService = {
  /**
   * Register a new user and create their wallet.
   */
  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) {
    const existingUser = await userModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const passwordHash = await hashPassword(data.password);
    
    // Create user
    const user = await userModel.create({
      email: data.email,
      password_hash: passwordHash,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
    });

    // Create wallet for user (Phase 1 migration 007 created wallets table)
    // We'll add this to a wallet model later, but for now just direct query
    // import pool from '../config/database'; // If needed
    
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    };
  },

  /**
   * Login user and return tokens.
   */
  async login(email: string, password: string) {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.is_banned) {
      throw new Error('Account is banned');
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token (hash it for security)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    // For simplicity in this step, we'll skip DB token storage or implement it briefly
    // await userModel.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  /**
   * Refresh access token using refresh token.
   */
  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      // Verify user still exists and is not banned
      const user = await userModel.findById(decoded.userId);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      if (user.is_banned) {
        throw new Error('Account is banned');
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      return {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  },

  /**
   * Request password reset for user.
   */
  async forgotPassword(email: string) {
    const user = await userModel.findByEmail(email);
    
    // Don't reveal if email exists or not for security
    if (!user) {
      return;
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Token expires in 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Store token hash (not the raw token)
    passwordResetTokens.set(tokenHash, {
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // Send password reset email
    await emailService.sendPasswordResetEmail(user.email, user.first_name, token);
  },

  /**
   * Reset password using token.
   */
  async resetPassword(token: string, newPassword: string) {
    // Hash the provided token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const resetData = passwordResetTokens.get(tokenHash);
    
    if (!resetData) {
      throw new Error('Invalid or expired reset token');
    }

    if (new Date() > resetData.expiresAt) {
      passwordResetTokens.delete(tokenHash);
      throw new Error('Reset token has expired');
    }

    // Update password
    const passwordHash = await hashPassword(newPassword);
    await userModel.updatePassword(resetData.userId, passwordHash);

    // Remove used token
    passwordResetTokens.delete(tokenHash);

    // Revoke all refresh tokens for security
    await userModel.revokeRefreshTokens(resetData.userId);
  },

  /**
   * Get current user profile.
   */
  async getMe(userId: string) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      email_verified: user.email_verified,
      created_at: user.created_at,
    };
  },
};
