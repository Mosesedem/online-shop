"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Package, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string | null;
  images: string[];
  ageCategory: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    reviews: number;
    orderItems: number;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        toast.error("Product not found");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Product deleted successfully");
        router.push("/admin/products");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>{product.category.name}</Badge>
                    <Badge>{product.ageCategory}</Badge>
                    {product.sku && <Badge>SKU: {product.sku}</Badge>}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Price</span>
                  </div>
                  <p className="text-2xl font-bold">₦{product.price.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Stock</span>
                  </div>
                  <p className="text-2xl font-bold">{product.stock}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Orders</span>
                  </div>
                  <p className="text-2xl font-bold">{product._count?.orderItems || 0}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground">Reviews</span>
                  </div>
                  <p className="text-2xl font-bold">{product._count?.reviews || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Product Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Availability</p>
                <Badge className={product.stock > 0 ? "bg-green-500" : "bg-red-500"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/products/${product.id}`} target="_blank">
                  View on Store
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                Duplicate Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
