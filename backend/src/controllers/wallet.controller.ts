import { Request, Response, NextFunction } from 'express';
import { walletModel } from '../models/wallet.model';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { BadRequestError } from '../middleware/errorHandler';
import { config } from '../config/env';
import Stripe from 'stripe';

// Initialize Stripe (only if key is available)
const stripe = config.stripe.secretKey 
  ? new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' })
  : null;

/**
 * Get user's wallet
 */
export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    let wallet = await walletModel.findByUserId(userId);
    
    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await walletModel.create(userId);
    }

    sendSuccess(res, {
      data: {
        id: wallet.id,
        balance: wallet.balance,
        created_at: wallet.created_at,
        updated_at: wallet.updated_at,
      },
      message: 'Wallet retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get wallet transactions
 */
export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { page, limit, type } = req.query;

    const wallet = await walletModel.findByUserId(userId);
    
    if (!wallet) {
      // Return empty transactions if wallet doesn't exist
      return sendPaginated(res, [], 1, 20, 0);
    }

    const options: any = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    };

    if (type) options.type = type as string;

    const { transactions, total } = await walletModel.getTransactions(wallet.id, options);

    sendPaginated(res, transactions, options.page, options.limit, total);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a deposit (Stripe payment intent)
 */
export const createDeposit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { amount } = req.body;

    if (!stripe) {
      throw BadRequestError('Payment processing is not configured');
    }

    // Get or create wallet
    let wallet = await walletModel.findByUserId(userId);
    if (!wallet) {
      wallet = await walletModel.create(userId);
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: userId,
        wallet_id: wallet.id,
        type: 'wallet_deposit',
        amount: amount.toString(),
      },
    });

    sendSuccess(res, {
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount,
      },
      message: 'Deposit initiated. Complete payment to add funds.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm deposit after payment
 */
export const confirmDeposit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { payment_intent_id } = req.body;

    if (!stripe) {
      throw BadRequestError('Payment processing is not configured');
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      throw BadRequestError('Payment not successful');
    }

    // Get wallet
    let wallet = await walletModel.findByUserId(userId);
    if (!wallet) {
      wallet = await walletModel.create(userId);
    }

    // Get amount from metadata
    const amount = parseFloat(paymentIntent.metadata.amount);

    // Credit wallet
    const transaction = await walletModel.credit(
      wallet.id,
      amount,
      'Wallet deposit via Stripe',
      payment_intent_id
    );

    sendSuccess(res, {
      data: {
        transaction,
        new_balance: transaction.balance_after,
      },
      message: 'Deposit successful',
    });
  } catch (error) {
    next(error);
  }
};
