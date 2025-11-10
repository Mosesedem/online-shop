import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 })
  }
}
