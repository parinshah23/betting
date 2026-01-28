/**
 * Environment Configuration
 *
 * Loads and validates environment variables.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),

  // Database
  DATABASE_URL: z.string().optional(),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.string().default('5432'),
  DATABASE_NAME: z.string().default('raffle_db'),
  DATABASE_USER: z.string().default('postgres'),
  DATABASE_PASSWORD: z.string().default(''),

  // JWT
  JWT_SECRET: z.string().default('development-secret-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().default('refresh-secret-change-in-production'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  // URLs
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Email
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@example.com'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parseInt(parsed.data.PORT, 10),

  database: {
    url: parsed.data.DATABASE_URL,
    host: parsed.data.DATABASE_HOST,
    port: parseInt(parsed.data.DATABASE_PORT, 10),
    name: parsed.data.DATABASE_NAME,
    user: parsed.data.DATABASE_USER,
    password: parsed.data.DATABASE_PASSWORD,
  },

  jwt: {
    secret: parsed.data.JWT_SECRET,
    expiresIn: parsed.data.JWT_EXPIRES_IN,
    refreshSecret: parsed.data.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: parsed.data.REFRESH_TOKEN_EXPIRES_IN,
  },

  frontendUrl: parsed.data.FRONTEND_URL,

  stripe: {
    secretKey: parsed.data.STRIPE_SECRET_KEY,
    webhookSecret: parsed.data.STRIPE_WEBHOOK_SECRET,
  },

  email: {
    apiKey: parsed.data.EMAIL_API_KEY,
    from: parsed.data.EMAIL_FROM,
  },
};
