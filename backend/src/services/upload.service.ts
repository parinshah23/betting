/**
 * File Upload Service
 * 
 * Handles image uploads with support for:
 * - Local file storage (development)
 * - Cloudinary (production - recommended)
 * - Image validation and processing
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = (): boolean => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Ensure upload directory exists for local storage
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path.join(process.cwd(), uploadDir);

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Configure multer storage - use memory for Cloudinary, disk for local
const storage = isCloudinaryConfigured()
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
  }
};

// Configure multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 5, // Max 5 files per upload
  },
});

export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  publicId?: string; // Cloudinary public ID for deletion
}

/**
 * Upload to Cloudinary
 */
const uploadToCloudinary = async (file: Express.Multer.File): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'competitions',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            filename: result.public_id,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: result.secure_url,
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error('Upload failed - no result'));
        }
      }
    );

    // Write buffer to stream
    if (file.buffer) {
      uploadStream.end(file.buffer);
    } else {
      reject(new Error('No file buffer available'));
    }
  });
};

/**
 * Process uploaded file and return file info
 */
export const processUpload = async (file: Express.Multer.File): Promise<UploadedFile> => {
  // Use Cloudinary if configured
  if (isCloudinaryConfigured()) {
    return await uploadToCloudinary(file);
  }

  // Fallback to local storage
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

  return {
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    url: `${baseUrl}/uploads/${file.filename}`,
  };
};

/**
 * Delete uploaded file
 */
export const deleteUpload = async (filenameOrPublicId: string): Promise<boolean> => {
  try {
    // Try to delete from Cloudinary first
    if (isCloudinaryConfigured()) {
      const result = await cloudinary.uploader.destroy(filenameOrPublicId);
      return result.result === 'ok';
    }

    // Fallback to local deletion
    const filePath = path.join(uploadsPath, filenameOrPublicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Validate file size
 */
export const validateFileSize = (size: number, maxSizeMB: number = 5): boolean => {
  return size <= maxSizeMB * 1024 * 1024;
};

/**
 * Generate image URL from filename
 */
export const getImageUrl = (filename: string): string => {
  if (isCloudinaryConfigured()) {
    return cloudinary.url(filename, {
      secure: true,
      transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
    });
  }
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  return `${baseUrl}/uploads/${filename}`;
};
