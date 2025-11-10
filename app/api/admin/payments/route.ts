import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: { order: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Failed to fetch payments:", error)
    return NextResponse.json({ message: "Failed to fetch payments" }, { status: 500 })
  }
}
