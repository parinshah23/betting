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
// import { emailService } from '../services/email.service';
import { cartService } from '../services/cart.service';

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

    const orderId = paymentIntent.metadata?.order_id;
    const userId = paymentIntent.metadata?.user_id;

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

    // Note: To send confirmation email, we need to get user email
    // This would typically be stored in order or fetched from users table
    // For now, we log the success
    console.log(`Order ${orderId} payment confirmed. Items: ${order.items?.length || 0}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.log(`PaymentIntent ${paymentIntent.id} failed`);

    const orderId = paymentIntent.metadata?.order_id;

    if (!orderId) {
        console.error('No order_id in payment intent metadata');
        return;
    }

    // Update order status to failed
    await orderModel.updateStatus(orderId, 'failed');
    console.log(`Order ${orderId} marked as failed`);

    // TODO: Consider sending failure notification email
    // TODO: Release reserved tickets
}

/**
 * Handle refund
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
    console.log(`Charge ${charge.id} refunded`);

    // Get payment intent ID from charge
    const paymentIntentId = typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : charge.payment_intent?.id;

    if (!paymentIntentId) {
        console.error('No payment_intent in charge');
        return;
    }

    // Find order by payment intent ID (you may need to add this field to orders table)
    // For now, log the refund
    console.log(`Refund processed for payment intent: ${paymentIntentId}`);

    // TODO: Update order status to 'refunded'
    // TODO: Handle partial refunds
    // TODO: Return tickets to pool
}
