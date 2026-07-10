"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Product } from "@/types"
import { useCartStore } from "@/stores/cart-store"

interface ProductCardProps {
  product: Product
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=400&h=400&fit=crop"

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const productImage = product.images?.[activeImageIndex] || PLACEHOLDER_IMAGE

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Image Container with vertical 3/4 aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive">-{discountPercent}%</Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Agregar a favoritos</span>
        </Button>

        {/* Image Link */}
        <Link href={`/products/${product.slug}`}>
          <div className="relative h-full w-full">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-102"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </Link>

        {/* Quick Add Button */}
        <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none translate-y-full opacity-0 transition-all group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            className="w-full shadow-md"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            variant={added ? "secondary" : "default"}
          >
            {added ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Agregado
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Agregar
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-3">
        {/* Brand */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{product.brand}</p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 text-xs font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Interactive Image Swatches (Columbia Style) */}
        {product.images && product.images.length > 1 && (
          <div className="mt-2 flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveImageIndex(index)
                }}
                onMouseEnter={() => setActiveImageIndex(index)}
                className={cn(
                  "relative h-7 w-7 shrink-0 overflow-hidden rounded border transition-all duration-150",
                  activeImageIndex === index
                    ? "border-primary ring-2 ring-primary/20 scale-105"
                    : "border-muted/30 hover:border-muted-foreground/50"
                )}
              >
                <Image
                  src={img}
                  alt={`${product.name} swatch ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-medium text-muted-foreground">{product.rating}</span>
        </div>

        {/* Price (Soles) */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-primary">
            S/ {product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-muted-foreground line-through">
              S/ {product.originalPrice!.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
