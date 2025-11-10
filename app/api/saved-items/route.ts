import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json([], { status: 200 })
    }

    const savedItems = await prisma.savedItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
    })

    return NextResponse.json(savedItems)
  } catch (error) {
    console.error("Failed to fetch saved items:", error)
    return NextResponse.json({ message: "Failed to fetch saved items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const existingItem = await prisma.savedItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    if (existingItem) {
      return NextResponse.json({ message: "Already saved" }, { status: 400 })
    }

    const savedItem = await prisma.savedItem.create({
      data: {
        userId: user.id,
        productId,
      },
      include: { product: true },
    })

    return NextResponse.json(savedItem, { status: 201 })
  } catch (error) {
    console.error("Failed to save item:", error)
    return NextResponse.json({ message: "Failed to save item" }, { status: 500 })
  }
}
