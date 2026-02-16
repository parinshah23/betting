/**
 * Stripe Webhook Controller
 * 
 * Handles Stripe webhook events for payment processing.
 * This is the reliable way to confirm payments.
 */

import { Request, Response } from 'express';
import Stripe from 'stripe';
import { config } from '../config/env';
import { orderModel } from '../models/order.model';
import { cartService } from '../services/cart.service';
import pool from '../config/database';

// Initialize Stripe with explicit type handling for config
const stripeSecretKey = config.stripe.secretKey || '';
const stripeWebhookSecret = config.stripe.webhookSecret || '';

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
});

/**
 * Handle Stripe webhook events
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    if (!stripeWebhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET not configured');
        return res.status(500).json({ error: 'Webhook not configured' });
    }

    let event: Stripe.Event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            req.body, // Note: this must be raw body, not parsed JSON
            sig,
            stripeWebhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    console.log(`Received Stripe webhook: ${event.type}`);

    // Handle the event
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
                break;

            case 'charge.refunded':
                await handleChargeRefunded(event.data.object as Stripe.Charge);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        // Return 200 to prevent Stripe from retrying (we'll handle the error internally)
        res.json({ received: true, error: 'Internal processing error' });
    }
};

/**
 * Handle successful payment
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log(`PaymentIntent ${paymentIntent.id} succeeded`);

    const metadata = paymentIntent.metadata;

    // Handle wallet deposit
    if (metadata?.type === 'wallet_deposit') {
        try {
            const amount = parseFloat(metadata.amount);
            const userId = metadata.user_id || metadata.userId;

            // Get user's wallet
            const { walletModel } = require('../models/wallet.model');
            const wallet = await walletModel.findByUserId(userId);

            if (!wallet) {
                console.error('Wallet not found for user:', userId);
                return;
            }

            // Credit the wallet
            await walletModel.credit(
                wallet.id,
                amount,
                'Wallet deposit via Stripe',
                paymentIntent.id
            );

            // Send confirmation email
            const { userModel } = require('../models/user.model');
            const user = await userModel.findById(userId);

            if (user) {
                try {
                    const { emailService } = require('../services/email.service');
                    await emailService.sendDepositConfirmation(user.email, amount);
                } catch (emailErr) {
                    console.error('Failed to send deposit confirmation email:', emailErr);
                }
            }

            console.log(`Wallet credited: £${amount} for user ${userId}`);
            return;
        } catch (error) {
            console.error('Error processing wallet deposit:', error);
            return;
        }
    }

    // Handle competition purchase (existing flow)
    const orderId = metadata?.order_id;
    const userId = metadata?.user_id;

    if (!orderId) {
        console.error('No order_id in payment intent metadata');
        return;
    }

    // Get order with items
    const order = await orderModel.getOrderWithItems(orderId);

    if (!order) {
        console.error(`Order ${orderId} not found`);
        return;
    }

    // Only update if not already paid (prevent duplicate processing)
    if (order.status === 'paid') {
        console.log(`Order ${orderId} already marked as paid`);
        return;
    }

    // Update order status
    await orderModel.updateStatus(orderId, 'paid');
    console.log(`Order ${orderId} marked as paid via webhook`);

    // Clear cart if we have user ID
    if (userId) {
        await cartService.clearCart(userId);
        console.log(`Cart cleared for user ${userId}`);
    }

    console.log(`Order ${orderId} payment confirmed. Items: ${order.items?.length || 0}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.log(`PaymentIntent ${paymentIntent.id} failed`);

    try {
        const paymentIntentId = paymentIntent.id;

        // Find order by payment intent
        const orderResult = await pool.query(
            'SELECT * FROM orders WHERE stripe_payment_intent_id = $1',
            [paymentIntentId]
        );

        if (orderResult.rows.length === 0) {
            console.log('No order found for failed payment:', paymentIntentId);
            return;
        }

        const order = orderResult.rows[0];

        // 1. Update order status
        await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            ['failed', order.id]
        );

        // 2. Release reserved tickets
        const ticketsResult = await pool.query(
            'SELECT * FROM tickets WHERE order_id = $1',
            [order.id]
        );

        for (const ticket of ticketsResult.rows) {
            await pool.query(
                `UPDATE tickets
                 SET status = 'available', user_id = NULL, order_id = NULL
                 WHERE id = $1`,
                [ticket.id]
            );
        }

        // 3. Update competition tickets_sold count (decrement)
        if (ticketsResult.rows.length > 0) {
            // Group tickets by competition to decrement correctly
            const compTickets: Record<string, number> = {};
            for (const ticket of ticketsResult.rows) {
                compTickets[ticket.competition_id] = (compTickets[ticket.competition_id] || 0) + 1;
            }
            for (const [compId, count] of Object.entries(compTickets)) {
                await pool.query(
                    'UPDATE competitions SET tickets_sold = GREATEST(tickets_sold - $1, 0) WHERE id = $2',
                    [count, compId]
                );
            }
        }

        // 4. Return wallet amount if used
        if (order.wallet_amount_used && parseFloat(order.wallet_amount_used) > 0) {
            const { walletModel } = require('../models/wallet.model');
            const wallet = await walletModel.findByUserId(order.user_id);

            if (wallet) {
                await walletModel.credit(
                    wallet.id,
                    parseFloat(order.wallet_amount_used),
                    `Payment failed - refund for order ${order.order_number}`,
                    order.id
                );
            }
        }

        // 5. Send failure email
        try {
            const { userModel } = require('../models/user.model');
            const user = await userModel.findById(order.user_id);

            if (user) {
                const { emailService } = require('../services/email.service');
                await emailService.sendPaymentFailureEmail(user.email, order);
            }
        } catch (emailErr) {
            console.error('Failed to send payment failure email:', emailErr);
        }

        console.log(`Payment failed processed for order ${order.order_number}`);
    } catch (error) {
        console.error('Handle payment failed error:', error);
    }
}

/**
 * Handle refund
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
    console.log(`Charge ${charge.id} refunded`);

    try {
        // Get payment intent ID from charge
        const paymentIntentId = typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id;

        if (!paymentIntentId) {
            console.error('No payment_intent in charge');
            return;
        }

        // Find order by payment intent ID
        const orderResult = await pool.query(
            'SELECT * FROM orders WHERE stripe_payment_intent_id = $1',
            [paymentIntentId]
        );

        if (orderResult.rows.length === 0) {
            console.log('No order found for refunded charge:', paymentIntentId);
            return;
        }

        const order = orderResult.rows[0];

        // 1. Update order status
        await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            ['refunded', order.id]
        );

        // 2. Find and release tickets
        const ticketsResult = await pool.query(
            'SELECT * FROM tickets WHERE order_id = $1',
            [order.id]
        );

        for (const ticket of ticketsResult.rows) {
            await pool.query(
                `UPDATE tickets
                 SET status = 'available', user_id = NULL, order_id = NULL
                 WHERE id = $1`,
                [ticket.id]
            );
        }

        // 3. Update competition tickets_sold count
        if (ticketsResult.rows.length > 0) {
            const compTickets: Record<string, number> = {};
            for (const ticket of ticketsResult.rows) {
                compTickets[ticket.competition_id] = (compTickets[ticket.competition_id] || 0) + 1;
            }
            for (const [compId, count] of Object.entries(compTickets)) {
                await pool.query(
                    'UPDATE competitions SET tickets_sold = GREATEST(tickets_sold - $1, 0) WHERE id = $2',
                    [count, compId]
                );
            }
        }

        // 4. Credit wallet if wallet was used
        if (order.wallet_amount_used && parseFloat(order.wallet_amount_used) > 0) {
            const { walletModel } = require('../models/wallet.model');
            const wallet = await walletModel.findByUserId(order.user_id);

            if (wallet) {
                await walletModel.credit(
                    wallet.id,
                    parseFloat(order.wallet_amount_used),
                    `Refund for order ${order.order_number}`,
                    order.id
                );
            }
        }

        // 5. Send refund email
        try {
            const { userModel } = require('../models/user.model');
            const user = await userModel.findById(order.user_id);

            if (user) {
                const { emailService } = require('../services/email.service');
                await emailService.sendRefundConfirmation(user.email, order);
            }
        } catch (emailErr) {
            console.error('Failed to send refund email:', emailErr);
        }

        console.log(`Refund processed for order ${order.order_number}`);
    } catch (error) {
        console.error('Handle refund error:', error);
    }
}
