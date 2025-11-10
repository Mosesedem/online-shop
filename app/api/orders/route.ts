import { prisma } from "@/lib/prisma"
import { generateOrderNumber } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, items, addressId, paymentMethod, userId } = await request.json()

    if (!email || !items || items.length === 0) {
      return NextResponse.json({ message: "Invalid order data" }, { status: 400 })
    }

    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: userId || undefined,
        email,
        addressId: addressId || undefined,
        paymentMethod,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 })
  }
}
