import pool from '../config/database';

export interface Ticket {
  id: string;
  competition_id: string;
  user_id: string;
  order_id: string;
  ticket_number: number;
  status: 'available' | 'reserved' | 'sold';
  is_instant_win: boolean;
  instant_win_prize: string;
  instant_win_claimed: boolean;
  purchased_at: Date;
  created_at: Date;
}

export const ticketModel = {
  /**
   * Find tickets by competition ID with optional status filter and limit.
   */
  async findByCompetition(
    competitionId: string,
    options: { status?: string; limit?: number } = {}
  ): Promise<Ticket[]> {
    let query = 'SELECT * FROM tickets WHERE competition_id = $1';
    const params: (string | number)[] = [competitionId];

    if (options.status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(options.status);
    }

    query += ' ORDER BY ticket_number';

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Find tickets by user ID with optional status filter, pagination.
   */
  async findByUser(
    userId: string,
    options: { status?: string; page?: number; limit?: number } = {}
  ): Promise<Ticket[]> {
    let query = 'SELECT * FROM tickets WHERE user_id = $1';
    const params: (string | number)[] = [userId];

    if (options.status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(options.status);
    }

    query += ' ORDER BY created_at DESC';

    const limit = options.limit || 20;
    const page = options.page || 1;
    const offset = (page - 1) * limit;

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Find a ticket by ID.
   */
  async findById(id: string): Promise<Ticket | null> {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Find available tickets for a competition.
   */
  async findAvailableTickets(
    competitionId: string,
    quantity: number
  ): Promise<Ticket[]> {
    const result = await pool.query(
      `SELECT * FROM tickets 
       WHERE competition_id = $1 
       AND status = 'available' 
       ORDER BY ticket_number 
       LIMIT $2 
       FOR UPDATE SKIP LOCKED`,
      [competitionId, quantity]
    );
    return result.rows;
  },

  /**
   * Reserve tickets for a user (part of an order).
   */
  async reserveTickets(
    competitionId: string,
    quantity: number,
    userId: string,
    orderId: string
  ): Promise<Ticket[]> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE tickets 
         SET status = 'reserved', 
             user_id = $3, 
             order_id = $4 
         WHERE id IN (
           SELECT id FROM tickets 
           WHERE competition_id = $1 
           AND status = 'available' 
           ORDER BY ticket_number 
           LIMIT $2 
           FOR UPDATE SKIP LOCKED
         )
         RETURNING *`,
        [competitionId, quantity, userId, orderId]
      );

      await client.query('COMMIT');
      return result.rows;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Mark reserved tickets as sold.
   */
  async markAsSold(ticketIds: string[]): Promise<Ticket[]> {
    if (ticketIds.length === 0) return [];

    const placeholders = ticketIds.map((_, i) => `$${i + 1}`).join(',');
    const result = await pool.query(
      `UPDATE tickets 
       SET status = 'sold', 
           purchased_at = CURRENT_TIMESTAMP 
       WHERE id IN (${placeholders}) 
       AND status = 'reserved'
       RETURNING *`,
      ticketIds
    );
    return result.rows;
  },

  /**
   * Create tickets for a new competition.
   */
  async createTicketsForCompetition(
    competitionId: string,
    totalTickets: number
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const values: string[] = [];
      const params: (string | number)[] = [];

      for (let i = 1; i <= totalTickets; i++) {
        values.push(`($${params.length + 1}, $${params.length + 2})`);
        params.push(competitionId, i);
      }

      await client.query(
        `INSERT INTO tickets (competition_id, ticket_number) VALUES ${values.join(',')}`,
        params
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Get user's tickets with pagination (alias for findByUser).
   */
  async getUserTickets(
    userId: string,
    options: { status?: string; page?: number; limit?: number } = {}
  ): Promise<Ticket[]> {
    return this.findByUser(userId, options);
  },

  /**
   * Get user's ticket history (all tickets they've purchased).
   */
  async getUserTicketHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<Ticket[]> {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT * FROM tickets 
       WHERE user_id = $1 
       AND status = 'sold'
       ORDER BY purchased_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  },

  /**
   * Get user's instant win tickets.
   */
  async getUserInstantWins(userId: string): Promise<Ticket[]> {
    const result = await pool.query(
      `SELECT * FROM tickets 
       WHERE user_id = $1 
       AND is_instant_win = TRUE 
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Count tickets by status for a competition.
   */
  async countTicketsByStatus(
    competitionId: string,
    status: string
  ): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) FROM tickets WHERE competition_id = $1 AND status = $2',
      [competitionId, status]
    );
    return parseInt(result.rows[0].count, 10);
  }
};
