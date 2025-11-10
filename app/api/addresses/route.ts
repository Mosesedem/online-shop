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

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error("Failed to fetch addresses:", error)
    return NextResponse.json({ message: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const data = await request.json()

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        ...data,
      },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error("Failed to create address:", error)
    return NextResponse.json({ message: "Failed to create address" }, { status: 500 })
  }
}
