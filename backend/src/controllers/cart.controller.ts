import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service';
import { competitionModel } from '../models/competition.model';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler';

/**
 * Get user's cart
 */
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const cart = cartService.getCart(userId);

    sendSuccess(res, {
      data: cart,
      message: 'Cart retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { competition_id, quantity } = req.body;

    // Get competition details
    const competition = await competitionModel.findById(competition_id);
    if (!competition) {
      throw NotFoundError('Competition not found');
    }

    // Check if competition is live
    if (competition.status !== 'live') {
      throw BadRequestError('This competition is not available for purchase');
    }

    // Check available tickets
    const availableTickets = await competitionModel.getAvailableTickets(competition_id);
    if (availableTickets < quantity) {
      throw BadRequestError(`Only ${availableTickets} tickets available`);
    }

    // Add to cart
    const cart = cartService.addItem(userId, {
      competition_id,
      quantity,
      unit_price: competition.ticket_price,
      competition_title: competition.title,
      competition_slug: competition.slug,
    });

    sendSuccess(res, {
      data: cart,
      message: 'Item added to cart',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { competition_id, quantity } = req.body;

    if (quantity === 0) {
      // Remove item if quantity is 0
      const cart = cartService.removeItem(userId, competition_id);
      return sendSuccess(res, {
        data: cart,
        message: 'Item removed from cart',
      });
    }

    // Check available tickets
    const competition = await competitionModel.findById(competition_id);
    if (competition) {
      const availableTickets = await competitionModel.getAvailableTickets(competition_id);
      if (availableTickets < quantity) {
        throw BadRequestError(`Only ${availableTickets} tickets available`);
      }
    }

    const cart = cartService.updateItem(userId, competition_id, quantity);

    sendSuccess(res, {
      data: cart,
      message: 'Cart updated',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { itemId } = req.params; // itemId is competition_id

    const cart = cartService.removeItem(userId, itemId);

    sendSuccess(res, {
      data: cart,
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Apply promo code
 */
export const applyPromoCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { promo_code } = req.body;

    // TODO: Validate promo code against database
    // For now, accept any promo code with 10% discount
    const validPromoCodes: Record<string, number> = {
      'WELCOME10': 10,
      'RAFFLE10': 10,
      'SAVE20': 20,
    };

    const discountPercent = validPromoCodes[promo_code.toUpperCase()];
    
    if (discountPercent === undefined) {
      throw BadRequestError('Invalid promo code');
    }

    const cart = cartService.applyPromoCode(userId, promo_code.toUpperCase(), discountPercent);

    sendSuccess(res, {
      data: cart,
      message: `Promo code applied: ${discountPercent}% discount`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear cart
 */
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    cartService.clearCart(userId);

    sendSuccess(res, {
      data: null,
      message: 'Cart cleared',
    });
  } catch (error) {
    next(error);
  }
};
