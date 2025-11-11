"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
}

interface ProductDetailsSheetProps {
  productId: string;
}

export function ProductDetailsSheet({ productId }: ProductDetailsSheetProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-primary text-lg font-semibold mt-2">
          ₦
          {typeof product.price === "number"
            ? product.price.toLocaleString()
            : "0"}
        </p>
      </div>

      <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
        <Image
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Quantity</label>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
              }
              className="w-16 text-center"
              min="1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
