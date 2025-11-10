import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 })
  }
}
