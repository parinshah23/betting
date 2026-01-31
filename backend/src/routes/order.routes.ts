import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { createOrderSchema, confirmOrderSchema } from '../validators/order.validator';

const router = Router();

// All order routes require authentication
router.use(auth);

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/create', validate(createOrderSchema), orderController.createOrder);
router.post('/payment-intent', orderController.createPaymentIntent);
router.post('/confirm', validate(confirmOrderSchema), orderController.confirmOrder);

export default router;
