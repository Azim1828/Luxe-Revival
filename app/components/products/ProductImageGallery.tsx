'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageGalleryProps {
  images: Array<{
    url: string
    alt: string
    isMain?: boolean
  }>
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images.find(img => img.isMain) || images[0]
  )

  return (
    <div className="flex flex-col-reverse gap-4">
      {/* Main Image */}
      <div className="aspect-square w-full relative rounded-lg overflow-hidden">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden",
              selectedImage.url === image.url && "ring-2 ring-primary"
            )}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  )
} 