import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { createCompetitionSchema, updateCompetitionSchema } from '../validators/competition.validator';

const router = Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use(authorize(['admin']));

// Competition routes
router.get('/competitions', adminController.getAllCompetitions);
router.post('/competitions', validate(createCompetitionSchema), adminController.createCompetition);
router.get('/competitions/:id', adminController.getCompetitionById);
router.put('/competitions/:id', validate(updateCompetitionSchema), adminController.updateCompetition);
router.delete('/competitions/:id', adminController.deleteCompetition);
router.post('/competitions/:id/duplicate', adminController.duplicateCompetition);
router.post('/competitions/:id/instant-wins', adminController.setInstantWins);
router.get('/competitions/:id/entries', adminController.getCompetitionEntries);
router.post('/competitions/:id/draw', adminController.executeDraw);

// User routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.post('/users/:id/ban', adminController.toggleBanUser);
router.post('/users/:id/wallet', adminController.adjustWallet);

// Order routes
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderById);
router.post('/orders/:id/refund', adminController.refundOrder);

// Content routes
router.get('/content', adminController.getAllContent);
router.put('/content/:slug', adminController.updateContent);
router.post('/winners-gallery', adminController.addWinnerToGallery);

export default router;
