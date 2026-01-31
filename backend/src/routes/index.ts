/**
 * API Routes Aggregator
 *
 * Combines all route modules into a single router.
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import competitionRoutes from './competition.routes';
import ticketRoutes from './ticket.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import walletRoutes from './wallet.routes';
import winnerRoutes from './winner.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/competitions', competitionRoutes);
router.use('/winners', winnerRoutes);

// Protected routes (require authentication)
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/wallet', walletRoutes);

// Admin routes (require authentication + admin role)
router.use('/admin', adminRoutes);

// API info route
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Raffle API is running',
      version: '0.1.0',
      documentation: '/api/docs',
    },
  });
});

export default router;
