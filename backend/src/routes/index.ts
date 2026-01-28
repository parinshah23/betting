/**
 * API Routes Aggregator
 *
 * Combines all route modules into a single router.
 */

import { Router } from 'express';
// import authRoutes from './auth.routes';
// import userRoutes from './user.routes';
// import competitionRoutes from './competition.routes';
// import ticketRoutes from './ticket.routes';
// import cartRoutes from './cart.routes';
// import orderRoutes from './order.routes';
// import walletRoutes from './wallet.routes';
// import adminRoutes from './admin.routes';
// import contentRoutes from './content.routes';

const router = Router();

// TODO: Uncomment as routes are implemented
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/competitions', competitionRoutes);
// router.use('/tickets', ticketRoutes);
// router.use('/cart', cartRoutes);
// router.use('/orders', orderRoutes);
// router.use('/wallet', walletRoutes);
// router.use('/admin', adminRoutes);
// router.use('/content', contentRoutes);

// Placeholder route
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Raffle API is running',
      version: '0.1.0',
    },
  });
});

export default router;
