'use client';

import React, { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export function ImageUpload({ 
  onUpload, 
  existingImages = [], 
  maxImages = 5,
  className 
}: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    const remainingSlots = maxImages - uploadedUrls.length - uploadingFiles.length;
    const filesToUpload = imageFiles.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      return;
    }

    // Create uploading file objects with previews
    const newUploadingFiles: UploadingFile[] = filesToUpload.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading',
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload each file
    for (const uploadingFile of newUploadingFiles) {
      try {
        const formData = new FormData();
        formData.append('image', uploadingFile.file);

        const response = await api.upload<{ url: string }>('/api/upload/image', formData);

        if (response.success && response.data) {
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadingFile.id 
                ? { ...f, status: 'completed', url: response.data!.url, progress: 100 }
                : f
            )
          );
          
          setUploadedUrls(prev => {
            const newUrls = [...prev, response.data!.url];
            onUpload(newUrls);
            return newUrls;
          });
        } else {
          throw new Error(response.error?.message || 'Upload failed');
        }
      } catch (error) {
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadingFile.id 
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        );
      }
    }

    // Clean up completed uploads after a delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.status !== 'completed'));
    }, 2000);
  }, [uploadedUrls.length, uploadingFiles.length, maxImages, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (index: number) => {
    setUploadedUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      onUpload(newUrls);
      return newUrls;
    });
  };

  const remainingSlots = maxImages - uploadedUrls.length - uploadingFiles.length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {remainingSlots > 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports: JPEG, PNG, WebP, GIF (max 5MB each)
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining
            </p>
          </label>
        </div>
      )}

      {/* Uploading Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map(file => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={file.preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.file.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {file.status === 'uploading' && (
                    <>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <Spinner size="sm" />
                    </>
                  )}
                  {file.status === 'completed' && (
                    <span className="text-sm text-green-600">Uploaded</span>
                  )}
                  {file.status === 'error' && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {file.error}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <div key={url} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={url} 
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Images State */}
      {uploadedUrls.length === 0 && uploadingFiles.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
