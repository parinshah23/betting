/**
 * Webhook Routes
 * 
 * Handles external webhook callbacks (Stripe, etc.)
 */

import { Router } from 'express';
import { handleStripeWebhook } from '../controllers/webhook.controller';

const router = Router();

// Stripe webhook - Note: requires raw body, not parsed JSON
router.post('/stripe', handleStripeWebhook);

export default router;
