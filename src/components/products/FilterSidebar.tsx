"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryFilter } from "./CategoryFilter"
import { GenderFilter } from "./GenderFilter"
import { FilterState } from "@/types"

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    (filters.genders && filters.genders.length > 0)

  const handleClearFilters = () => {
    onFiltersChange({
      brands: [],
      categories: [],
      priceRange: [0, 500],
      sortBy: filters.sortBy,
      genders: [],
      sizes: [],
      colors: [],
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-auto p-0 text-sm text-primary hover:text-primary/80"
          >
            Limpiar
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <GenderFilter
        selectedGenders={filters.genders || []}
        onGendersChange={(genders) =>
          onFiltersChange({ ...filters, genders })
        }
      />

      <CategoryFilter
        selectedCategories={filters.categories}
        onCategoriesChange={(categories) =>
          onFiltersChange({ ...filters, categories })
        }
      />
    </div>
  )
}
