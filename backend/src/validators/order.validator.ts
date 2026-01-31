import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    use_wallet_balance: z.boolean().optional().default(false),
  }),
});

export const confirmOrderSchema = z.object({
  body: z.object({
    order_id: z.string().uuid('Invalid order ID'),
    payment_intent_id: z.string().min(1, 'Payment intent ID is required'),
  }),
});
