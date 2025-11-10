import { prisma } from "./prisma"

export async function searchProducts(query: string) {
  if (!query || query.length < 2) {
    return []
  }

  // Fuzzy search using Postgres text search
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            search: query,
          },
        },
        {
          description: {
            search: query,
          },
        },
        {
          name: {
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
  })

  return products
}
