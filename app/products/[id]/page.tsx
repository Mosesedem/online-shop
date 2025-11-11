"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { useCartContext } from "@/components/cart-context";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCartContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        setProduct(data);
        
        if (session?.user) {
          const savedRes = await fetch("/api/saved-items");
          const savedItems = await savedRes.json();
          const saved = savedItems.some((item: any) => item.productId === params.id);
          setIsSaved(saved);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, session]);

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
        await fetch(`/api/saved-items/${params.id}`, { method: "DELETE" });
        setIsSaved(false);
        toast.success("Removed from saved items");
      } else {
        await fetch("/api/saved-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: params.id }),
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-4 sm:py-6 md:py-12 max-w-7xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-baby-pink-lighter">
            <Image
              src={product.images?.[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
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

        <div className="space-y-6">
          <div>
            <p className="text-sm text-deep-oxblood uppercase font-semibold mb-2">
              {product.category?.name}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-baby-pink text-baby-pink"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.5)</span>
            </div>
            <p className="text-3xl font-bold text-deep-oxblood">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          <div className="border-t border-b py-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
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
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleSave}
              >
                <Heart
                  className="w-5 h-5"
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
      </div>
    </main>
  );
}
