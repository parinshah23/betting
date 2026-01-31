import { Request, Response, NextFunction } from 'express';
import { competitionModel } from '../models/competition.model';
import { ticketModel } from '../models/ticket.model';
import { orderModel } from '../models/order.model';
import { userModel } from '../models/user.model';
import { walletModel } from '../models/wallet.model';
import { contentPageModel, winnerGalleryModel } from '../models/content.model';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError, BadRequestError } from '../middleware/errorHandler';
import pool from '../config/database';

/**
 * Get all competitions (admin view)
 */
export const getAllCompetitions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page, limit } = req.query;

    const options: any = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    };

    if (status) options.status = status as string;

    const { competitions, total } = await competitionModel.findAll(options);

    // Add ticket stats for each competition
    const competitionsWithStats = await Promise.all(
      competitions.map(async (comp) => {
        const sold = await competitionModel.countSoldTickets(comp.id);
        const available = comp.total_tickets - sold;
        
        return {
          ...comp,
          stats: {
            total_tickets: comp.total_tickets,
            sold_tickets: sold,
            available_tickets: available,
            progress_percentage: Math.round((sold / comp.total_tickets) * 100),
          },
        };
      })
    );

    sendPaginated(res, competitionsWithStats, options.page, options.limit, total);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new competition
 */
