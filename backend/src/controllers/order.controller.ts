import { Request, Response, NextFunction } from 'express';
import { orderModel } from '../models/order.model';
import { ticketModel } from '../models/ticket.model';
import { walletModel } from '../models/wallet.model';
import { competitionModel } from '../models/competition.model';
import { userModel } from '../models/user.model';
import { cartService } from '../services/cart.service';
import { emailService } from '../services/email.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler';
import { config } from '../config/env';
import Stripe from 'stripe';

// Initialize Stripe (only if key is available)
const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' })
  : null;

/**
 * Get user's orders
 */
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { status, page, limit } = req.query;

    const options: any = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10,
    };

    if (status) options.status = status as string;

    const { orders, total } = await orderModel.findByUser(userId, options);

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await orderModel.getOrderItems(order.id);
        return {
          ...order,
          items,
        };
      })
    );

    sendPaginated(res, ordersWithItems, options.page, options.limit, total);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;

    const order = await orderModel.getOrderWithItems(id);

    if (!order) {
      throw NotFoundError('Order not found');
    }

    // Verify order belongs to user
    if (order.user_id !== userId) {
      throw BadRequestError('Access denied');
    }

    sendSuccess(res, {
      data: order,
      message: 'Order retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new order from cart
 */
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { use_wallet_balance } = req.body;

    // Get cart
    const cart = await cartService.getCart(userId);

    if (cart.items.length === 0) {
      throw BadRequestError('Cart is empty');
    }

    // Verify all items are still available
    for (const item of cart.items) {
      const available = await competitionModel.getAvailableTickets(item.competition_id);
      if (available < item.quantity) {
        throw BadRequestError(
          `Only ${available} tickets available for ${item.competition_title}`
        );
      }
    }

    // Calculate totals
    const subtotal = cart.subtotal;
    const discountAmount = cart.discount_amount;
    let walletAmountUsed = 0;

    // Check if using wallet balance
    if (use_wallet_balance) {
      const wallet = await walletModel.findByUserId(userId);
      if (wallet && wallet.balance > 0) {
        const remainingAfterDiscount = subtotal - discountAmount;
        walletAmountUsed = Math.min(wallet.balance, remainingAfterDiscount);
      }
    }

    const totalAmount = subtotal - discountAmount - walletAmountUsed;

    // Create order
    const order = await orderModel.create({
      user_id: userId,
      order_number: orderModel.generateOrderNumber(),
      status: 'pending',
      subtotal,
      discount_amount: discountAmount,
      wallet_amount_used: walletAmountUsed,
      total_amount: totalAmount,
      promo_code: cart.promo_code,
    });

    // Add order items
    for (const item of cart.items) {
      await orderModel.addOrderItem(order.id, {
        competition_id: item.competition_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      });
    }

    // Reserve tickets
    for (const item of cart.items) {
      await ticketModel.reserveTickets(item.competition_id, item.quantity, userId, order.id);
    }

    // NOTE: Don't clear cart here - only clear after successful payment
    // Cart will be cleared in confirmOrder for Stripe payments, or below for wallet-only

    // If total is 0 (fully paid with wallet), mark as paid immediately
    if (totalAmount === 0) {
      // Deduct from wallet
      const wallet = await walletModel.findByUserId(userId);
      if (wallet) {
        await walletModel.debit(wallet.id, walletAmountUsed, `Order ${order.order_number}`);
      }

      // Mark tickets as sold
      const items = await orderModel.getOrderItems(order.id);
      for (const item of items) {
        const tickets = await ticketModel.findByCompetition(item.competition_id, { status: 'reserved' });
        const ticketIds = tickets
          .filter(t => t.order_id === order.id)
          .map(t => t.id);
        await ticketModel.markAsSold(ticketIds);
      }

      await orderModel.updateStatus(order.id, 'paid');

      // Clear cart after successful wallet-only payment
      await cartService.clearCart(userId);

      const updatedOrder = await orderModel.getOrderWithItems(order.id);

      // Send order confirmation email for wallet-only payment
      if (updatedOrder) {
        const user = await userModel.findById(userId);
        if (user && updatedOrder.items) {
          const emailItems = updatedOrder.items.map((item) => ({
            title: `Competition #${item.competition_id}`,
            quantity: item.quantity,
          }));

          await emailService.sendOrderConfirmation(
            user.email,
            updatedOrder.order_number,
            updatedOrder.total_amount,
            emailItems
          );
        }
      }

      return sendSuccess(res, {
        data: updatedOrder,
        message: 'Order created and paid successfully',
      }, 201);
    }

    // Return order with payment intent info
    const orderWithItems = await orderModel.getOrderWithItems(order.id);

    sendSuccess(res, {
      data: {
        order: orderWithItems,
        requires_payment: true,
        amount_to_charge: totalAmount,
      },
      message: 'Order created. Proceed to payment.',
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Stripe payment intent
 */
export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { order_id } = req.body;

    const order = await orderModel.findById(order_id);

    if (!order) {
      throw NotFoundError('Order not found');
    }

    if (order.user_id !== userId) {
      throw BadRequestError('Access denied');
    }

    if (order.status !== 'pending') {
      throw BadRequestError('Order is not pending payment');
    }

    if (!stripe) {
      throw BadRequestError('Payment processing is not configured');
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Convert to cents
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_id: order.id,
        user_id: userId,
        order_number: order.order_number,
      },
    });

    // Update order with payment intent ID
    const { query } = await import('../config/database');
    await query(
      'UPDATE orders SET stripe_payment_intent_id = $1 WHERE id = $2',
      [paymentIntent.id, order.id]
    );

    sendSuccess(res, {
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      },
      message: 'Payment intent created',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm order after payment
 */
export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { order_id, payment_intent_id } = req.body;

    const order = await orderModel.findById(order_id);

    if (!order) {
      throw NotFoundError('Order not found');
    }

    if (order.user_id !== userId) {
      throw BadRequestError('Access denied');
    }

    if (!stripe) {
      throw BadRequestError('Payment processing is not configured');
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      throw BadRequestError('Payment not successful');
    }

    // Deduct from wallet if wallet amount was used
    if (order.wallet_amount_used > 0) {
      const wallet = await walletModel.findByUserId(userId);
      if (wallet) {
        await walletModel.debit(wallet.id, order.wallet_amount_used, `Order ${order.order_number}`);
      }
    }

    // Mark tickets as sold
    const items = await orderModel.getOrderItems(order_id);
    for (const item of items) {
      const tickets = await ticketModel.findByCompetition(item.competition_id, { status: 'reserved' });
      const ticketIds = tickets
        .filter(t => t.order_id === order_id)
        .map(t => t.id);
      await ticketModel.markAsSold(ticketIds);
    }

    // Update order status
    await orderModel.updateStatus(order_id, 'paid');

    // Clear cart after successful payment
    await cartService.clearCart(userId);

    const updatedOrder = await orderModel.getOrderWithItems(order_id);

    // Send order confirmation email
    if (updatedOrder) {
      const user = await userModel.findById(userId);
      if (user && updatedOrder.items) {
        const emailItems = updatedOrder.items.map((item) => ({
          title: `Competition #${item.competition_id}`,
          quantity: item.quantity,
        }));

        await emailService.sendOrderConfirmation(
          user.email,
          updatedOrder.order_number,
          updatedOrder.total_amount,
          emailItems
        );
      }
    }

    sendSuccess(res, {
      data: updatedOrder,
      message: 'Order confirmed and paid successfully',
    });
  } catch (error) {
    next(error);
  }
};
