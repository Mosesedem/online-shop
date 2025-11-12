"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { Upload, ArrowLeft, FileSpreadsheet, Plus, X, Download } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
  id: string;
  name: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    categoryId: "",
    ageCategory: "ADULT_18",
    images: [] as string[],
  });
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (res.ok) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Successfully imported ${data.count} products`);
        router.push("/admin/products");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to import products");
      }
    } catch (error) {
      console.error("Failed to import products:", error);
      toast.error("Failed to import products");
    } finally {
      setIsLoading(false);
      setExcelFile(null);
    }
  };


  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Add Product</h1>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="excel">Excel Import</TabsTrigger>
        </TabsList>

        {/* Manual Entry Tab */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ageCategory">Age Category *</Label>
                    <Select
                      value={formData.ageCategory}
                      onValueChange={(value) => setFormData({ ...formData, ageCategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADULT_18">18+</SelectItem>
                        <SelectItem value="ADULT_21">21+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <ImageUpload
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                  maxImages={5}
                  label="Product Images"
                />

                <div className="flex gap-3">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Excel Import Tab */}
        <TabsContent value="excel">
          <Card>
            <CardHeader>
              <CardTitle>Import Products from Excel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload an Excel file (.xlsx) with product data
                </p>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  disabled={isLoading}
                  className="max-w-xs mx-auto"
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Excel Format Requirements:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Column A: Product Name (required)</li>
                  <li>• Column B: Description (required)</li>
                  <li>• Column C: Price (required, number)</li>
                  <li>• Column D: Stock (required, number)</li>
                  <li>• Column E: SKU (optional)</li>
                  <li>• Column F: Category Name (required)</li>
                  <li>• Column G: Age Category (ADULT_18 or ADULT_21)</li>
                  <li>• Column H: Image URLs (comma-separated)</li>
                </ul>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  // Download template
                  const link = document.createElement("a");
                  link.href = "/templates/product-import-template.xlsx";
                  link.download = "product-import-template.xlsx";
                  link.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
