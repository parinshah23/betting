import { Request, Response, NextFunction } from 'express';
import { competitionModel } from '../models/competition.model';
import { ticketModel } from '../models/ticket.model';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError } from '../middleware/errorHandler';
import pool from '../config/database';

/**
 * Get all competitions with filtering and pagination
 */
export const getCompetitions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, category, featured, page, limit } = req.query;
    
    const options: any = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    };

    if (status) options.status = status as string;
    if (category) options.category = category as string;
    if (featured !== undefined) options.featured = featured === 'true';

    const { competitions, total } = await competitionModel.findAll(options);

    // Get available tickets count for each competition
    const competitionsWithAvailability = await Promise.all(
      competitions.map(async (comp) => {
        const availableTickets = await competitionModel.getAvailableTickets(comp.id);
        const soldTickets = comp.total_tickets - availableTickets;
        const progress = Math.round((soldTickets / comp.total_tickets) * 100);
        
        return {
          ...comp,
          available_tickets: availableTickets,
          sold_tickets: soldTickets,
          progress_percentage: progress,
        };
      })
    );

    sendPaginated(
      res,
      competitionsWithAvailability,
      options.page,
      options.limit,
      total
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured competitions
 */
export const getFeaturedCompetitions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const competitions = await competitionModel.findFeatured();

    // Get available tickets count for each competition
    const competitionsWithAvailability = await Promise.all(
      competitions.map(async (comp) => {
        const availableTickets = await competitionModel.getAvailableTickets(comp.id);
        const soldTickets = comp.total_tickets - availableTickets;
        const progress = Math.round((soldTickets / comp.total_tickets) * 100);
        
        return {
          ...comp,
          available_tickets: availableTickets,
          sold_tickets: soldTickets,
          progress_percentage: progress,
        };
      })
    );

    sendSuccess(res, {
      data: competitionsWithAvailability,
      message: 'Featured competitions retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single competition by slug
 */
export const getCompetitionBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const competition = await competitionModel.findBySlug(slug);

    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    const availableTickets = await competitionModel.getAvailableTickets(competition.id);
    const soldTickets = competition.total_tickets - availableTickets;
    const progress = Math.round((soldTickets / competition.total_tickets) * 100);

    // Get competition images
    const imagesResult = await pool.query(
      'SELECT id, image_url, alt_text, sort_order, is_primary FROM competition_images WHERE competition_id = $1 ORDER BY sort_order ASC',
      [competition.id]
    );
    const images = imagesResult.rows;

    sendSuccess(res, {
      data: {
        ...competition,
        available_tickets: availableTickets,
        sold_tickets: soldTickets,
        progress_percentage: progress,
        images,
      },
      message: 'Competition retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tickets for a competition
 */
export const getCompetitionTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const competition = await competitionModel.findById(id);

    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    const tickets = await ticketModel.findByCompetition(id, { status: 'available' });

    sendSuccess(res, {
      data: {
        competition_id: id,
        total_tickets: competition.total_tickets,
        available_tickets: tickets.length,
        tickets: tickets.map(t => ({
          id: t.id,
          ticket_number: t.ticket_number,
          status: t.status,
        })),
      },
      message: 'Tickets retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify skill-based answer
 */
export const verifyAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { competition_id, answer } = req.body;
    
    const competition = await competitionModel.findById(competition_id);
    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    // Normalize answers for comparison (case-insensitive, trim whitespace)
    const normalizedAnswer = answer.toString().trim().toLowerCase();
    const normalizedCorrectAnswer = competition.skill_answer.toString().trim().toLowerCase();

    const isCorrect = normalizedAnswer === normalizedCorrectAnswer;

    sendSuccess(res, {
      data: {
        is_correct: isCorrect,
        competition_id,
      },
      message: isCorrect ? 'Correct answer!' : 'Incorrect answer. Please try again.',
    });
  } catch (error) {
    next(error);
  }
};
