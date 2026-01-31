'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CompetitionImage } from '@/types/competition';

interface ImageGalleryProps {
  images: CompetitionImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const sortedImages = [...images].sort((a, b) => 
    (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)
  );
  
  const [selectedImage, setSelectedImage] = useState<CompetitionImage | null>(
    sortedImages.length > 0 ? sortedImages[0] : null
  );

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400">
        No Images Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] md:aspect-square bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200">
        {selectedImage && (
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || 'Competition Image'}
            fill
            className="object-cover transition-all duration-300 hover:scale-105"
            priority
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {sortedImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                selectedImage?.id === image.id
                  ? "border-primary-500 ring-2 ring-primary-100 ring-offset-1"
                  : "border-transparent hover:border-neutral-200"
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || 'Thumbnail'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
