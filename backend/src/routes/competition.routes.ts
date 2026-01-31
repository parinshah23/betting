import { Router } from 'express';
import * as competitionController from '../controllers/competition.controller';
import { validate } from '../middleware/validate';
import { competitionQuerySchema, verifyAnswerSchema } from '../validators/competition.validator';

const router = Router();

// Public routes
router.get('/', validate(competitionQuerySchema), competitionController.getCompetitions);
router.get('/featured', competitionController.getFeaturedCompetitions);
router.get('/:slug', competitionController.getCompetitionBySlug);
router.get('/:id/tickets', competitionController.getCompetitionTickets);
router.post('/verify-answer', validate(verifyAnswerSchema), competitionController.verifyAnswer);

export default router;
