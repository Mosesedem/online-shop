import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference")

    if (!reference) {
      return NextResponse.redirect(new URL("/checkout?error=invalid_reference", request.url))
    }

    // Verify payment with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    if (!verifyRes.ok) {
      return NextResponse.redirect(new URL("/checkout?error=verification_failed", request.url))
    }

    const verifyData = await verifyRes.json()

    if (verifyData.data.status === "success") {
      // Update order payment status
      const order = await prisma.order.findUnique({
        where: { orderNumber: verifyData.data.reference },
      })

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "COMPLETED",
            status: "PROCESSING",
            transactionId: verifyData.data.id,
          },
        })

        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: verifyData.data.amount / 100, // Convert from kobo to Naira
            provider: "paystack",
            transactionId: verifyData.data.id.toString(),
            status: "COMPLETED",
          },
        })
      }

      return NextResponse.redirect(new URL(`/orders/${order?.id}?success=true`, request.url))
    }

    return NextResponse.redirect(new URL("/checkout?error=payment_failed", request.url))
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.redirect(new URL("/checkout?error=callback_error", request.url))
  }
}
