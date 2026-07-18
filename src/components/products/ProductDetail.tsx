"use client"

import { useState, useEffect } from "react"
import {
  Heart, ShoppingCart, Star, Minus, Plus,
  Truck, RotateCcw, ShieldCheck, Check, Ruler, X, ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Product } from "@/types"
import { useCartStore } from "@/stores/cart-store"
import { useFavoritesStore } from "@/stores/favorites-store"

interface ProductDetailProps {
  product: Product
  /** Called with the image index that corresponds to the selected color */
  onColorImageChange?: (index: number) => void
}

// Size guide data
const SIZE_GUIDE = [
  { size: "XS",  chest: "84–88",   waist: "66–70",  hip: "90–94"   },
  { size: "S",   chest: "88–92",   waist: "70–74",  hip: "94–98"   },
  { size: "M",   chest: "92–96",   waist: "74–78",  hip: "98–102"  },
  { size: "L",   chest: "96–100",  waist: "78–82",  hip: "102–106" },
  { size: "XL",  chest: "100–104", waist: "82–86",  hip: "106–110" },
  { size: "XXL", chest: "104–110", waist: "86–92",  hip: "110–116" },
]

export function ProductDetail({ product, onColorImageChange }: ProductDetailProps) {
  const [quantity, setQuantity]       = useState(1)
  const [added, setAdded]             = useState(false)
  const [selectedSize, setSelectedSize]   = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [errorMessage, setErrorMessage]   = useState("")
  const [bcvRate, setBcvRate]             = useState<number | null>(null)
  const addItem = useCartStore((state) => state.addItem)
  const favoriteItems = useFavoritesStore((state) => state.items)
  const addFavorite = useFavoritesStore((state) => state.addItem)
  const removeFavorite = useFavoritesStore((state) => state.removeItem)
  const isFavorite = favoriteItems.some((item) => item.id === product.id)
  
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Fetch BCV rate
    fetch("/api/bcv")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.rate === "number") {
          setBcvRate(data.rate)
        }
      })
      .catch((err) => console.error("Error fetching BCV rate:", err))
  }, [])

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const sizes  = Array.isArray(product.sizes)  ? product.sizes.filter(Boolean)  : []
  const colors = Array.isArray(product.colors) ? product.colors.filter(Boolean) : []

  // Build a per-color stock map from specs (keys saved as "Stock_ColorName")
  const colorStockMap: Record<string, number> = {}
  if (product.specs) {
    Object.entries(product.specs).forEach(([key, val]) => {
      if (key.startsWith("Stock_")) {
        const colorName = key.replace("Stock_", "")
        colorStockMap[colorName] = Number(val)
      }
    })
  }
  const hasColorStock = Object.keys(colorStockMap).length > 0

  // Effective stock: if this product has per-color stock AND a color is selected,
  // show only that color's units; otherwise fall back to the total product stock.
  const effectiveStock = (
    hasColorStock && selectedColor && colorStockMap[selectedColor] !== undefined
  )
    ? colorStockMap[selectedColor]
    : product.stock

  const decreaseQuantity = () => { if (quantity > 1) setQuantity(quantity - 1) }
  const increaseQuantity = () => { if (quantity < effectiveStock) setQuantity(quantity + 1) }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    setQuantity(1) // reset quantity so it never exceeds the new color's stock
    // Switch gallery to the image whose index matches the color index
    const colorIndex = colors.indexOf(color)
    if (colorIndex !== -1 && onColorImageChange) {
      onColorImageChange(Math.min(colorIndex, product.images.length - 1))
    }
  }

  const handleAddToCart = () => {
    if (needsSize && needsColor) {
      setErrorMessage("Por favor selecciona una talla y un color.")
      setTimeout(() => setErrorMessage(""), 4000)
      return
    }
    if (needsSize) {
      setErrorMessage("Por favor selecciona una talla antes de agregar al carrito.")
      setTimeout(() => setErrorMessage(""), 4000)
      return
    }
    if (needsColor) {
      setErrorMessage("Por favor selecciona un color antes de agregar al carrito.")
      setTimeout(() => setErrorMessage(""), 4000)
      return
    }
    addItem(product, quantity, selectedSize || undefined, selectedColor || undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const needsSize  = sizes.length > 0 && !selectedSize
  const needsColor = colors.length > 0 && !selectedColor
  const canAddToCart = effectiveStock > 0 && !needsSize && !needsColor

  return (
    <div className="flex flex-col gap-5">

      {/* Badges */}
      <div className="flex gap-2">
        {product.isNew && <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>}
        {hasDiscount && <Badge variant="destructive">-{discountPercent}%</Badge>}
      </div>

      {/* Brand */}
      <p className="text-sm text-muted-foreground">{product.brand}</p>

      {/* Name */}
      <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{product.rating}</span>
        <span className="text-sm text-muted-foreground">(128 reseñas)</span>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-bold text-primary flex items-baseline gap-2">
          $ {product.price.toFixed(2)}
          {bcvRate && (
            <span className="text-sm font-medium text-muted-foreground">
              (Bs. {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.price * bcvRate)})
            </span>
          )}
        </span>
        
        {hasDiscount && (
          <span className="text-lg text-muted-foreground flex items-baseline gap-1">
            <span className="line-through">$ {product.originalPrice!.toFixed(2)}</span>
          </span>
        )}
      </div>

      {/* Stock */}
      <p className="text-sm">
        {effectiveStock > 0 ? (
          <span className="text-green-600 dark:text-green-400">
            {hasColorStock && selectedColor
              ? `${effectiveStock} unidades disponibles en ${selectedColor}`
              : `${effectiveStock} unidades disponibles`}
          </span>
        ) : (
          <span className="text-destructive">
            {hasColorStock && selectedColor
              ? `Agotado en ${selectedColor}`
              : "Agotado"}
          </span>
        )}
      </p>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-1">Descripción</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <Separator />

      {/* ── SIZE DROPDOWN (eBay style) ── */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="size-select" className="text-sm font-semibold">
              Talla:{" "}
              {selectedSize && <span className="text-primary">{selectedSize}</span>}
            </label>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Ruler className="h-3 w-3" />
              Guía de tallas
            </button>
          </div>
          <div className="relative">
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full appearance-none rounded-lg border-2 border-muted-foreground/30 bg-background px-4 py-2.5 pr-10 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
            >
              <option value="">Selecciona una talla</option>
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {needsSize && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Por favor selecciona una talla antes de agregar al carrito.
            </p>
          )}
        </div>
      )}

      {/* ── COLOR DROPDOWN ── */}
      {colors.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="color-select" className="text-sm font-semibold">
            Color:{" "}
            {selectedColor && <span className="text-primary">{selectedColor}</span>}
          </label>
          <div className="relative">
            <select
              id="color-select"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full appearance-none rounded-lg border-2 border-muted-foreground/30 bg-background px-4 py-2.5 pr-10 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
            >
              <option value="">Selecciona un color</option>
              {colors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {needsColor && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Por favor selecciona un color antes de agregar al carrito.
            </p>
          )}
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Cantidad:</span>
          <div className="flex items-center rounded-md border">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-r-none"
              onClick={decreaseQuantity} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-l-none"
              onClick={increaseQuantity} disabled={quantity >= effectiveStock}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 gap-2">
          <Button className="flex-1" size="lg"
            disabled={effectiveStock === 0 || added}
            onClick={handleAddToCart}
          >
            {added ? (
              <><Check className="mr-2 h-4 w-4" />Agregado</>
            ) : (
              <><ShoppingCart className="mr-2 h-4 w-4" />Agregar al Carrito</>
            )}
          </Button>
          <Button 
            type="button"
            variant="outline" 
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              isFavorite ? removeFavorite(product.id) : addFavorite(product);
            }}
            className={cn(
              "transition-all duration-300",
              mounted && isFavorite 
                ? "text-red-500 border-red-500/50 bg-red-50/50 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40" 
                : ""
            )}
          >
            <Heart className={cn("h-5 w-5 transition-all duration-300", mounted && isFavorite && "fill-current scale-110")} />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Benefits */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Envío gratis</p>
            <p className="text-xs text-muted-foreground">En pedidos +$ 200</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Devoluciones</p>
            <p className="text-xs text-muted-foreground">30 días para devolver</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Garantía</p>
            <p className="text-xs text-muted-foreground">1 año de garantía</p>
          </div>
        </div>
      </div>

      {/* Specs */}
{(() => {
        const publicSpecs = Object.entries(product.specs).filter(([key]) => !key.startsWith("Stock_"))
        return publicSpecs.length > 0 ? (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-3">Especificaciones</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {publicSpecs.map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </>
        ) : null
      })()}

      {/* ── SIZE GUIDE MODAL ── */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-1 text-lg font-bold">Guía de Tallas</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Medidas en centímetros. Mídete sin ropa para mayor exactitud.
            </p>
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-semibold">Talla</th>
                  <th className="py-2 font-semibold">Pecho (cm)</th>
                  <th className="py-2 font-semibold">Cintura (cm)</th>
                  <th className="py-2 font-semibold">Cadera (cm)</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.map((row) => (
                  <tr
                    key={row.size}
                    className={cn(
                      "border-b last:border-0 transition-colors",
                      selectedSize === row.size && "bg-primary/10 font-semibold"
                    )}
                  >
                    <td className="py-2 text-left font-medium">{row.size}</td>
                    <td className="py-2">{row.chest}</td>
                    <td className="py-2">{row.waist}</td>
                    <td className="py-2">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">
              Si estás entre dos tallas, te recomendamos elegir la talla mayor.
            </p>
          </div>
        </div>
      )}

      {/* ── CUSTOM ERROR TOAST ── */}
      {errorMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-destructive px-4 py-3 text-sm font-medium text-destructive-foreground shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300">
          <X className="h-4 w-4" />
          {errorMessage}
        </div>
      )}
    </div>
  )
}
