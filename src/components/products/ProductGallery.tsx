"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
  productName: string
  forcedIndex?: number          // controlled by parent (color selection)
  onIndexChange?: (i: number) => void
}

export function ProductGallery({
  images,
  productName,
  forcedIndex,
  onIndexChange,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePos({ x, y })
  }

  // When parent forces a different image (color change), sync internal state
  useEffect(() => {
    if (forcedIndex !== undefined) setSelectedIndex(forcedIndex)
  }, [forcedIndex])

  const setIndex = (i: number) => {
    setSelectedIndex(i)
    onIndexChange?.(i)
  }

  const goToPrev = () => setIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
  const goToNext = () => setIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)

  return (
    <div className="flex gap-3">
      {/* ── Vertical thumbnail strip on the LEFT ── */}
      {images.length > 1 && (
        <div className="hidden sm:flex flex-col gap-2 overflow-y-auto max-h-[520px] pr-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setIndex(index)}
              className={cn(
                "relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-muted-foreground/40 opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt={`${productName} - vista ${index + 1}`}
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Main image ── */}
      <div className="flex-1 flex flex-col gap-3">
        <div
          className="relative aspect-square overflow-hidden rounded-xl bg-muted group cursor-zoom-in"
          onClick={() => setZoomed(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={images[selectedIndex]}
            alt={productName}
            fill
            className={cn(
              "object-cover transition-transform duration-200",
              isHovering ? "scale-[2.5]" : "scale-100"
            )}
            style={isHovering ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {/* Zoom hint */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 text-white rounded-full p-1.5">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>

          {/* Arrow navigation */}
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

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium rounded-full px-2 py-0.5">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Mobile thumbnails (horizontal, below image) */}
        {images.length > 1 && (
          <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setIndex(index)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
                  selectedIndex === index
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
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
