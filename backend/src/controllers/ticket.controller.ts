import { Request, Response, NextFunction } from 'express';
import { ticketModel } from '../models/ticket.model';
import { competitionModel } from '../models/competition.model';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import pool from '../config/database';

/**
 * Get user's tickets
 */
export const getMyTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { status, page, limit } = req.query;

    const options: any = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    };

    if (status) options.status = status as string;

    const tickets = await ticketModel.findByUser(userId, options);

    // Enrich tickets with competition info
    const enrichedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const competition = await competitionModel.findById(ticket.competition_id);
        return {
          ...ticket,
          competition: competition ? {
            id: competition.id,
            title: competition.title,
            slug: competition.slug,
            prize_value: competition.prize_value,
            status: competition.status,
            draw_date: competition.draw_date,
          } : null,
        };
      })
    );

    sendSuccess(res, {
      data: enrichedTickets,
      message: 'Tickets retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's ticket history grouped by order
 */
export const getTicketHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;

    // Get all paid orders for user
    const ordersResult = await pool.query(
      `SELECT
        o.id,
        o.order_number,
        o.total_amount as total_price,
        o.created_at as purchase_date,
        o.status
      FROM orders o
      WHERE o.user_id = $1 AND o.status = 'paid'
      ORDER BY o.created_at DESC`,
      [userId]
    );

    // For each order, get associated tickets
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const ticketsResult = await pool.query(
          `SELECT
            t.ticket_number,
            c.id as competition_id,
            c.title as competition_title,
            c.slug as competition_slug,
            c.winning_ticket_number,
            COALESCE(ci.image_url, '') as competition_image
          FROM tickets t
          JOIN competitions c ON t.competition_id = c.id
          LEFT JOIN competition_images ci ON ci.competition_id = c.id AND ci.is_primary = true
          WHERE t.order_id = $1
          ORDER BY t.ticket_number`,
          [order.id]
        );

        return {
          orderNumber: order.order_number,
          totalPrice: parseFloat(order.total_price),
          purchaseDate: order.purchase_date,
          tickets: ticketsResult.rows.map(ticket => ({
            competition: {
              id: ticket.competition_id,
              title: ticket.competition_title,
              slug: ticket.competition_slug,
              image: ticket.competition_image
            },
            ticketNumber: ticket.ticket_number,
            isWinner: ticket.ticket_number === ticket.winning_ticket_number
          }))
        };
      })
    );

    return sendSuccess(res, {
      data: { orders },
      message: 'Ticket history retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's instant wins
 */
export const getInstantWins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;

    const tickets = await ticketModel.getUserInstantWins(userId);

    // Enrich tickets with competition info
    const enrichedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const competition = await competitionModel.findById(ticket.competition_id);
        return {
          ...ticket,
          competition: competition ? {
            id: competition.id,
            title: competition.title,
            slug: competition.slug,
          } : null,
        };
      })
    );

    sendSuccess(res, {
      data: enrichedTickets,
      message: 'Instant wins retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
