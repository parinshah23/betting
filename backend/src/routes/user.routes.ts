import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { updateProfileSchema, changePasswordSchema } from '../validators/user.validator';

const router = Router();

// All user routes require authentication
router.use(auth);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.put('/password', validate(changePasswordSchema), userController.changePassword);

export default router;
