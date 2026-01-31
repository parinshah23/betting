import pool from '../config/database';

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: 'deposit' | 'spend' | 'cashback' | 'refund' | 'admin_credit' | 'admin_debit';
  amount: number;
  balance_after: number;
  description: string;
  reference_id: string;
  created_at: Date;
}

export interface TransactionInput {
  wallet_id: string;
  type: 'deposit' | 'spend' | 'cashback' | 'refund' | 'admin_credit' | 'admin_debit';
  amount: number;
  balance_after: number;
  description: string;
  reference_id?: string;
}

export const walletModel = {
  /**
   * Find a wallet by user ID.
   */
  async findByUserId(userId: string): Promise<Wallet | null> {
    const result = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
    return result.rows[0] || null;
  },

  /**
   * Create a new wallet for a user.
   */
  async create(userId: string): Promise<Wallet> {
    const result = await pool.query(
      `INSERT INTO wallets (user_id, balance)
       VALUES ($1, 0)
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  /**
   * Get wallet balance by user ID.
   */
  async getBalance(userId: string): Promise<number | null> {
    const result = await pool.query(
      'SELECT balance FROM wallets WHERE user_id = $1',
      [userId]
    );
    return result.rows[0]?.balance ?? null;
  },

  /**
   * Add a transaction record.
   */
  async addTransaction(data: TransactionInput): Promise<WalletTransaction> {
    const result = await pool.query(
      `INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, reference_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.wallet_id, data.type, data.amount, data.balance_after, data.description, data.reference_id || null]
    );
    return result.rows[0];
  },

  /**
   * Get transactions for a wallet with optional filtering.
   */
  async getTransactions(
    walletId: string,
    options: { page?: number; limit?: number; type?: string } = {}
  ): Promise<{ transactions: WalletTransaction[]; total: number }> {
    const { page = 1, limit = 20, type } = options;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE wallet_id = $1';
    const params: (string | number)[] = [walletId];
    let paramIndex = 2;

    if (type) {
      whereClause += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM wallet_transactions ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const transactionsResult = await pool.query(
      `SELECT * FROM wallet_transactions ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      transactions: transactionsResult.rows,
      total,
    };
  },

  /**
   * Credit (add) amount to wallet.
   */
  async credit(
    walletId: string,
    amount: number,
    description: string,
    referenceId?: string
  ): Promise<WalletTransaction> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const walletResult = await client.query(
        'UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING balance',
        [amount, walletId]
      );

      if (walletResult.rows.length === 0) {
        throw new Error('Wallet not found');
      }

      const balanceAfter = walletResult.rows[0].balance;

      const transactionResult = await client.query(
        `INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, reference_id)
         VALUES ($1, 'deposit', $2, $3, $4, $5)
         RETURNING *`,
        [walletId, amount, balanceAfter, description, referenceId || null]
      );

      await client.query('COMMIT');
      return transactionResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Debit (subtract) amount from wallet.
   */
  async debit(
    walletId: string,
    amount: number,
    description: string,
    referenceId?: string
  ): Promise<WalletTransaction> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const walletResult = await client.query(
        'UPDATE wallets SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND balance >= $1 RETURNING balance',
        [amount, walletId]
      );

      if (walletResult.rows.length === 0) {
        throw new Error('Insufficient balance or wallet not found');
      }

      const balanceAfter = walletResult.rows[0].balance;

      const transactionResult = await client.query(
        `INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, reference_id)
         VALUES ($1, 'spend', $2, $3, $4, $5)
         RETURNING *`,
        [walletId, -amount, balanceAfter, description, referenceId || null]
      );

      await client.query('COMMIT');
      return transactionResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Check if wallet has enough balance.
   */
  async hasEnoughBalance(walletId: string, amount: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT balance FROM wallets WHERE id = $1',
      [walletId]
    );
    return result.rows[0]?.balance >= amount;
  },
};
