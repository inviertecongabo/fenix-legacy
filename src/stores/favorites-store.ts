import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/types"

interface FavoritesState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  hasItem: (productId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === product.id)

        if (!existingItem) {
          set({ items: [...currentItems, product] })
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.id !== productId) })
      },

      hasItem: (productId: string) => {
        return get().items.some((item) => item.id === productId)
      },
    }),
    {
      name: "favorites-storage", // name of item in the storage (must be unique)
    }
  )
)
