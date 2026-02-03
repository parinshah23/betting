/**
 * Upload Controller
 * 
 * Handles file upload endpoints with Cloudinary support
 */

import { Request, Response, NextFunction } from 'express';
import { upload, processUpload } from '../services/upload.service';
import { sendSuccess } from '../utils/response';
import { BadRequestError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Upload single image
 */
export const uploadImage = [
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw BadRequestError('No image file provided');
      }

      const fileInfo = await processUpload(req.file);

      sendSuccess(res, {
        data: {
          url: fileInfo.url,
          filename: fileInfo.filename,
          size: fileInfo.size,
          publicId: fileInfo.publicId,
        },
        message: 'Image uploaded successfully',
      }, 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Upload multiple images
 */
export const uploadMultipleImages = [
  upload.array('images', 5),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw BadRequestError('No image files provided');
      }

      // Process all uploads in parallel
      const uploadPromises = req.files.map(file => processUpload(file));
      const uploadedFiles = await Promise.all(uploadPromises);

      sendSuccess(res, {
        data: {
          images: uploadedFiles.map(file => ({
            url: file.url,
            filename: file.filename,
            size: file.size,
            publicId: file.publicId,
          })),
          count: uploadedFiles.length,
        },
        message: 'Images uploaded successfully',
      }, 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete uploaded image
 */
export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { userId } = (req as AuthenticatedRequest).user;
    const { filename } = req.params;

    // TODO: Verify user has permission to delete this file
    // Check if file is associated with user's competition, etc.

    const { deleteUpload } = await import('../services/upload.service');
    const deleted = await deleteUpload(filename);

    if (!deleted) {
      throw BadRequestError('File not found or could not be deleted');
    }

    sendSuccess(res, {
      data: null,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
