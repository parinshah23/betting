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
    const cart = await cartService.getCart(userId);

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
    const cart = await cartService.addItem(userId, {
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
      const cart = await cartService.removeItem(userId, competition_id);
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

    const cart = await cartService.updateItem(userId, competition_id, quantity);

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

    const cart = await cartService.removeItem(userId, itemId);

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

    if (!promo_code) {
      throw BadRequestError('Promo code is required');
    }

    // Get cart total for validation
    const cart = await cartService.getCart(userId);
    const cartTotal = cart.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);

    // Validate promo code against database
    const promoCodeModel = require('../models/promo-code.model').default;
    const validation = await promoCodeModel.validatePromoCode(promo_code, cartTotal);

    if (!validation.valid) {
      throw BadRequestError(validation.error || 'Invalid promo code');
    }

    // Apply promo code to cart
    const updatedCart = await cartService.applyPromoCode(userId, promo_code.toUpperCase(), validation.discountValue);

    sendSuccess(res, {
      data: updatedCart,
      message: `Promo code applied: £${validation.discountValue.toFixed(2)} discount`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove promo code
 */
export const removePromoCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const cart = await cartService.removePromoCode(userId);

    sendSuccess(res, {
      data: cart,
      message: 'Promo code removed',
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
    await cartService.clearCart(userId);

    sendSuccess(res, {
      data: null,
      message: 'Cart cleared',
    });
  } catch (error) {
    next(error);
  }
};
