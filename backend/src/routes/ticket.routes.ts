import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All ticket routes require authentication
router.use(auth);

router.get('/my-tickets', ticketController.getMyTickets);
router.get('/history', ticketController.getTicketHistory);
router.get('/instant-wins', ticketController.getInstantWins);

export default router;
