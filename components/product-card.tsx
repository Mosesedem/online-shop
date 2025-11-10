"use client"

import Image from "next/image"
import { useState } from "react"
import { Heart, ShoppingCart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProductDetailsSheet } from "@/components/product-details-sheet"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  rating?: number
  onAddToCart: (productId: string, quantity: number) => void
}

export function ProductCard({ id, name, price, image, category, rating = 4.5, onAddToCart }: ProductCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(id, 1)
  }

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <Image
          src={image || "/placeholder.svg?height=256&width=256&query=product"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-primary uppercase font-semibold">{category}</p>
          <h3 className="font-semibold text-sm line-clamp-2 mt-1">{name}</h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₦{price.toLocaleString()}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs">★</span>
            <span className="text-xs text-muted-foreground">{rating}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <Info className="w-4 h-4 mr-1" />
                Details
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-3/4 md:side-right md:h-full">
              <ProductDetailsSheet productId={id} />
            </SheetContent>
          </Sheet>

          <Button size="sm" variant="ghost" onClick={handleAddToCart} className="flex-1">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add
          </Button>

          <Button size="icon" size="sm" variant="ghost" onClick={() => setIsWishlisted(!isWishlisted)}>
            <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>
    </div>
  )
}
