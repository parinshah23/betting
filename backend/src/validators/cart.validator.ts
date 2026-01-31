import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    competition_id: z.string().uuid('Invalid competition ID'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    competition_id: z.string().uuid('Invalid competition ID'),
    quantity: z.number().int().min(0, 'Quantity must be 0 or more'),
  }),
});

export const applyPromoSchema = z.object({
  body: z.object({
    promo_code: z.string().min(1, 'Promo code is required'),
  }),
});
