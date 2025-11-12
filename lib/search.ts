import { prisma } from "./prisma";

export async function searchProducts(query: string) {
  if (!query || query.length < 2) {
    return [];
  }

  // Partial matching (non-fuzzy fallback)
  const products = await prisma.product.findMany({
    where: {
      OR: [
        // {
        //   name: {
        //     search: query,  // <-- Commented out: Requires Prisma 5.0+
        //   },
        // },
        // {
        //   description: {
        //     search: query,  // <-- Commented out: Requires Prisma 5.0+
        //   },
        // },
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            // <-- Added this for consistency
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      category: true,
      _count: {
        select: { reviews: true },
      },
    },
    take: 20,
  });

  return products;
}
