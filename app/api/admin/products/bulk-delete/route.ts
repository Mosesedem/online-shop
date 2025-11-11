import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid product IDs" },
        { status: 400 }
      );
    }

    // Delete products in a transaction
    await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${ids.length} products deleted successfully`,
      deletedCount: ids.length,
    });
  } catch (error) {
    console.error("Failed to bulk delete products:", error);
    return NextResponse.json(
      { message: "Failed to delete products" },
      { status: 500 }
    );
  }
}
