import { Router } from 'express';
import * as winnerController from '../controllers/winner.controller';

const router = Router();

// Public routes
router.get('/', winnerController.getWinners);
router.get('/recent', winnerController.getRecentWinners);

export default router;
