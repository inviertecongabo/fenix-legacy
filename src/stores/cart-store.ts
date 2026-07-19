import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem } from "@/types"

interface CartState {
  items: CartItem[]

  // Actions
  addItem: (product: Product, quantity?: number, size?: string, color?: string, maxStock?: number) => void
  removeItem: (productId: string, size?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string, maxStock?: number) => void
  clearCart: () => void

  // Computed helpers
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, size, color, maxStock) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.size === size && item.color === color
          )

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity
            // Cap at maxStock if provided, otherwise just add
            const capped = maxStock !== undefined ? Math.min(newQuantity, maxStock) : newQuantity
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.size === size && item.color === color
                  ? { ...item, quantity: capped }
                  : item
              ),
            }
          }

          const initialQuantity = maxStock !== undefined ? Math.min(quantity, maxStock) : quantity
          return {
            items: [...state.items, { product, quantity: initialQuantity, size, color }],
          }
        })
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.size === size && item.color === color)
          ),
        }))
      },

      updateQuantity: (productId, quantity, size, color, maxStock) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color)
          return
        }

        const capped = maxStock !== undefined ? Math.min(quantity, maxStock) : quantity
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.size === size && item.color === color 
              ? { ...item, quantity: capped } 
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "basictech-cart",
    }
  )
)
