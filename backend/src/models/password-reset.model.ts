import pool from '../config/database';
import crypto from 'crypto';

export interface PasswordResetToken {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    used: boolean;
    created_at: Date;
}

class PasswordResetModel {
    /**
     * Hash token for storage
     */
    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    /**
     * Create a new password reset token
     */
    async createToken(userId: string, token: string, expiresAt: Date): Promise<void> {
        const tokenHash = this.hashToken(token);

        // Invalidate any existing tokens for this user
        await pool.query(
            'UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND used = false',
            [userId]
        );

        // Create new token
        await pool.query(
            `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
            [userId, tokenHash, expiresAt]
        );
    }

    /**
     * Find token and return user ID if valid
     */
    async findByToken(token: string): Promise<{ userId: string } | null> {
        const tokenHash = this.hashToken(token);

        const result = await pool.query(
            `SELECT user_id, expires_at, used
       FROM password_reset_tokens
       WHERE token_hash = $1`,
            [tokenHash]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const { user_id, expires_at, used } = result.rows[0];

        // Check if token is valid
        if (used || new Date() > new Date(expires_at)) {
            return null;
        }

        return { userId: user_id };
    }

    /**
     * Mark token as used
     */
    async markAsUsed(token: string): Promise<void> {
        const tokenHash = this.hashToken(token);

        await pool.query(
            'UPDATE password_reset_tokens SET used = true WHERE token_hash = $1',
            [tokenHash]
        );
    }

    /**
     * Clean up expired tokens (run periodically)
     */
    async cleanupExpired(): Promise<number> {
        const result = await pool.query(
            'DELETE FROM password_reset_tokens WHERE expires_at < CURRENT_TIMESTAMP OR used = true',
        );
        return result.rowCount || 0;
    }
}

export default new PasswordResetModel();
