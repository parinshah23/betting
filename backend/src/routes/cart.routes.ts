import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { addToCartSchema, updateCartItemSchema, applyPromoSchema } from '../validators/cart.validator';

const router = Router();

// All cart routes require authentication
router.use(auth);

router.get('/', cartController.getCart);
router.post('/add', validate(addToCartSchema), cartController.addToCart);
router.put('/update', validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/:itemId', cartController.removeFromCart);
router.post('/apply-promo', validate(applyPromoSchema), cartController.applyPromoCode);
router.delete('/promo', cartController.removePromoCode);
router.delete('/clear', cartController.clearCart);

export default router;
