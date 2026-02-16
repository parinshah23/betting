import { Request, Response, NextFunction } from 'express';
import { winnerGalleryModel } from '../models/content.model';
import { competitionModel } from '../models/competition.model';
import { userModel } from '../models/user.model';
import { ticketModel } from '../models/ticket.model';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import pool from '../config/database';

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

/**
 * Get current user's wins
 */
export const getMyWins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;

    // Find completed competitions where this user's ticket was the winner
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Get all completed competitions where user won
    const competitions = await competitionModel.findAll({
      status: 'completed',
      page: 1,
      limit: 1000, // Get all to filter
    });

    // Also check winner_claims for claim status
    const winnerModel = require('../models/winner.model').default;

    // Filter competitions where current user is the winner
    const userWins = [];
    for (const comp of competitions.competitions) {
      if (comp.winner_user_id === userId) {
        // Get the winning ticket
        const tickets = await ticketModel.findByCompetition(comp.id, {});
        const winningTicket = tickets.find(t => t.ticket_number === comp.winning_ticket_number);

        // Check if claimed
        const claim = await winnerModel.findByCompetitionAndUser(comp.id, userId);

        userWins.push({
          id: `${comp.id}-${comp.winning_ticket_number}`,
          competition_id: comp.id,
          competitionId: comp.id,
          user_id: userId,
          ticket_number: comp.winning_ticket_number,
          prize_value: comp.prize_value,
          won_at: comp.draw_date || comp.updated_at,
          claimed: claim?.claimed || false,
          claimDate: claim?.claim_date || null,
          prizeType: claim?.prize_type || 'physical',
          deliveryStatus: claim?.delivery_status || 'pending',
          trackingNumber: claim?.tracking_number || null,
          competition: {
            id: comp.id,
            title: comp.title,
            slug: comp.slug,
            prize_value: comp.prize_value,
          },
          ticket: winningTicket ? {
            id: winningTicket.id,
            ticket_number: winningTicket.ticket_number,
          } : null,
        });
      }
    }

    // Paginate results
    const total = userWins.length;
    const paginatedWins = userWins.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    sendPaginated(res, paginatedWins, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * Claim a prize
 * POST /api/winners/:competitionId/claim
 */
export const claimPrize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { competitionId } = req.params;
    const { prize_type, claim_address } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Validate input
    if (!prize_type || !['physical', 'cash', 'voucher'].includes(prize_type)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid prize type. Must be physical, cash, or voucher.' }
      });
    }

    // Import winner model
    const winnerModel = require('../models/winner.model').default;

    // Claim the prize
    const claim = await winnerModel.claimPrize(competitionId, userId, {
      prize_type,
      claim_address
    });

    return res.status(200).json({
      success: true,
      data: claim
    });
  } catch (error: any) {
    console.error('Claim prize error:', error);
    return res.status(400).json({
      success: false,
      error: { message: error.message || 'Failed to claim prize' }
    });
  }
};

/**
 * Download winner certificate
 * GET /api/winners/:competitionId/certificate
 */
export const downloadCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { competitionId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Verify user is winner
    const winnerResult = await pool.query(
      `SELECT
        wc.ticket_number,
        wc.created_at as won_date,
        c.title as competition_title,
        c.prize_value,
        u.first_name,
        u.last_name
      FROM winner_claims wc
      JOIN competitions c ON wc.competition_id = c.id
      JOIN users u ON wc.user_id = u.id
      WHERE wc.competition_id = $1 AND wc.user_id = $2`,
      [competitionId, userId]
    );

    if (winnerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'No winning ticket found for this competition' }
      });
    }

    const winner = winnerResult.rows[0];

    // Generate certificate PDF
    const certificateService = require('../services/certificate.service').default;
    const pdfBuffer = await certificateService.generateCertificate({
      userName: `${winner.first_name} ${winner.last_name}`,
      competitionTitle: winner.competition_title,
      prizeValue: parseFloat(winner.prize_value),
      ticketNumber: winner.ticket_number,
      wonDate: new Date(winner.won_date)
    });

    // Set headers for PDF download
    const filename = `${winner.competition_title.replace(/\s+/g, '-')}-certificate.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Download certificate error:', error);
    return res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to generate certificate' }
    });
  }
};

