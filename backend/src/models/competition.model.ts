import pool from '../config/database';

export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  prize_value: number;
  ticket_price: number;
  total_tickets: number;
  max_tickets_per_user: number;
  category: string;
  status: 'draft' | 'live' | 'ended' | 'completed' | 'cancelled';
  featured: boolean;
  end_date: Date;
  draw_date: Date;
  winner_user_id: string;
  winning_ticket_number: number;
  skill_question: string;
  skill_answer: string;
  created_at: Date;
  updated_at: Date;
}

export interface CompetitionCreateInput {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  prize_value: number;
  ticket_price: number;
  total_tickets: number;
  max_tickets_per_user?: number;
  category: string;
  status?: 'draft' | 'live' | 'ended' | 'completed' | 'cancelled';
  featured?: boolean;
  end_date: Date;
  draw_date?: Date;
  skill_question: string;
  skill_answer: string;
}

export interface CompetitionUpdateInput {
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  prize_value?: number;
  ticket_price?: number;
  total_tickets?: number;
  max_tickets_per_user?: number;
  category?: string;
  status?: 'draft' | 'live' | 'ended' | 'completed' | 'cancelled';
  featured?: boolean;
  end_date?: Date;
  draw_date?: Date;
  winner_user_id?: string;
  winning_ticket_number?: number;
  skill_question?: string;
  skill_answer?: string;
}

export interface FindAllOptions {
  status?: string;
  featured?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}

export const competitionModel = {
  /**
   * Find all competitions with optional filtering and pagination.
   */
  async findAll(options: FindAllOptions = {}): Promise<{ competitions: Competition[]; total: number }> {
    const { status, featured, category, page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;
    
    const conditions: string[] = [];
    const values: (string | boolean | number)[] = [];
    let paramIndex = 1;
    
    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }
    
    if (featured !== undefined) {
      conditions.push(`featured = $${paramIndex}`);
      values.push(featured);
      paramIndex++;
    }
    
    if (category) {
      conditions.push(`category = $${paramIndex}`);
      values.push(category);
      paramIndex++;
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM competitions ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);
    
    const queryValues = [...values, limit, offset];
    const result = await pool.query(
      `SELECT * FROM competitions ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      queryValues
    );
    
    return {
      competitions: result.rows,
      total
    };
  },

  /**
   * Find a competition by slug.
   */
  async findBySlug(slug: string): Promise<Competition | null> {
    const result = await pool.query('SELECT * FROM competitions WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  },

  /**
   * Find a competition by ID.
   */
  async findById(id: string): Promise<Competition | null> {
    const result = await pool.query('SELECT * FROM competitions WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Find all featured competitions.
   */
  async findFeatured(): Promise<Competition[]> {
    const result = await pool.query(
      'SELECT * FROM competitions WHERE featured = true AND status = $1 ORDER BY created_at DESC',
      ['live']
    );
    return result.rows;
  },

  /**
   * Create a new competition.
   */
  async create(data: CompetitionCreateInput): Promise<Competition> {
    const result = await pool.query(
      `INSERT INTO competitions (
        title, slug, description, short_description, prize_value, ticket_price,
        total_tickets, max_tickets_per_user, category, status, featured,
        end_date, draw_date, skill_question, skill_answer
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        data.title,
        data.slug,
        data.description,
        data.short_description,
        data.prize_value,
        data.ticket_price,
        data.total_tickets,
        data.max_tickets_per_user || 100,
        data.category,
        data.status || 'draft',
        data.featured || false,
        data.end_date,
        data.draw_date || null,
        data.skill_question,
        data.skill_answer
      ]
    );
    return result.rows[0];
  },

  /**
   * Update a competition by ID.
   */
  async update(id: string, data: CompetitionUpdateInput): Promise<Competition | null> {
    const fields: string[] = [];
    const values: (string | number | boolean | Date)[] = [];
    let paramIndex = 1;
    
    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }
    if (data.slug !== undefined) {
      fields.push(`slug = $${paramIndex}`);
      values.push(data.slug);
      paramIndex++;
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }
    if (data.short_description !== undefined) {
      fields.push(`short_description = $${paramIndex}`);
      values.push(data.short_description);
      paramIndex++;
    }
    if (data.prize_value !== undefined) {
      fields.push(`prize_value = $${paramIndex}`);
      values.push(data.prize_value);
      paramIndex++;
    }
    if (data.ticket_price !== undefined) {
      fields.push(`ticket_price = $${paramIndex}`);
      values.push(data.ticket_price);
      paramIndex++;
    }
    if (data.total_tickets !== undefined) {
      fields.push(`total_tickets = $${paramIndex}`);
      values.push(data.total_tickets);
      paramIndex++;
    }
    if (data.max_tickets_per_user !== undefined) {
      fields.push(`max_tickets_per_user = $${paramIndex}`);
      values.push(data.max_tickets_per_user);
      paramIndex++;
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramIndex}`);
      values.push(data.category);
      paramIndex++;
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(data.status);
      paramIndex++;
    }
    if (data.featured !== undefined) {
      fields.push(`featured = $${paramIndex}`);
      values.push(data.featured);
      paramIndex++;
    }
    if (data.end_date !== undefined) {
      fields.push(`end_date = $${paramIndex}`);
      values.push(data.end_date);
      paramIndex++;
    }
    if (data.draw_date !== undefined) {
      fields.push(`draw_date = $${paramIndex}`);
      values.push(data.draw_date);
      paramIndex++;
    }
    if (data.winner_user_id !== undefined) {
      fields.push(`winner_user_id = $${paramIndex}`);
      values.push(data.winner_user_id);
      paramIndex++;
    }
    if (data.winning_ticket_number !== undefined) {
      fields.push(`winning_ticket_number = $${paramIndex}`);
      values.push(data.winning_ticket_number);
      paramIndex++;
    }
    if (data.skill_question !== undefined) {
      fields.push(`skill_question = $${paramIndex}`);
      values.push(data.skill_question);
      paramIndex++;
    }
    if (data.skill_answer !== undefined) {
      fields.push(`skill_answer = $${paramIndex}`);
      values.push(data.skill_answer);
      paramIndex++;
    }
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const result = await pool.query(
      `UPDATE competitions SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  },

  /**
   * Delete a competition by ID.
   */
  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM competitions WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  },

  /**
   * Count the number of sold tickets for a competition.
   */
  async countSoldTickets(competitionId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) FROM tickets WHERE competition_id = $1',
      [competitionId]
    );
    return parseInt(result.rows[0].count, 10);
  },

  /**
   * Get the number of available tickets for a competition.
   */
  async getAvailableTickets(competitionId: string): Promise<number> {
    const competitionResult = await pool.query(
      'SELECT total_tickets FROM competitions WHERE id = $1',
      [competitionId]
    );
    
    if (competitionResult.rows.length === 0) {
      return 0;
    }
    
    const totalTickets = competitionResult.rows[0].total_tickets;
    const soldTickets = await this.countSoldTickets(competitionId);
    
    return totalTickets - soldTickets;
  }
};
