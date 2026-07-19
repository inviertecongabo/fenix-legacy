"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductGallery } from "@/components/products/ProductGallery"
import { ProductDetail } from "@/components/products/ProductDetail"
import { ProductCard } from "@/components/products/ProductCard"
import { Product } from "@/types"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [colorImageIndex, setColorImageIndex] = useState(0)
  const [backUrl, setBackUrl] = useState("/products")
  const [backLabel, setBackLabel] = useState("Catálogo de Productos")

  // On mount, read saved filters from sessionStorage to reconstruct the back URL and breadcrumb label
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("productListParams")
      if (saved) {
        const params = new URLSearchParams(saved)
        const categories = params.getAll("category")
        const genders = params.getAll("gender")
        const brands = params.getAll("brand")
        const hasFilters = categories.length > 0 || genders.length > 0 || brands.length > 0
        if (hasFilters) {
          setBackUrl(`/products?${saved}`)
          // Build a human-readable label
          const parts: string[] = []
          if (categories.length > 0) parts.push(categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(" / "))
          if (genders.length > 0) parts.push(genders.join(" / "))
          if (brands.length > 0) parts.push(brands.join(" / "))
          setBackLabel(parts.join(" · "))
        }
      }
    } catch (_) {
      // sessionStorage not available (SSR guard)
    }
  }, [])

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("not_found")
          } else {
            throw new Error("Failed to fetch product")
          }
          return
        }

        const data = await response.json()
        setProduct(data)

        // Fetch related products
        const relatedResponse = await fetch(
          `/api/products?category=${data.category}&limit=4`
        )
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          setRelatedProducts(
            relatedData.products.filter((p: Product) => p.id !== data.id).slice(0, 4)
          )
        }
      } catch (err) {
        setError("error")
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="mb-6 h-6 w-64" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error === "not_found" || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p className="mt-2 text-muted-foreground">
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <Button asChild className="mt-4">
          <Link href="/products">Ver todos los productos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button (preserves filters) */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Volver a los resultados
      </Button>

      {/* Breadcrumb - Desktop */}
      <Breadcrumb className="mb-6 hidden sm:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={backUrl}>{backLabel}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[300px] truncate">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          productName={product.name}
          forcedIndex={colorImageIndex}
          onIndexChange={setColorImageIndex}
        />
        <ProductDetail product={product} onColorImageChange={setColorImageIndex} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Productos Relacionados</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
