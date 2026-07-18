"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Plus, Minus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/ImageUpload"

interface UploadedImage {
  url: string
  publicId: string
}

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().min(1, "La descripcion es requerida"),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  comparePrice: z.number().optional(),
  categoryId: z.string().min(1, "La categoria es requerida"),
  brandId: z.string().min(1, "La marca es requerida"),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  sizes: z.array(z.string()),
  colors: z.string(),
  gender: z.string(),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
  slug: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<UploadedImage[]>([])

  // Per-color stock state: { "Blanco": 5, "Rojo": 10 }
  const [colorStocks, setColorStocks] = useState<Record<string, number>>({})
  // Global stock (used when no colors defined)
  const [globalStock, setGlobalStock] = useState<number>(0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isNew: false,
      isFeatured: false,
      sizes: [],
      colors: "",
      gender: "Unisex",
    },
  })

  const colorsRaw = watch("colors")

  // Parse the comma-separated colors into an array whenever the field changes
  const parsedColors = useMemo(() => {
    if (!colorsRaw) return []
    return colorsRaw
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
  }, [colorsRaw])

  const hasColors = parsedColors.length > 0

  // Sync colorStocks when parsedColors changes
  // Keep existing values, add new keys, remove deleted keys
  useEffect(() => {
    setColorStocks((prev) => {
      const next: Record<string, number> = {}
      for (const color of parsedColors) {
        next[color] = prev[color] ?? 0
      }
      return next
    })
  }, [parsedColors.join(",")])

  const totalStock = hasColors
    ? Object.values(colorStocks).reduce((acc, n) => acc + n, 0)
    : globalStock

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ])

        const categoriesData = await categoriesRes.json()
        const brandsData = await brandsRes.json()

        setCategories(categoriesData || [])
        setBrands(brandsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      alert("Debes subir al menos una imagen")
      return
    }

    if (hasColors) {
      const allFilled = parsedColors.every((c) => colorStocks[c] !== undefined)
      if (!allFilled) {
        alert("Por favor define el stock para cada color")
        return
      }
    }

    setSaving(true)
    try {
      // Build a specs object that includes color stock breakdown
      const stockSpecs: Record<string, string> = {}
      if (hasColors) {
        for (const color of parsedColors) {
          stockSpecs[`Stock_${color}`] = String(colorStocks[color] ?? 0)
        }
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          stock: totalStock,
          images: images.map((img) => img.url),
          specs: stockSpecs,
        }),
      })

      if (!response.ok) throw new Error("Error creating product")

      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nuevo Producto</h1>
          <p className="text-muted-foreground">
            Agrega un nuevo producto al catalogo
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Información Básica ── */}
        <Card>
          <CardHeader>
            <CardTitle>Informacion Basica</CardTitle>
            <CardDescription>
              Datos principales del producto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre del producto"
                  {...register("name", {
                    onChange: (e) => {
                      setValue("slug", generateSlug(e.target.value))
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  placeholder="nombre-del-producto"
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                placeholder="Descripcion detallada del producto"
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoria</Label>
                <Select onValueChange={(value) => setValue("categoryId", value)}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Seleccionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandId">Marca</Label>
                <Select onValueChange={(value) => setValue("brandId", value)}>
                  <SelectTrigger id="brandId">
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brandId && (
                  <p className="text-sm text-destructive">{errors.brandId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select onValueChange={(value) => setValue("gender", value)} defaultValue="Unisex">
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hombre">Hombre</SelectItem>
                    <SelectItem value="Mujer">Mujer</SelectItem>
                    <SelectItem value="Unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Tallas y Colores ── */}
        <Card>
          <CardHeader>
            <CardTitle>Tallas y Colores</CardTitle>
            <CardDescription>
              Configura las variaciones de la prenda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tallas Disponibles</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["XS", "S", "M", "L", "XL", "38", "39", "40", "41", "42", "44"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={(watch("sizes") || []).includes(size)}
                      onCheckedChange={(checked) => {
                        const currentSizes = watch("sizes") || []
                        if (checked) {
                          setValue("sizes", [...currentSizes, size])
                        } else {
                          setValue("sizes", currentSizes.filter((s) => s !== size))
                        }
                      }}
                    />
                    <Label htmlFor={`size-${size}`} className="font-normal cursor-pointer">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Colores (separados por comas)</Label>
              <Input
                id="colors"
                placeholder="Ej: Negro Core, Blanco Cloud, Azul"
                {...register("colors")}
              />
              {hasColors && (
                <p className="text-xs text-muted-foreground">
                  {parsedColors.length} color{parsedColors.length !== 1 ? "es" : ""} detectado{parsedColors.length !== 1 ? "s" : ""}. Define el stock por color abajo.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Precio e Inventario ── */}
        <Card>
          <CardHeader>
            <CardTitle>Precio e Inventario</CardTitle>
            <CardDescription>
              Configura precio y disponibilidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prices */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Precio anterior (opcional)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("comparePrice", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Stock section — changes based on whether colors exist */}
            {!hasColors ? (
              /* No colors → single global stock field */
              <div className="space-y-2">
                <Label htmlFor="globalStock">Stock total</Label>
                <Input
                  id="globalStock"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={globalStock}
                  onChange={(e) => setGlobalStock(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            ) : (
              /* Has colors → one stock field per color */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Stock por color</Label>
                  <span className="text-sm font-semibold text-primary">
                    Total: {totalStock} unidades
                  </span>
                </div>
                <div className="divide-y divide-border rounded-lg border overflow-hidden">
                  {parsedColors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center justify-between gap-4 px-4 py-3 bg-card"
                    >
                      <span className="font-medium text-sm flex-1">{color}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            setColorStocks((prev) => ({
                              ...prev,
                              [color]: Math.max(0, (prev[color] ?? 0) - 1),
                            }))
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min={0}
                          value={colorStocks[color] ?? 0}
                          onChange={(e) =>
                            setColorStocks((prev) => ({
                              ...prev,
                              [color]: Math.max(0, parseInt(e.target.value) || 0),
                            }))
                          }
                          className="w-20 text-center h-7 text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            setColorStocks((prev) => ({
                              ...prev,
                              [color]: (prev[color] ?? 0) + 1,
                            }))
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  El stock total ({totalStock}) es la suma de todos los colores y se guardará automáticamente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Imágenes ── */}
        <Card>
          <CardHeader>
            <CardTitle>Imagenes</CardTitle>
            <CardDescription>
              Sube las imagenes del producto (máximo 5)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={images}
              onChange={setImages}
              maxImages={5}
            />
          </CardContent>
        </Card>

        {/* ── Opciones ── */}
        <Card>
          <CardHeader>
            <CardTitle>Opciones</CardTitle>
            <CardDescription>
              Configuraciones adicionales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                checked={watch("isNew")}
                onCheckedChange={(checked) => setValue("isNew", !!checked)}
              />
              <Label htmlFor="isNew" className="font-normal">
                Marcar como producto nuevo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={watch("isFeatured")}
                onCheckedChange={(checked) => setValue("isFeatured", !!checked)}
              />
              <Label htmlFor="isFeatured" className="font-normal">
                Mostrar en productos destacados
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Producto"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