export const createCompetition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    
    // Create competition
    const competition = await competitionModel.create(data);
    
    // Create tickets for the competition
    await ticketModel.createTicketsForCompetition(competition.id, competition.total_tickets);

    sendSuccess(res, {
      data: competition,
      message: 'Competition created successfully',
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get competition by ID (admin view)
 */
export const getCompetitionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const competition = await competitionModel.findById(id);

    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    // Get ticket stats
    const sold = await competitionModel.countSoldTickets(id);
    const available = competition.total_tickets - sold;

    // Get entries (sold tickets with user info)
    const entries = await pool.query(
      `SELECT t.*, u.email, u.first_name, u.last_name 
       FROM tickets t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.competition_id = $1 AND t.status = 'sold'
       ORDER BY t.ticket_number`,
      [id]
    );

    sendSuccess(res, {
      data: {
        ...competition,
        stats: {
          total_tickets: competition.total_tickets,
          sold_tickets: sold,
          available_tickets: available,
          progress_percentage: Math.round((sold / competition.total_tickets) * 100),
        },
        entries: entries.rows,
      },
      message: 'Competition retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a competition
 */
export const updateCompetition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const competition = await competitionModel.update(id, data);

    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    sendSuccess(res, {
      data: competition,
      message: 'Competition updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a competition
 */
export const deleteCompetition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deleted = await competitionModel.delete(id);

    if (!deleted) {
      throw NotFoundError('Competition not found');
    }

    sendSuccess(res, {
      data: null,
      message: 'Competition deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Duplicate a competition
 */
export const duplicateCompetition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const original = await competitionModel.findById(id);
    if (!original) {
      throw NotFoundError('Competition not found');
    }

    // Create new competition with same data but new slug
    const newCompetition = await competitionModel.create({
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      description: original.description,
      short_description: original.short_description,
      prize_value: original.prize_value,
      ticket_price: original.ticket_price,
      total_tickets: original.total_tickets,
      max_tickets_per_user: original.max_tickets_per_user,
      category: original.category,
      status: 'draft',
      featured: false,
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      skill_question: original.skill_question,
      skill_answer: original.skill_answer,
    });

    // Create tickets
    await ticketModel.createTicketsForCompetition(newCompetition.id, newCompetition.total_tickets);

    sendSuccess(res, {
      data: newCompetition,
      message: 'Competition duplicated successfully',
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Set instant win tickets
 */
export const setInstantWins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { ticket_numbers, prize } = req.body;

    const competition = await competitionModel.findById(id);
    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    // Update specified tickets as instant wins
    for (const ticketNumber of ticket_numbers) {
      await pool.query(
        `UPDATE tickets 
         SET is_instant_win = true, instant_win_prize = $1 
         WHERE competition_id = $2 AND ticket_number = $3`,
        [prize, id, ticketNumber]
      );
    }

    sendSuccess(res, {
      data: {
        competition_id: id,
        instant_win_count: ticket_numbers.length,
        prize,
      },
      message: 'Instant win tickets set successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get competition entries (for CSV export)
 */
export const getCompetitionEntries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const competition = await competitionModel.findById(id);
    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    const result = await pool.query(
      `SELECT 
        t.ticket_number,
        t.purchased_at,
        u.email,
        u.first_name,
        u.last_name,
        u.phone
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       WHERE t.competition_id = $1 AND t.status = 'sold'
       ORDER BY t.ticket_number`,
      [id]
    );

    // Format as CSV
    const headers = ['Ticket Number', 'Purchased At', 'Email', 'First Name', 'Last Name', 'Phone'];
    const rows = result.rows.map(row => [
      row.ticket_number,
      row.purchased_at,
      row.email,
      row.first_name,
      row.last_name,
      row.phone || '',
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="entries-${competition.slug}.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * Execute draw for a competition
 */
export const executeDraw = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const competition = await competitionModel.findById(id);
    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    // Get all sold tickets
    const soldTickets = await ticketModel.findByCompetition(id, { status: 'sold' });
    
    if (soldTickets.length === 0) {
      throw BadRequestError('No tickets sold for this competition');
    }

    // Randomly select winner
    const winnerIndex = Math.floor(Math.random() * soldTickets.length);
    const winningTicket = soldTickets[winnerIndex];

    // Update competition with winner
    await competitionModel.update(id, {
      status: 'completed',
      winner_user_id: winningTicket.user_id,
      winning_ticket_number: winningTicket.ticket_number,
    });

    // Get winner details
    const winner = await userModel.findById(winningTicket.user_id);

    sendSuccess(res, {
      data: {
        competition_id: id,
        winner: {
          user_id: winningTicket.user_id,
          ticket_number: winningTicket.ticket_number,
          email: winner?.email,
          first_name: winner?.first_name,
          last_name: winner?.last_name,
        },
        total_entries: soldTickets.length,
      },
      message: 'Draw executed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// User Management

/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = req.query;

    const pageNum = page ? parseInt(page as string, 10) : 1;
    const limitNum = limit ? parseInt(limit as string, 10) : 20;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = '';
    const params: (string | number)[] = [];
    
    if (search) {
      whereClause = 'WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1';
      params.push(`%${search}%`);
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const queryParams = [...params, limitNum, offset];
    const usersResult = await pool.query(
      `SELECT id, email, first_name, last_name, phone, role, email_verified, is_banned, created_at 
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      queryParams
    );

    sendPaginated(res, usersResult.rows, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      throw NotFoundError('User not found');
    }

    // Get user's wallet
    const wallet = await walletModel.findByUserId(id);

    // Get user's recent orders
    const { orders } = await orderModel.findByUser(id, { limit: 5 });

    // Get user's ticket count
    const ticketsResult = await pool.query(
      'SELECT COUNT(*) FROM tickets WHERE user_id = $1 AND status = $2',
      [id, 'sold']
    );
    const ticketCount = parseInt(ticketsResult.rows[0].count, 10);

    sendSuccess(res, {
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
        is_banned: user.is_banned,
        created_at: user.created_at,
        wallet: wallet ? {
          id: wallet.id,
          balance: wallet.balance,
        } : null,
        stats: {
          total_orders: orders.length,
          total_tickets: ticketCount,
        },
        recent_orders: orders,
      },
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, role } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      throw NotFoundError('User not found');
    }

    // Build update query
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

    if (role !== undefined) {
      updates.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw BadRequestError('No fields to update');
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    sendSuccess(res, {
      data: result.rows[0],
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ban/unban user
 */
export const toggleBanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { is_banned } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      throw NotFoundError('User not found');
    }

    await pool.query(
      'UPDATE users SET is_banned = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [is_banned, id]
    );

    sendSuccess(res, {
      data: { id, is_banned },
      message: is_banned ? 'User banned successfully' : 'User unbanned successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Adjust user wallet
 */
export const adjustWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      throw NotFoundError('User not found');
    }

    let wallet = await walletModel.findByUserId(id);
    if (!wallet) {
      wallet = await walletModel.create(id);
    }

    let transaction;
    if (amount > 0) {
      transaction = await walletModel.credit(
        wallet.id,
        amount,
        description || 'Admin credit',
        'admin_adjustment'
      );
    } else if (amount < 0) {
      transaction = await walletModel.debit(
        wallet.id,
        Math.abs(amount),
        description || 'Admin debit',
        'admin_adjustment'
      );
    } else {
      throw BadRequestError('Amount cannot be zero');
    }

    sendSuccess(res, {
      data: {
        transaction,
        new_balance: transaction.balance_after,
      },
      message: 'Wallet adjusted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Order Management

/**
 * Get all orders
 */
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page, limit } = req.query;

    const pageNum = page ? parseInt(page as string, 10) : 1;
    const limitNum = limit ? parseInt(limit as string, 10) : 20;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = '';
    const params: (string | number)[] = [];
    
    if (status) {
      whereClause = 'WHERE status = $1';
      params.push(status as string);
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM orders ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const queryParams = [...params, limitNum, offset];
    const ordersResult = await pool.query(
      `SELECT o.*, u.email, u.first_name, u.last_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      queryParams
    );

    // Get items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const items = await orderModel.getOrderItems(order.id);
        return { ...order, items };
      })
    );

    sendPaginated(res, ordersWithItems, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await orderModel.getOrderWithItems(id);
    if (!order) {
      throw NotFoundError('Order not found');
    }

    // Get user details
    const user = await userModel.findById(order.user_id);

    sendSuccess(res, {
      data: {
        ...order,
        user: user ? {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        } : null,
      },
      message: 'Order retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refund order
 */
export const refundOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await orderModel.findById(id);
    if (!order) {
      throw NotFoundError('Order not found');
    }

    if (order.status !== 'paid') {
      throw BadRequestError('Only paid orders can be refunded');
    }

    // Update order status
    await orderModel.updateStatus(id, 'refunded');

    // Return tickets to available pool
    await pool.query(
      `UPDATE tickets 
       SET status = 'available', user_id = NULL, order_id = NULL, purchased_at = NULL
       WHERE order_id = $1`,
      [id]
    );

    // Credit wallet if wallet was used
    if (order.wallet_amount_used > 0) {
      const wallet = await walletModel.findByUserId(order.user_id);
      if (wallet) {
        await walletModel.credit(
          wallet.id,
          order.wallet_amount_used,
          `Refund for order ${order.order_number}: ${reason || 'No reason provided'}`,
          id
        );
      }
    }

    sendSuccess(res, {
      data: { id, status: 'refunded' },
      message: 'Order refunded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Content Management

/**
 * Get all content pages
 */
export const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await contentPageModel.findAll();

    sendSuccess(res, {
      data: pages,
      message: 'Content pages retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update content page
 */
export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const data = req.body;

    // Check if page exists
    const existing = await contentPageModel.findBySlug(slug);
    
    let page;
    if (existing) {
      page = await contentPageModel.update(existing.id, { ...data, slug });
    } else {
      page = await contentPageModel.create({ ...data, slug });
    }

    sendSuccess(res, {
      data: page,
      message: 'Content page updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add winner to gallery
 */
export const addWinnerToGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const winner = await winnerGalleryModel.create(data);

    sendSuccess(res, {
      data: winner,
      message: 'Winner added to gallery successfully',
    }, 201);
  } catch (error) {
    next(error);
  }
};
