import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    return NextResponse.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      recentOrders: orders,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 })
  }
}
