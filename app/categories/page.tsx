"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        let categoryList = [];
        if (Array.isArray(data)) {
          categoryList = data;
        } else if (data.categories && Array.isArray(data.categories)) {
          categoryList = data.categories;
        } else if (data.data && Array.isArray(data.data)) {
          categoryList = data.data;
        }

        setCategories(categoryList);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-4 sm:py-6 md:py-12 max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-4 sm:py-6 md:py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Shop by Category</h1>
        <p className="text-muted-foreground">
          Browse our curated collection of wellness products organized by category
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Package className="w-16 h-16 text-muted-foreground" />
          <p className="text-muted-foreground">No categories available</p>
          <Button asChild>
            <Link href="/shop">Browse All Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative bg-card rounded-lg border border-border hover:border-deep-oxblood hover:shadow-lg transition-all p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-deep-oxblood transition-colors">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-deep-oxblood group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
              </div>

              {category._count && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>
                    {category._count.products}{" "}
                    {category._count.products === 1 ? "product" : "products"}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-deep-oxblood/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/shop">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
