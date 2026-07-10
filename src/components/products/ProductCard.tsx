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
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-0 shadow-sm">
      {/* Image — square aspect ratio for max detail */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">Nuevo</Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">-{discountPercent}%</Badge>
          )}
        </div>

        {/* Favorite */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-7 w-7 rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Heart className="h-3.5 w-3.5" />
        </Button>

        {/* Image */}
        <Link href={`/products/${product.slug}`}>
          <div className="relative h-full w-full">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </Link>

        {/* Quick Add */}
        <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none translate-y-full opacity-0 transition-all group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            className="w-full shadow-md"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            variant={added ? "secondary" : "default"}
          >
            {added ? (
              <><Check className="mr-1 h-3.5 w-3.5" /> Agregado</>
            ) : (
              <><ShoppingCart className="mr-1 h-3.5 w-3.5" /> Agregar</>
            )}
          </Button>
        </div>
      </div>

      {/* Info — ultra-compact */}
      <CardContent className="px-2.5 py-2">
        {/* Columbia-style image swatches */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-1 mb-1.5">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImageIndex(index) }}
                onMouseEnter={() => setActiveImageIndex(index)}
                className={cn(
                  "relative h-6 w-6 shrink-0 overflow-hidden rounded-sm border transition-all",
                  activeImageIndex === index
                    ? "border-foreground ring-1 ring-foreground/20"
                    : "border-muted hover:border-muted-foreground/50"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="24px" />
              </button>
            ))}
          </div>
        )}

        {/* Brand + Rating on same line */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{product.brand}</p>
          <div className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-muted-foreground">{product.rating}</span>
          </div>
        </div>

        {/* Name — tight */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-0.5 text-xs font-semibold leading-snug line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price — directly after name */}
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-bold">
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
