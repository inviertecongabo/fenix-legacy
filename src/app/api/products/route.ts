import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { transformProduct } from "@/lib/transformers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Query params
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "newest"
    const featured = searchParams.get("featured")
    const isNew = searchParams.get("new")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")
    const search = searchParams.get("search")
    const sizes = searchParams.get("sizes")
    const colors = searchParams.get("colors")
    const genders = searchParams.get("genders")

    // Build where clause
    const where: Record<string, any> = {
      isActive: true,
    }

    if (category) {
      const categoriesList = category.split(",")
      where.category = { slug: { in: categoriesList } }
    }

    if (brand) {
      const brandsList = brand.split(",")
      where.brand = { slug: { in: brandsList } }
    }

    if (genders) {
      const gendersList = genders.split(",")
      where.gender = { in: gendersList }
    }

    if (sizes) {
      const sizesList = sizes.split(",")
      where.AND = [
        ...(where.AND || []),
        {
          OR: sizesList.map((sz) => ({
            sizes: { contains: sz },
          })),
        },
      ]
    }

    if (colors) {
      const colorsList = colors.split(",")
      where.AND = [
        ...(where.AND || []),
        {
          OR: colorsList.map((col) => ({
            colors: { contains: col },
          })),
        },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, number>).gte = Number(minPrice)
      if (maxPrice) (where.price as Record<string, number>).lte = Number(maxPrice)
    }

    if (featured === "true") {
      where.isFeatured = true
    }

    if (isNew === "true") {
      where.isNew = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: "desc" }
    switch (sortBy) {
      case "price-asc":
        orderBy = { price: "asc" }
        break
      case "price-desc":
        orderBy = { price: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "popular":
        orderBy = { stock: "desc" }
        break
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        brand: true,
      },
      take: limit ? Number(limit) : undefined,
      skip: offset ? Number(offset) : undefined,
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products: products.map(transformProduct),
      total,
      limit: limit ? Number(limit) : null,
      offset: offset ? Number(offset) : 0,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        comparePrice: body.comparePrice,
        sizes: Array.isArray(body.sizes) ? body.sizes.join(",") : (body.sizes || ""),
        colors: Array.isArray(body.colors) ? body.colors.join(",") : (body.colors || ""),
        gender: body.gender || "Unisex",
        stock: body.stock || 0,
        images: Array.isArray(body.images) ? body.images.join(",") : (body.images || ""),
        specs: body.specs || {},
        isNew: body.isNew || false,
        isFeatured: body.isFeatured || false,
        categoryId: body.categoryId,
        brandId: body.brandId,
      },
      include: {
        category: true,
        brand: true,
      },
    })

    return NextResponse.json(transformProduct(product), { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    )
  }
}
