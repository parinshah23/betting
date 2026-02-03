import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All upload routes require authentication
router.use(auth);

// Upload single image
router.post('/image', ...uploadController.uploadImage);

// Upload multiple images
router.post('/images', ...uploadController.uploadMultipleImages);

// Delete uploaded image
router.delete('/:filename', uploadController.deleteImage);

export default router;
