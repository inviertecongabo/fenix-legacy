import { Product, Category, Brand } from "@/types"

export const categories: Category[] = [
  { id: "1", name: "Zapatillas", slug: "zapatillas", icon: "Activity", productCount: 12 },
  { id: "2", name: "Shorts", slug: "shorts", icon: "Shirt", productCount: 22 },
  { id: "3", name: "Camisetas", slug: "camisetas", icon: "Shirt", productCount: 25 },
  { id: "4", name: "Hoodies", slug: "hoodies", icon: "Shirt", productCount: 18 },
  { id: "5", name: "Pantalones", slug: "pantalones", icon: "Shirt", productCount: 14 },
  { id: "6", name: "Accesorios", slug: "accesorios", icon: "ShoppingBag", productCount: 8 },
]

export const brands: Brand[] = [
  { id: "1", name: "Adidas", logo: undefined, productCount: 30 },
  { id: "2", name: "Nike", logo: undefined, productCount: 39 },
  { id: "3", name: "Puma", logo: undefined, productCount: 10 },
  { id: "4", name: "Under Armour", logo: undefined, productCount: 22 },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Adidas Ultraboost Light Running Shoes",
    slug: "adidas-ultrabooost-light-running-shoes",
    brand: "Adidas",
    category: "zapatillas",
    price: 119.99,
    originalPrice: 190.00,
    sizes: ["38", "40", "42", "44"],
    colors: ["Negro Core", "Blanco Cloud"],
    gender: "Hombre",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    ],
    description: "Siente una energía increíble con la nueva Ultraboost Light, la Ultraboost más ligera de la historia. Amortiguación Adidas Light BOOST.",
    specs: {
      "Tecnología": "Light BOOST",
      "Ajuste": "Tipo media Primeknit+",
      "Suela": "Goma Continental",
      "Condición": "Outlet New with box"
    },
    stock: 12,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Nike Dri-FIT Slim Fit T-Shirt",
    slug: "nike-dri-fit-slim-fit-t-shirt",
    brand: "Nike",
    category: "camisetas",
    price: 24.99,
    originalPrice: 40.00,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Azul", "Gris", "Negro"],
    gender: "Hombre",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    ],
    description: "Camiseta de entrenamiento Nike Dri-FIT con tejido transpirable que absorbe la humedad.",
    specs: {
      "Material": "100% Poliéster reciclado",
      "Corte": "Ajustado (Slim Fit)",
      "Tecnología": "Dri-FIT"
    },
    stock: 25,
    isNew: false,
    isFeatured: true,
    rating: 4.5,
  },
  {
    id: "3",
    name: "Adidas Essentials 3-Stripes Fleece Hoodie",
    slug: "adidas-essentials-3-stripes-fleece-hoodie",
    brand: "Adidas",
    category: "hoodies",
    price: 39.99,
    originalPrice: 60.00,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro", "Gris Melange"],
    gender: "Unisex",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"
    ],
    description: "Este suéter con capucha combina la comodidad de la felpa francesa gruesa con el icónico diseño de las 3 franjas de Adidas.",
    specs: {
      "Material": "70% Algodón, 30% Poliéster reciclado",
      "Corte": "Regular",
      "Estilo": "Originals"
    },
    stock: 18,
    isNew: true,
    isFeatured: true,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Nike Pro Combat Leggings",
    slug: "nike-pro-combat-leggings",
    brand: "Nike",
    category: "pantalones",
    price: 29.99,
    originalPrice: 50.00,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Negro"],
    gender: "Mujer",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600"
    ],
    description: "Mallas de compresión Nike Pro para mujer, diseñadas para brindar soporte y frescura durante entrenamientos intensos.",
    specs: {
      "Material": "83% Poliéster, 17% Elastano",
      "Tecnología": "Nike Pro Support",
      "Largo": "7/8"
    },
    stock: 14,
    isNew: false,
    isFeatured: false,
    rating: 4.4,
  },
  {
    id: "5",
    name: "Puma Classic Suede Sneakers",
    slug: "puma-classic-suede-sneakers",
    brand: "Puma",
    category: "zapatillas",
    price: 49.99,
    originalPrice: 75.00,
    sizes: ["39", "40", "41", "42"],
    colors: ["Rojo", "Azul Marino"],
    gender: "Unisex",
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600"
    ],
    description: "Las legendarias zapatillas Puma Suede, un ícono urbano que nunca pasa de moda. Cuero de gamuza suave y suela retro.",
    specs: {
      "Material": "Cuero de gamuza premium",
      "Suela": "Caucho adherente",
      "Estilo": "Heritage Retro"
    },
    stock: 10,
    isNew: false,
    isFeatured: true,
    rating: 4.6,
  },
  {
    id: "6",
    name: "Under Armour Training Shorts",
    slug: "under-armour-training-shorts",
    brand: "Under Armour",
    category: "shorts",
    price: 19.99,
    originalPrice: 35.00,
    sizes: ["M", "L", "XL"],
    colors: ["Gris", "Negro"],
    gender: "Hombre",
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600"
    ],
    description: "Shorts deportivos ultra ligeros y elásticos para una movilidad total sin restricciones.",
    specs: {
      "Material": "100% Poliéster",
      "Ajuste": "Suelto",
      "Cintura": "Elástica con cordón"
    },
    stock: 22,
    isNew: true,
    isFeatured: false,
    rating: 4.3,
  }
]
