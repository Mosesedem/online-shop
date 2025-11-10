"use client";

import { ProductCard } from "@/components/product-card";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    images: string[];
    category: { name: string };
  }>;
  onAddToCart: (productId: string, quantity: number) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  // Add validation to ensure products is an array
  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {productList.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.images?.[0] || ""}
          category={product.category?.name || ""}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
