"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Product } from "@/types"
import { useCartStore } from "@/stores/cart-store"
import { useFavoritesStore } from "@/stores/favorites-store"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=400&h=400&fit=crop"

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const favoriteItems = useFavoritesStore((state) => state.items)
  const addFavorite = useFavoritesStore((state) => state.addItem)
  const removeFavorite = useFavoritesStore((state) => state.removeItem)
  const isFavorite = favoriteItems.some((item) => item.id === product.id)
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className={cn(
      "group overflow-hidden rounded-lg bg-card border border-border/40 shadow-sm hover:shadow-md transition-shadow",
      viewMode === "list" ? "flex flex-row" : "flex flex-col"
    )}>
      {/* IMAGE — tall 3:4 ratio, dominates the card */}
      <div className={cn(
        "relative overflow-hidden bg-muted shrink-0",
        viewMode === "list" ? "w-32 sm:w-48 min-h-[140px]" : "aspect-[3/4]"
      )}>
        {/* Badges */}
        <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-0.5">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0 h-4">Nuevo</Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">-{discountPercent}%</Badge>
          )}
        </div>

        {/* Favorite */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            isFavorite ? removeFavorite(product.id) : addFavorite(product)
          }}
          className={cn(
            "absolute right-1.5 top-1.5 z-10 h-6 w-6 rounded-full transition-all",
            mounted && isFavorite 
              ? "opacity-100 text-red-500 bg-red-50/90 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50" 
              : "opacity-0 group-hover:opacity-100 bg-background/70 hover:bg-background/90"
          )}
        >
          <Heart className={cn("h-3 w-3", mounted && isFavorite && "fill-current")} />
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

        {/* Quick Add — inside image on hover */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 pointer-events-none translate-y-full opacity-0 transition-all group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            className="w-full shadow-md h-7 text-xs"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            variant={added ? "secondary" : "default"}
          >
            {added ? (
              <><Check className="mr-1 h-3 w-3" /> Agregado</>
            ) : (
              <><ShoppingCart className="mr-1 h-3 w-3" /> Agregar</>
            )}
          </Button>
        </div>
      </div>

      {/* INFO — minimal, ~25-30% of card height */}
      <div className={cn(
        "px-2 py-1.5 flex flex-col justify-center",
        viewMode === "list" ? "p-4 sm:p-6 flex-1" : ""
      )}>
        {/* Swatches — Columbia style */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-0.5 mb-1">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImageIndex(index) }}
                onMouseEnter={() => setActiveImageIndex(index)}
                className={cn(
                  "relative h-5 w-5 shrink-0 overflow-hidden rounded-[3px] border transition-all",
                  activeImageIndex === index
                    ? "border-foreground ring-1 ring-foreground/20"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="20px" />
              </button>
            ))}
          </div>
        )}

        {/* Brand + Rating inline */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none">{product.brand}</span>
          <span className="text-muted-foreground/30">·</span>
          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 shrink-0" />
          <span className="text-[9px] text-muted-foreground leading-none">{product.rating}</span>
        </div>

        {/* Name — 1 line */}
        <Link href={`/products/${product.slug}`}>
          <p className={cn(
            "font-semibold leading-tight hover:text-primary transition-colors mt-0.5",
            viewMode === "list" ? "text-base sm:text-lg line-clamp-2" : "text-[11px] line-clamp-1"
          )}>
            {product.name}
          </p>
        </Link>

        {/* Price */}
        <div className={cn(
          "flex items-baseline gap-1",
          viewMode === "list" ? "mt-2" : "mt-0.5"
        )}>
          <span className={cn(
            "font-bold leading-none",
            viewMode === "list" ? "text-lg" : "text-xs"
          )}>$ {product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className={cn(
              "text-muted-foreground line-through leading-none",
              viewMode === "list" ? "text-sm" : "text-[9px]"
            )}>
              $ {product.originalPrice!.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
