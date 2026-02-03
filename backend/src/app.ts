/**
 * Express Application Setup
 *
 * Configures middleware, routes, and error tracking (Sentry).
 */

import * as Sentry from '@sentry/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { generalRateLimiter } from './middleware/rateLimit';
import routes from './routes';

const app = express();

// Initialize Sentry for error tracking (must be first!)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: config.nodeEnv,
    tracesSampleRate: config.nodeEnv === 'production' ? 0.2 : 1.0,
    integrations: [
      // Automatically instrument Node.js libraries
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
  });

  // Sentry request handler must be the first middleware
  app.use(Sentry.expressErrorHandler());

  console.log('✅ Sentry error tracking initialized');
}

// Security middleware with enhanced headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "*"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use(generalRateLimiter);

// Stripe webhook needs raw body - must be BEFORE express.json()
import webhookRoutes from './routes/webhook.routes';
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Request parsing (after webhook route)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sentry test endpoint (only in development)
if (config.nodeEnv === 'development') {
  app.get('/debug-sentry', () => {
    throw new Error('Sentry test error - this is intentional!');
  });
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API routes
app.use('/api', routes);

// Error handling - Sentry error handler must come before custom error handler
if (process.env.SENTRY_DSN) {
  app.use(Sentry.expressErrorHandler());
}

// Custom error handling
app.use(errorHandler);

export default app;
