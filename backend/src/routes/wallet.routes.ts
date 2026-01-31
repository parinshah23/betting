import { Router } from 'express';
import * as walletController from '../controllers/wallet.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { depositSchema } from '../validators/wallet.validator';

const router = Router();

// All wallet routes require authentication
router.use(auth);

router.get('/', walletController.getWallet);
router.get('/transactions', walletController.getTransactions);
router.post('/deposit', validate(depositSchema), walletController.createDeposit);
router.post('/deposit/confirm', walletController.confirmDeposit);

export default router;
