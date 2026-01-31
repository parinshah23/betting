import pool from '../config/database';

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ContentPageInput {
  slug: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;
}

export interface WinnerGallery {
  id: string;
  competition_id: string;
  user_id: string;
  display_name: string;
  testimonial: string;
  photo_url: string;
  featured: boolean;
  created_at: Date;
}

export interface WinnerGalleryInput {
  competition_id: string;
  user_id: string;
  display_name?: string;
  testimonial?: string;
  photo_url?: string;
  featured?: boolean;
}

export const contentPageModel = {
  /**
   * Find all content pages with optional filter.
   */
  async findAll(options: { is_published?: boolean } = {}): Promise<ContentPage[]> {
    let query = 'SELECT * FROM content_pages';
    const params: (boolean | string)[] = [];

    if (options.is_published !== undefined) {
      query += ' WHERE is_published = $1';
      params.push(options.is_published);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Find a content page by slug.
   */
  async findBySlug(slug: string): Promise<ContentPage | null> {
    const result = await pool.query('SELECT * FROM content_pages WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  },

  /**
   * Find a content page by ID.
   */
  async findById(id: string): Promise<ContentPage | null> {
    const result = await pool.query('SELECT * FROM content_pages WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Create a new content page.
   */
  async create(data: ContentPageInput): Promise<ContentPage> {
    const result = await pool.query(
      `INSERT INTO content_pages (slug, title, content, meta_title, meta_description, is_published)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.slug,
        data.title,
        data.content,
        data.meta_title || null,
        data.meta_description || null,
        data.is_published !== undefined ? data.is_published : true
      ]
    );
    return result.rows[0];
  },

  /**
   * Update a content page.
   */
  async update(id: string, data: ContentPageInput): Promise<ContentPage | null> {
    const result = await pool.query(
      `UPDATE content_pages
       SET slug = $1, title = $2, content = $3, meta_title = $4, meta_description = $5, is_published = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        data.slug,
        data.title,
        data.content,
        data.meta_title || null,
        data.meta_description || null,
        data.is_published !== undefined ? data.is_published : true,
        id
      ]
    );
    return result.rows[0] || null;
  },

  /**
   * Delete a content page.
   */
  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM content_pages WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};

export const winnerGalleryModel = {
  /**
   * Find all winners with optional filters and pagination.
   */
  async findAll(options: { featured?: boolean; page?: number; limit?: number } = {}): Promise<WinnerGallery[]> {
    let query = 'SELECT * FROM winners_gallery';
    const params: (boolean | number | string)[] = [];
    let paramIndex = 1;

    if (options.featured !== undefined) {
      query += ' WHERE featured = $1';
      params.push(options.featured);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit !== undefined) {
      query += ` LIMIT $${paramIndex}`;
      params.push(options.limit);
      paramIndex++;

      if (options.page !== undefined && options.page > 1) {
        const offset = (options.page - 1) * options.limit;
        query += ` OFFSET $${paramIndex}`;
        params.push(offset);
      }
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Find recent winners.
   */
  async findRecent(limit: number): Promise<WinnerGallery[]> {
    const result = await pool.query(
      'SELECT * FROM winners_gallery ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },

  /**
   * Find a winner by ID.
   */
  async findById(id: string): Promise<WinnerGallery | null> {
    const result = await pool.query('SELECT * FROM winners_gallery WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Create a new winner gallery entry.
   */
  async create(data: WinnerGalleryInput): Promise<WinnerGallery> {
    const result = await pool.query(
      `INSERT INTO winners_gallery (competition_id, user_id, display_name, testimonial, photo_url, featured)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.competition_id,
        data.user_id,
        data.display_name || null,
        data.testimonial || null,
        data.photo_url || null,
        data.featured !== undefined ? data.featured : false
      ]
    );
    return result.rows[0];
  },

  /**
   * Update a winner gallery entry.
   */
  async update(id: string, data: WinnerGalleryInput): Promise<WinnerGallery | null> {
    const result = await pool.query(
      `UPDATE winners_gallery
       SET competition_id = $1, user_id = $2, display_name = $3, testimonial = $4, photo_url = $5, featured = $6
       WHERE id = $7
       RETURNING *`,
      [
        data.competition_id,
        data.user_id,
        data.display_name || null,
        data.testimonial || null,
        data.photo_url || null,
        data.featured !== undefined ? data.featured : false,
        id
      ]
    );
    return result.rows[0] || null;
  },

  /**
   * Delete a winner gallery entry.
   */
  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM winners_gallery WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};
