import pool from '../config/database';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'admin';
  email_verified: boolean;
  is_banned: boolean;
  created_at: Date;
  updated_at: Date;
}

export const userModel = {
  /**
   * Find a user by email.
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  /**
   * Find a user by ID.
   */
  async findById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Create a new user.
   */
  async create(data: {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.email, data.password_hash, data.first_name, data.last_name, data.phone]
    );
    return result.rows[0];
  },

  /**
   * Update a user's refresh token (store hash in DB).
   * Note: This assumes a refresh_tokens table exists as per migrations.
   */
  async saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );
  },

  /**
   * Remove all refresh tokens for a user.
   */
  async revokeRefreshTokens(userId: string) {
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  },

  /**
   * Update user password.
   */
  async updatePassword(userId: string, passwordHash: string) {
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId]
    );
  }
};
