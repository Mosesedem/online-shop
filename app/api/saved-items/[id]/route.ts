import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await prisma.savedItem.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Removed from saved items" }, { status: 200 })
  } catch (error) {
    console.error("Failed to remove saved item:", error)
    return NextResponse.json({ message: "Failed to remove saved item" }, { status: 500 })
  }
}
