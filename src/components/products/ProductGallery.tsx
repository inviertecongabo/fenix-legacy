"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const goToPrev = () => setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const goToNext = () => setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div
        className="relative aspect-square overflow-hidden rounded-xl bg-muted group cursor-zoom-in"
        onClick={() => setZoomed(true)}
      >
        <Image
          src={images[selectedIndex]}
          alt={productName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/50 text-white rounded-full p-1.5">
            <ZoomIn className="h-4 w-4" />
          </div>
        </div>

        {/* Arrow navigation — only when there are multiple images */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); goToPrev() }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); goToNext() }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium rounded-full px-2 py-0.5">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/30 scale-105"
                  : "border-transparent hover:border-muted-foreground/40 hover:scale-105 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt={`${productName} - vista ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <div className="relative h-[90vmin] w-[90vmin] max-w-3xl">
            <Image
              src={images[selectedIndex]}
              alt={productName}
              fill
              className="object-contain"
              sizes="90vmin"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 rounded-full p-2"
                onClick={(e) => { e.stopPropagation(); goToPrev() }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 rounded-full p-2"
                onClick={(e) => { e.stopPropagation(); goToNext() }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
