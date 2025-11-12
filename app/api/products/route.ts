import { prisma } from "@/lib/prisma";
import { searchProducts } from "@/lib/search";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const categoryId = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sort") || "featured";
    const minPrice = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice")!)
      : undefined;

    const skip = (page - 1) * limit;

    let where: any = {};

    // Category filter
    if (categoryId && categoryId !== "null") {
      where.categoryId = categoryId;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = {};
    switch (sortBy) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "name-desc":
        orderBy = { name: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default: // featured
        orderBy = { createdAt: "desc" };
    }

    let products;
    let total;

    if (search && search.length >= 2) {
      // Search query - use case-insensitive contains search
      const searchWhere = {
        ...where,
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };

      [products, total] = await Promise.all([
        prisma.product.findMany({
          where: searchWhere,
          include: {
            category: true,
            _count: {
              select: { reviews: true },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where: searchWhere }),
      ]);
    } else {
      // Regular query without search
      [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
            _count: {
              select: { reviews: true },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);
    }

    return NextResponse.json({ products, total });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
