import { prisma } from "@/lib/prisma"
import { searchProducts } from "@/lib/search"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const categoryId = searchParams.get("category")

    let products

    if (search) {
      products = await searchProducts(search)
    } else {
      products = await prisma.product.findMany({
        where: categoryId ? { categoryId } : undefined,
        include: {
          category: true,
        },
        take: 100,
      })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 })
  }
}
