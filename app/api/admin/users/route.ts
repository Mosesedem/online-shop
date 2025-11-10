import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 })
  }
}
