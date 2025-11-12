"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { ArrowLeft, Save, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  };
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: [] as string[],
  });

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setCategory(data);
        setFormData({
          name: data.name,
          slug: data.slug,
          image: data.image ? [data.image] : [],
        });
      } else {
        toast.error("Category not found");
        router.push("/admin/categories");
      }
    } catch (error) {
      console.error("Failed to fetch category:", error);
      toast.error("Failed to load category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          image: formData.image[0] || null,
        }),
      });

      if (res.ok) {
        toast.success("Category updated successfully");
        fetchCategory();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    
    if (category._count.products > 0) {
      toast.error(`Cannot delete category with ${category._count.products} products`);
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Category deleted successfully");
        router.push("/admin/categories");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting || category._count.products > 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold">Edit Category</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setFormData({ ...formData, name, slug });
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    URL-friendly version of the name
                  </p>
                </div>

                <ImageUpload
                  value={formData.image}
                  onChange={(urls) => setFormData({ ...formData, image: urls })}
                  maxImages={1}
                  label="Category Image"
                />

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Products</span>
                </div>
                <span className="font-semibold">{category._count.products}</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-sm">{new Date(category.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm">{new Date(category.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {category._count.products > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Delete Warning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This category has {category._count.products} product(s). 
                  Please reassign or delete the products before deleting this category.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
