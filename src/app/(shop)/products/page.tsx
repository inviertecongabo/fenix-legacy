"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { LayoutGrid, List } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { FilterSidebar } from "@/components/products/FilterSidebar"
import { FilterMobile } from "@/components/products/FilterMobile"
import { ProductGrid } from "@/components/products/ProductGrid"
import { SortSelect } from "@/components/products/SortSelect"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductsStore } from "@/stores/products-store"
import { FilterState } from "@/types"

function ProductsContent() {
  const searchParams = useSearchParams()
  const { products, loading, filters, setFilters, fetchProducts, fetchCategories, fetchBrands } = useProductsStore()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Initialize filters from URL params
  useEffect(() => {
    const categories = searchParams.getAll("category")
    const genders = searchParams.getAll("genders")
    const brands = searchParams.getAll("brand")
    const featured = searchParams.get("featured")

    // Reset to defaults first so stale state from a previous visit doesn't bleed through
    const initialFilters: FilterState = {
      categories: categories.length > 0 ? categories : [],
      genders: genders.length > 0 ? genders : [],
      brands: brands.length > 0 ? brands : [],
      priceRange: [0, 500],
      sortBy: "newest",
      sizes: [],
      colors: [],
    }

    if (featured === "true") {
      // This will be handled in the API call
    }

    setFilters(initialFilters)
    fetchCategories()
    fetchBrands()
  }, [searchParams, setFilters, fetchCategories, fetchBrands])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [filters, fetchProducts])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [setFilters])

  // Save active filters to sessionStorage so the product detail page can reconstruct the back URL
  // NOTE: key names must match the URL params that the products page reads (category, genders, brand)
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.categories.length > 0) {
      filters.categories.forEach(c => params.append("category", c))
    }
    if (filters.genders && filters.genders.length > 0) {
      filters.genders.forEach(g => params.append("genders", g))
    }
    if (filters.brands.length > 0) {
      filters.brands.forEach(b => params.append("brand", b))
    }
    sessionStorage.setItem("productListParams", params.toString())
  }, [filters])

  const activeFilterCount =
    filters.brands.length +
    filters.categories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Productos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Results count and controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Todos los Productos</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Cargando..." : `${products.length} productos encontrados`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FilterMobile
            filters={filters}
            onFiltersChange={handleFiltersChange}
            activeFilterCount={activeFilterCount}
          />
          <SortSelect
            value={filters.sortBy}
            onChange={(sortBy) =>
              setFilters({ sortBy: sortBy as FilterState["sortBy"] })
            }
          />
          <div className="hidden items-center gap-1 border-l pl-3 sm:flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Vista cuadricula</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Vista lista</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <ProductGrid
            products={products}
            viewMode={viewMode}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

function ProductsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Skeleton className="mb-6 h-6 w-48" />
      <div className="mb-6 flex justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
      </div>
      <div className="flex gap-8">
        <aside className="hidden w-64 lg:block">
          <Skeleton className="h-96" />
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  )
}
