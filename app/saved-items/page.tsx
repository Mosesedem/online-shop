"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bookmark,
  ShoppingCart,
  ArrowLeft,
  Trash,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SavedItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    category?: string;
  };
}

export default function SavedItemsPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchSavedItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchQuery, sortBy]);

  const fetchSavedItems = async () => {
    try {
      const res = await fetch("/api/saved-items");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch saved items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.product.price - b.product.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.product.price - a.product.price);
        break;
      case "name":
        filtered.sort((a, b) => a.product.name.localeCompare(b.product.name));
        break;
      default:
        break;
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleRemove = async (savedItemId: string) => {
    try {
      const res = await fetch(`/api/saved-items/${savedItemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== savedItemId));
      }
    } catch (error) {
      console.error("Failed to remove saved item:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    // Implement add to cart logic
    console.log("Add to cart:", productId);
  };

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading saved items...</p>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-4 py-12 min-h-[400px]">
          <Bookmark className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl md:text-3xl font-bold">No saved items</h1>
          <p className="text-muted-foreground text-center">
            Save items to view them later
          </p>
          <Button asChild className="mt-4">
            <a href="/shop">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </a>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Saved Items</h1>
        <p className="text-muted-foreground">
          {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}{" "}
          saved
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search saved items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid/List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items match your search</p>
        </div>
      ) : (
        <>
          {/* Mobile: List View */}
          <div className="flex flex-col gap-4 md:hidden">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.product.images?.[0] || "/api/placeholder/96/96"}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-semibold text-base line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-primary font-bold text-lg mt-1">
                      ₦{item.product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(item.product.id)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Grid View */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg border border-border hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="relative w-full aspect-square bg-muted overflow-hidden">
                  <img
                    src={item.product.images?.[0] || "/api/placeholder/300/300"}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base mb-2 line-clamp-2 min-h-[3rem]">
                    {item.product.name}
                  </h3>
                  <p className="text-primary font-bold text-lg mb-4">
                    ₦{item.product.price.toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleAddToCart(item.product.id)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden lg:inline">Add</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(item.id)}
                      className="gap-2"
                    >
                      <Trash className="w-4 h-4" />
                      <span className="hidden lg:inline">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-9 h-9"
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
