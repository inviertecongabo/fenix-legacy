"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface SizeFilterProps {
  selectedSizes: string[]
  onSizesChange: (sizes: string[]) => void
}

export function SizeFilter({ selectedSizes, onSizesChange }: SizeFilterProps) {
  const [isOpen, setIsOpen] = useState(true)

  const sizesList = ["XS", "S", "M", "L", "XL", "38", "39", "40", "41", "42", "44"]

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter((s) => s !== size))
    } else {
      onSizesChange([...selectedSizes, size])
    }
  }

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 font-medium"
      >
        Tallas
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {sizesList.map((size) => {
            const isSelected = selectedSizes.includes(size)
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold uppercase transition-colors ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
