"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { AddToCartDialog } from "@/components/add-to-cart-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<any>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy, priceRange, currentPage]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory) params.append("category", selectedCategory);
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      let productList = [];
      if (Array.isArray(data)) {
        productList = data;
      } else if (data.products && Array.isArray(data.products)) {
        productList = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        productList = data.data;
      } else {
        console.error("Unexpected products response format:", data);
        productList = [];
      }

      // Apply client-side filtering and sorting
      let filtered = productList.filter(
        (p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]
      );

      // Apply sorting
      switch (sortBy) {
        case "price-asc":
          filtered.sort((a: any, b: any) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a: any, b: any) => b.price - a.price);
          break;
        case "name-asc":
          filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered.sort((a: any, b: any) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }

      setProducts(filtered);
      
      // Calculate total pages based on filtered results
      const calculatedPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
      setTotalPages(calculatedPages);
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
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSortBy("featured");
    setPriceRange([0, 100000]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Calculate paginated products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setLastAddedProduct({ ...product, quantity });
      setShowAddToCartDialog(true);
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <label className="text-sm font-semibold mb-3 block">Sort By</label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-semibold mb-3 block">Price Range</label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Min</label>
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                handlePriceRangeChange([Math.max(0, val), priceRange[1]]);
              }}
              className="h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Max</label>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 100000;
                handlePriceRangeChange([priceRange[0], Math.min(100000, val)]);
              }}
              className="h-9"
            />
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
        </div>
        <Slider
          min={0}
          max={100000}
          step={1000}
          value={priceRange}
          onValueChange={handlePriceRangeChange}
        />
      </div>

      {/* Categories */}
      <div>
        <label className="text-sm font-semibold mb-3 block">Categories</label>
        <div className="space-y-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryChange(null)}
            className="w-full justify-start"
            size="sm"
          >
            All Products
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(cat.id)}
              className="w-full justify-start"
              size="sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full">
        <X className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop Our Collection</h1>

        {/* Search */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Mobile Filter Button & Desktop Sort */}
        <div className="flex items-center gap-3 mb-4">
          {/* Mobile Filter Button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden flex-1">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Sort */}
          <div className="flex-1 md:flex-none md:w-64">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop Category Pills */}
        <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryChange(null)}
            size="sm"
          >
            All Products
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(cat.id)}
              size="sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-6 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h3>
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-muted-foreground">No products found</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} products
              </div>
              <ProductGrid products={paginatedProducts} onAddToCart={handleAddToCart} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(i + 1)}
                        size="sm"
                        className="w-10"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add to Cart Dialog */}
      <AddToCartDialog
        product={lastAddedProduct}
        open={showAddToCartDialog}
        onOpenChange={setShowAddToCartDialog}
      />
    </main>
  );
}
