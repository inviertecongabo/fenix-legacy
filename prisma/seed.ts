import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "file:./dev.db"

  if (url.startsWith("file:")) {
    const adapter = new PrismaBetterSqlite3({ url })
    return new PrismaClient({ adapter })
  }

  const pool = new pg.Pool({ connectionString: url })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const prisma = createPrismaClient()

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.user.deleteMany()

  // Create Categories (Tipos de Prenda)
  const categoriesData = [
    { name: "Zapatillas", slug: "zapatillas", icon: "Activity" },
    { name: "Shorts", slug: "shorts", icon: "Shirt" },
    { name: "Camisetas", slug: "camisetas", icon: "Shirt" },
    { name: "Hoodies", slug: "hoodies", icon: "Shirt" },
    { name: "Pantalones", slug: "pantalones", icon: "Shirt" },
    { name: "Accesorios", slug: "accesorios", icon: "ShoppingBag" },
  ]

  const categories: Record<string, string> = {}
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat })
    categories[cat.slug] = created.id
  }
  console.log(`Created ${categoriesData.length} categories`)

  // Create Brands (Marcas Deportivas)
  const brandsData = [
    { name: "Adidas", slug: "adidas" },
    { name: "Nike", slug: "nike" },
    { name: "Puma", slug: "puma" },
    { name: "Under Armour", slug: "under-armour" },
  ]

  const brands: Record<string, string> = {}
  for (const brand of brandsData) {
    const created = await prisma.brand.create({ data: brand })
    brands[brand.name] = created.id
  }
  console.log(`Created ${brandsData.length} brands`)

  // Create Sportswear Products
  const productsData = [
    {
      name: "Adidas Ultraboost Light Running Shoes",
      slug: "adidas-ultrabooost-light-running-shoes",
      brand: "Adidas",
      category: "zapatillas",
      price: 119.99,
      comparePrice: 190.00,
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
    },
    {
      name: "Nike Dri-FIT Slim Fit T-Shirt",
      slug: "nike-dri-fit-slim-fit-t-shirt",
      brand: "Nike",
      category: "camisetas",
      price: 24.99,
      comparePrice: 40.00,
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
    },
    {
      name: "Adidas Essentials 3-Stripes Fleece Hoodie",
      slug: "adidas-essentials-3-stripes-fleece-hoodie",
      brand: "Adidas",
      category: "hoodies",
      price: 39.99,
      comparePrice: 60.00,
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
    },
    {
      name: "Nike Pro Combat Leggings",
      slug: "nike-pro-combat-leggings",
      brand: "Nike",
      category: "pantalones",
      price: 29.99,
      comparePrice: 50.00,
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
    },
    {
      name: "Puma Classic Suede Sneakers",
      slug: "puma-classic-suede-sneakers",
      brand: "Puma",
      category: "zapatillas",
      price: 49.99,
      comparePrice: 75.00,
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
    },
    {
      name: "Under Armour Training Shorts",
      slug: "under-armour-training-shorts",
      brand: "Under Armour",
      category: "shorts",
      price: 19.99,
      comparePrice: 35.00,
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
    }
  ]

  for (const product of productsData) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        sizes: product.sizes.join(","),
        colors: product.colors.join(","),
        gender: product.gender,
        stock: product.stock,
        images: product.images.join(","),
        specs: product.specs,
        isNew: product.isNew,
        isFeatured: product.isFeatured,
        categoryId: categories[product.category],
        brandId: brands[product.brand],
      },
    })
  }
  console.log(`Created ${productsData.length} products`)

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@fenixlegacy.com",
      password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9lK", // password: admin123
      name: "Admin Fénix Legacy",
      phone: "+58 412 9993311",
      role: "ADMIN",
      status: "ACTIVE",
    },
  })
  console.log(`Created admin user: ${adminUser.email}`)

  // Create Test Customer
  const customerUser = await prisma.user.create({
    data: {
      email: "cliente@email.com",
      password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9lK", // password: admin123
      name: "Aiberson Montilla",
      phone: "+58 412 1234567",
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  })
  console.log(`Created customer user: ${customerUser.email}`)

  // Create Address for Customer
  await prisma.address.create({
    data: {
      label: "Casa Caracas",
      name: "Aiberson Montilla",
      phone: "+58 412 1234567",
      address: "Calle Principal Sabana Grande",
      city: "Caracas",
      state: "Distrito Capital",
      zipCode: "1050",
      isDefault: true,
      userId: customerUser.id,
    },
  })
  console.log("Created address for customer")

  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
