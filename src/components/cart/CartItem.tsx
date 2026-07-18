"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void
  onRemove: (productId: string, size?: string, color?: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity, size, color } = item

  const colorIndex = color && product.colors ? product.colors.indexOf(color) : -1
  const imageIndex = colorIndex !== -1 ? Math.min(colorIndex, product.images.length - 1) : 0
  const imageSrc = product.images[imageIndex] || product.images[0]

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
            <Link
              href={`/products/${product.slug}`}
              className="font-medium hover:text-primary transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
            {(size || color) && (
              <p className="mt-1 text-xs text-muted-foreground">
                {size && <span>Talla: {size}</span>}
                {size && color && <span> | </span>}
                {color && <span>Color: {color}</span>}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(product.id, size, color)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Quantity */}
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => onUpdateQuantity(product.id, quantity - 1, size, color)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => onUpdateQuantity(product.id, quantity + 1, size, color)}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold text-primary">
              $ {(product.price * quantity).toFixed(2)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                $ {product.price.toFixed(2)} c/u
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
