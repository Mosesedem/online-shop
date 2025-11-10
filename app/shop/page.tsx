"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { AddToCartDialog } from "@/components/add-to-cart-dialog";
import { Button } from "@/components/ui/button";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (query = "", categoryId = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (categoryId) params.append("category", categoryId);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      // Handle different response formats
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (data.data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error("Unexpected products response format:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      // Handle different response formats
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (data.data && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        console.error("Unexpected categories response format:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchProducts(query, selectedCategory || "");
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    fetchProducts(searchQuery, categoryId || "");
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setLastAddedProduct({ ...product, quantity });
      setShowAddToCartDialog(true);
    }
  };

  return (
    <main className="container-max py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Shop Our Collection</h1>

        {/* Search */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryChange(null)}
          >
            All Products
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      )}

      {/* Add to Cart Dialog */}
      <AddToCartDialog
        product={lastAddedProduct}
        open={showAddToCartDialog}
        onOpenChange={setShowAddToCartDialog}
      />
    </main>
  );
}
