"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react"
import { useCartContext } from "@/components/cart-context"

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem: addToCart } = useCartContext()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist")
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (wishlistItemId: string) => {
    try {
      const res = await fetch(`/api/wishlist/${wishlistItemId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== wishlistItemId))
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: 1,
      image: item.product.images?.[0] || "",
    })
  }

  if (isLoading) {
    return (
      <main className="container-max py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="container-max py-12">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Heart className="w-12 h-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
          <p className="text-muted-foreground">Start adding your favorite items</p>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container-max py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-muted overflow-hidden">
              <Image
                src={item.product.images?.[0] || "/placeholder.svg?height=192&width=192&query=product"}
                alt={item.product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-4 space-y-3">
              <h3 className="font-semibold line-clamp-2">{item.product.name}</h3>
              <p className="text-primary font-bold">₦{item.product.price.toLocaleString()}</p>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(item.id)}>
                  <Heart className="w-4 h-4 fill-current text-primary" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
