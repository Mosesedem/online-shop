import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
            orderItems: true,
          }
        }
      },
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const body = await request.json()
    const { name, description, price, stock, sku, categoryId, ageCategory, images } = body

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 })
  }
}
