import { Request, Response, NextFunction } from 'express';
import { ticketModel } from '../models/ticket.model';
import { competitionModel } from '../models/competition.model';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

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
 * Get user's ticket history
 */
export const getTicketHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { page, limit } = req.query;

    const tickets = await ticketModel.getUserTicketHistory(
      userId,
      page ? parseInt(page as string, 10) : 1,
      limit ? parseInt(limit as string, 10) : 20
    );

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
            winner_user_id: competition.winner_user_id,
            winning_ticket_number: competition.winning_ticket_number,
          } : null,
        };
      })
    );

    sendSuccess(res, {
      data: enrichedTickets,
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
