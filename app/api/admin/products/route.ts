import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { 
        category: true,
        _count: {
          select: {
            reviews: true,
            orderItems: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, stock, sku, categoryId, ageCategory, images } = body

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        sku: sku || null,
        categoryId,
        ageCategory,
        images: images || [],
      },
      include: { category: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 })
  }
}
