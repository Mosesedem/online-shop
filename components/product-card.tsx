"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProductDetailsSheet } from "@/components/product-details-sheet";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCartContext } from "@/components/cart-context";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  onAddToCart: (productId: string, quantity: number) => void;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating = 4.5,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCartContext();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCheckingSaved, setIsCheckingSaved] = useState(false);

  // Fetch saved state when component mounts or session changes
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!session?.user) {
        setIsSaved(false);
        return;
      }

      setIsCheckingSaved(true);
      try {
        const res = await fetch("/api/saved-items");
        if (res.ok) {
          const savedItems = await res.json();
          const saved = savedItems.some((item: any) => item.productId === id);
          setIsSaved(saved);
        }
      } catch (error) {
        console.error("Failed to check saved status:", error);
      } finally {
        setIsCheckingSaved(false);
      }
    };

    checkSavedStatus();
  }, [session, id]);

  const handleCardClick = () => {
    router.push(`/products/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: id,
      productName: name,
      price,
      quantity: 1,
      image,
    });
    toast.success(`Added ${name} to cart`);
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user) {
      toast.error("Please login to save items");
      return;
    }

    try {
      if (isSaved) {
        await fetch(`/api/saved-items/${id}`, { method: "DELETE" });
        setIsSaved(false);
        toast.success("Removed from saved items");
      } else {
        await fetch("/api/saved-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });
        setIsSaved(true);
        toast.success("Added to saved items");
      }
    } catch (error) {
      toast.error("Failed to update saved items");
    }
  };

  return (
    <div
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-baby-pink-lighter overflow-hidden">
        <Image
          src={image || "/placeholder.svg?height=256&width=256&query=product"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-deep-oxblood/0 group-hover:bg-deep-oxblood/10 transition-colors" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 md:p-4 space-y-1.5 sm:space-y-2">
        <div className="flex-1 min-h-0 flex justify-between ">
          <p className="text-[10px] sm:text-xs text-deep-oxblood uppercase font-semibold tracking-wide">
            {category}
          </p>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleSave}
            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
          >
            <Heart
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
              fill={isSaved ? "currentColor" : "none"}
            />
          </Button>
        </div>
        <h3 className="font-semibold text-xs sm:text-sm md:text-base line-clamp-2 mt-0.5 sm:mt-1 leading-tight">
          {name}
        </h3>
        {/* </div> */}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm sm:text-base md:text-lg font-bold text-deep-oxblood">
            ₦{price.toLocaleString()}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="text-[10px] sm:text-xs text-baby-pink">★</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {rating}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <SheetTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent text-[10px] sm:text-xs md:text-sm h-7 sm:h-8 md:h-9 px-1.5 sm:px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 sm:mr-1" />
                {/* <span className="hidden sm:inline">Details</span> */}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[85vh] md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:h-full md:w-[400px] lg:w-[450px] md:data-[state=closed]:slide-out-to-right md:data-[state=open]:slide-in-from-right"
            >
              <SheetTitle className="sr-only">Product Details</SheetTitle>
              <ProductDetailsSheet productId={id} />
            </SheetContent>
          </Sheet>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddToCart}
            className="flex-1 text-[10px] sm:text-xs md:text-sm h-7 sm:h-8 md:h-9 px-1.5 sm:px-2"
          >
            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 sm:mr-1" />
            <span className="hidden xs:inline">Add</span>
          </Button>

          {/* <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleSave}
            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
          >
            <Heart
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
              fill={isSaved ? "currentColor" : "none"}
            />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
