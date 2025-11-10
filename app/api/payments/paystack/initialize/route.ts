import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ message: "Order ID required" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Initialize Paystack payment
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email: order.email,
        amount: Math.round(order.totalAmount * 100), // Paystack expects amount in kobo
        reference: order.orderNumber,
        metadata: {
          orderId: order.id,
        },
      }),
    })

    if (!paystackRes.ok) {
      throw new Error("Failed to initialize Paystack payment")
    }

    const paystackData = await paystackRes.json()

    return NextResponse.redirect(paystackData.data.authorization_url)
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ message: "Failed to initialize payment" }, { status: 500 })
  }
}
