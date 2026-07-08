"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface GenderFilterProps {
  selectedGenders: string[]
  onGendersChange: (genders: string[]) => void
}

export function GenderFilter({ selectedGenders, onGendersChange }: GenderFilterProps) {
  const [isOpen, setIsOpen] = useState(true)

  const gendersList = ["Hombre", "Mujer", "Unisex"]

  const handleGenderToggle = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      onGendersChange(selectedGenders.filter((g) => g !== gender))
    } else {
      onGendersChange([...selectedGenders, gender])
    }
  }

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 font-medium"
      >
        Género
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {gendersList.map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={selectedGenders.includes(gender)}
                onCheckedChange={() => handleGenderToggle(gender)}
              />
              <Label
                htmlFor={`gender-${gender}`}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {gender}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
