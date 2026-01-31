import { Request, Response, NextFunction } from 'express';
import { winnerGalleryModel } from '../models/content.model';
import { competitionModel } from '../models/competition.model';
import { userModel } from '../models/user.model';
import { sendSuccess, sendPaginated } from '../utils/response';

/**
 * Get all winners
 */
export const getWinners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { featured, page, limit } = req.query;

    const options: any = {};
    
    if (featured !== undefined) {
      options.featured = featured === 'true';
    }
    
    if (page && limit) {
      options.page = parseInt(page as string, 10);
      options.limit = parseInt(limit as string, 10);
    }

    const winners = await winnerGalleryModel.findAll(options);

    // Enrich winners with competition and user info
    const enrichedWinners = await Promise.all(
      winners.map(async (winner) => {
        const competition = await competitionModel.findById(winner.competition_id);
        const user = await userModel.findById(winner.user_id);
        
        return {
          ...winner,
          competition: competition ? {
            id: competition.id,
            title: competition.title,
            slug: competition.slug,
            prize_value: competition.prize_value,
          } : null,
          user: user ? {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
          } : null,
        };
      })
    );

    if (page && limit) {
      // If paginated, we need total count
      const allWinners = await winnerGalleryModel.findAll({ featured: options.featured });
      sendPaginated(
        res,
        enrichedWinners,
        options.page,
        options.limit,
        allWinners.length
      );
    } else {
      sendSuccess(res, {
        data: enrichedWinners,
        message: 'Winners retrieved successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent winners
 */
export const getRecentWinners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = req.query;
    const winnersLimit = limit ? parseInt(limit as string, 10) : 5;

    const winners = await winnerGalleryModel.findRecent(winnersLimit);

    // Enrich winners with competition info
    const enrichedWinners = await Promise.all(
      winners.map(async (winner) => {
        const competition = await competitionModel.findById(winner.competition_id);
        
        return {
          ...winner,
          competition: competition ? {
            id: competition.id,
            title: competition.title,
            slug: competition.slug,
            prize_value: competition.prize_value,
          } : null,
        };
      })
    );

    sendSuccess(res, {
      data: enrichedWinners,
      message: 'Recent winners retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
