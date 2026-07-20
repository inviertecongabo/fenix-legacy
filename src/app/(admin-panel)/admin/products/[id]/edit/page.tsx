"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
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

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<UploadedImage[]>([])

  // Variant stock map. Key formats:
  //  "Color::Size"  – when both colors AND sizes are defined
  //  "Color"        – when only colors are defined
  //  "Size"         – when only sizes are defined
  const [variantStocks, setVariantStocks] = useState<Record<string, number>>({})
  // Global stock (used when neither colors nor sizes are defined)
  const [globalStock, setGlobalStock] = useState<number>(0)
  // Local sizes state (mirrors RHF "sizes" field but stays reactive with checkboxes)
  const [localSizes, setLocalSizes] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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
  const watchedCategoryId = watch("categoryId")
  const watchedBrandId = watch("brandId")
  const watchedGender = watch("gender")

  // Parse the comma-separated colors into an array whenever the field changes
  const parsedColors = useMemo(() => {
    if (!colorsRaw) return []
    return colorsRaw
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
  }, [colorsRaw])

  const hasColors = parsedColors.length > 0
  const hasSizes  = localSizes.length > 0

  // Sync variantStocks whenever colors or sizes change.
  // Keeps existing values for surviving keys, drops removed keys.
  useEffect(() => {
    setVariantStocks((prev) => {
      const next: Record<string, number> = {}
      if (hasColors && hasSizes) {
        for (const color of parsedColors) {
          for (const size of localSizes) {
            const key = `${color}::${size}`
            next[key] = prev[key] ?? 0
          }
        }
      } else if (hasColors) {
        for (const color of parsedColors) {
          next[color] = prev[color] ?? 0
        }
      } else if (hasSizes) {
        for (const size of localSizes) {
          next[size] = prev[size] ?? 0
        }
      }
      return next
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedColors.join(","), localSizes.join(",")])

  const totalStock = (hasColors || hasSizes)
    ? Object.values(variantStocks).reduce((acc, n) => acc + n, 0)
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error("Failed to fetch product")
        const product = await res.json()
        
        reset({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          comparePrice: product.originalPrice,
          categoryId: product.categoryId || "",
          brandId: product.brandId || "",
          isNew: product.isNew,
          isFeatured: product.isFeatured,
          sizes: product.sizes || [],
          colors: product.colors?.join(", ") || "",
          gender: product.gender,
        })
        
        setGlobalStock(product.stock || 0)
        
        // Populate local sizes state for reactivity
        if (product.sizes && product.sizes.length > 0) {
          setLocalSizes(product.sizes)
        }
        
        if (product.images) {
          setImages(product.images.map((url: string) => ({ url, publicId: "" })))
        }

        if (product.specs) {
          const stocks: Record<string, number> = {}
          Object.keys(product.specs).forEach(key => {
            if (key.startsWith("Stock_")) {
              const variantKey = key.replace("Stock_", "")
              stocks[variantKey] = Number(product.specs[key])
            }
          })
          setVariantStocks(stocks)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchProduct()
  }, [id, reset])

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

    setSaving(true)
    try {
      // Build specs with variant stock breakdown
      const stockSpecs: Record<string, string> = {}
      if (hasColors || hasSizes) {
        for (const [key, val] of Object.entries(variantStocks)) {
          stockSpecs[`Stock_${key}`] = String(val)
        }
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
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
          <h1 className="text-2xl font-bold">Editar Producto</h1>
          <p className="text-muted-foreground">
            Modifica la informacion del producto
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría</Label>
                <Select value={watchedCategoryId} onValueChange={(value) => setValue("categoryId", value)}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Seleccionar categoría" />
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
                <Select value={watchedBrandId} onValueChange={(value) => setValue("brandId", value)}>
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
                <Select value={watchedGender} onValueChange={(value) => setValue("gender", value)}>
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
                      checked={localSizes.includes(size)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...localSizes, size]
                          : localSizes.filter((s) => s !== size)
                        setLocalSizes(next)
                        setValue("sizes", next)
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

            {/* Stock section — adapts to color/size selections */}
            {!hasColors && !hasSizes ? (
              /* Neither → single global stock field */
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    {hasColors && hasSizes
                      ? "Stock por color y talla"
                      : hasColors
                      ? "Stock por color"
                      : "Stock por talla"}
                  </Label>
                  <span className="text-sm font-semibold text-primary">
                    Total: {totalStock} unidades
                  </span>
                </div>

                {hasColors && hasSizes ? (
                  /* ── MATRIX: color rows × size columns ── */
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Color \ Talla</th>
                          {localSizes.map((sz) => (
                            <th key={sz} className="px-3 py-2 text-center font-medium text-muted-foreground min-w-[70px]">
                              {sz}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {parsedColors.map((color) => (
                          <tr key={color} className="bg-card">
                            <td className="px-3 py-2 font-medium whitespace-nowrap">{color}</td>
                            {localSizes.map((sz) => {
                              const key = `${color}::${sz}`
                              return (
                                <td key={sz} className="px-2 py-2 text-center">
                                  <Input
                                    type="number"
                                    min={0}
                                    value={variantStocks[key] ?? 0}
                                    onChange={(e) =>
                                      setVariantStocks((prev) => ({
                                        ...prev,
                                        [key]: Math.max(0, parseInt(e.target.value) || 0),
                                      }))
                                    }
                                    className="w-16 text-center h-8 text-sm mx-auto block"
                                  />
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* ── LIST: per color OR per size (with +/- buttons) ── */
                  <div className="divide-y divide-border rounded-lg border overflow-hidden">
                    {(hasColors ? parsedColors : localSizes).map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between gap-4 px-4 py-3 bg-card"
                      >
                        <span className="font-medium text-sm flex-1">
                          {hasSizes && !hasColors ? `Talla ${item}` : item}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              setVariantStocks((prev) => ({
                                ...prev,
                                [item]: Math.max(0, (prev[item] ?? 0) - 1),
                              }))
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min={0}
                            value={variantStocks[item] ?? 0}
                            onChange={(e) =>
                              setVariantStocks((prev) => ({
                                ...prev,
                                [item]: Math.max(0, parseInt(e.target.value) || 0),
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
                              setVariantStocks((prev) => ({
                                ...prev,
                                [item]: (prev[item] ?? 0) + 1,
                              }))
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  El stock total ({totalStock}) es la suma de todas las variantes y se guardará automáticamente.
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
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
