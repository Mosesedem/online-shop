"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartContext } from "@/components/cart-context";
import { toast } from "sonner";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useSession } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  category?: {
    id: string;
    name: string;
  };
}

interface ProductDetailsSheetProps {
  productId: string;
}

export function ProductDetailsSheet({ productId }: ProductDetailsSheetProps) {
  const { addItem } = useCartContext();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        setProduct(data);

        if (session?.user) {
          const savedRes = await fetch("/api/saved-items");
          const savedItems = await savedRes.json();
          const saved = savedItems.some((item: any) => item.productId === productId);
          setIsSaved(saved);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, session]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || "",
    });

    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleToggleSave = async () => {
    if (!session?.user) {
      toast.error("Please login to save items");
      return;
    }

    try {
      if (isSaved) {
        await fetch(`/api/saved-items/${productId}`, { method: "DELETE" });
        setIsSaved(false);
        toast.success("Removed from saved items");
      } else {
        await fetch("/api/saved-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        setIsSaved(true);
        toast.success("Added to saved items");
      }
    } catch (error) {
      toast.error("Failed to update saved items");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs text-deep-oxblood uppercase font-semibold">
            {product.category?.name || "Product"}
          </p>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-baby-pink text-baby-pink"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">(4.5)</span>
          </div>
          <p className="text-2xl font-bold text-deep-oxblood">
            ₦{typeof product.price === "number" ? product.price.toLocaleString() : "0"}
          </p>
        </div>

        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-baby-pink-lighter">
            <Image
              src={product.images?.[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-deep-oxblood"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Quantity & Actions */}
        <div className="space-y-4 border-t pt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 text-center"
                min="1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleToggleSave}
            >
              <Heart
                className="w-4 h-4"
                fill={isSaved ? "currentColor" : "none"}
              />
            </Button>
          </div>

          {product.stock < 10 && product.stock > 0 && (
            <p className="text-sm text-orange-600">
              Only {product.stock} left in stock!
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-sm text-red-600 font-semibold">
              Out of stock
            </p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
