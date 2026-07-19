export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  brandId?: string
  category: string
  categoryId?: string
  price: number
  originalPrice?: number
  images: string[]
  description: string
  specs: Record<string, string>
  stock: number
  isNew: boolean
  isFeatured: boolean
  rating: number
  sizes: string[]
  colors: string[]
  gender: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  productCount: number
}

export interface Brand {
  id: string
  name: string
  logo?: string
  productCount: number
}

export interface CartItem {
  product: Product
  quantity: number
  size?: string
  color?: string
}

export interface FilterState {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'newest' | 'rating'
  sizes?: string[]
  colors?: string[]
  genders?: string[]
}
