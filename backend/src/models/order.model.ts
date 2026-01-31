import pool from '../config/database';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  subtotal: number;
  discount_amount: number;
  wallet_amount_used: number;
  total_amount: number;
  payment_method: string;
  stripe_payment_intent_id: string;
  promo_code: string;
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  competition_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: Date;
}

export interface OrderCreateInput {
  user_id: string;
  order_number: string;
  status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  subtotal: number;
  discount_amount?: number;
  wallet_amount_used?: number;
  total_amount: number;
  payment_method?: string;
  stripe_payment_intent_id?: string;
  promo_code?: string;
}

export interface OrderItemInput {
  competition_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export const orderModel = {
  /**
   * Find orders by user ID with optional pagination and status filter.
   */
  async findByUser(
    userId: string,
    options: { page?: number; limit?: number; status?: string } = {}
  ): Promise<{ orders: Order[]; total: number }> {
    const { page = 1, limit = 10, status } = options;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = $1';
    const params: (string | number)[] = [userId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM orders ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const ordersResult = await pool.query(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      orders: ordersResult.rows,
      total,
    };
  },

  /**
   * Find an order by ID.
   */
  async findById(id: string): Promise<Order | null> {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Find an order by order number.
   */
  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const result = await pool.query('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
    return result.rows[0] || null;
  },

  /**
   * Create a new order.
   */
  async create(data: OrderCreateInput): Promise<Order> {
    const result = await pool.query(
      `INSERT INTO orders (
        user_id, order_number, status, subtotal, discount_amount,
        wallet_amount_used, total_amount, payment_method,
        stripe_payment_intent_id, promo_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.user_id,
        data.order_number,
        data.status || 'pending',
        data.subtotal,
        data.discount_amount || 0,
        data.wallet_amount_used || 0,
        data.total_amount,
        data.payment_method || null,
        data.stripe_payment_intent_id || null,
        data.promo_code || null,
      ]
    );
    return result.rows[0];
  },

  /**
   * Update order status.
   */
  async updateStatus(id: string, status: string): Promise<Order | null> {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] || null;
  },

  /**
   * Add an item to an order.
   */
  async addOrderItem(orderId: string, item: OrderItemInput): Promise<OrderItem> {
    const result = await pool.query(
      `INSERT INTO order_items (order_id, competition_id, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [orderId, item.competition_id, item.quantity, item.unit_price, item.total_price]
    );
    return result.rows[0];
  },

  /**
   * Get all items for an order.
   */
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const result = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at ASC',
      [orderId]
    );
    return result.rows;
  },

  /**
   * Get an order with all its items.
   */
  async getOrderWithItems(orderId: string): Promise<Order | null> {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (!orderResult.rows[0]) {
      return null;
    }

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at ASC',
      [orderId]
    );

    return {
      ...orderResult.rows[0],
      items: itemsResult.rows,
    };
  },

  /**
   * Generate a unique order number.
   */
  generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  },
};
