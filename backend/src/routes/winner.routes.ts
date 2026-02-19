import { Router } from 'express';
import * as winnerController from '../controllers/winner.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', winnerController.getWinners);
router.get('/gallery', winnerController.getWinners);
router.get('/recent', winnerController.getRecentWinners);

// Protected routes - requires authentication
router.get('/my-wins', auth, winnerController.getMyWins);
router.post('/:competitionId/claim', auth, winnerController.claimPrize);
router.get('/:competitionId/certificate', auth, winnerController.downloadCertificate);

export default router;
