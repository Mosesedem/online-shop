"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bookmark, ShoppingCart, ArrowLeft } from "lucide-react"

interface SavedItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
}

export default function SavedItemsPage() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSavedItems()
  }, [])

  const fetchSavedItems = async () => {
    try {
      const res = await fetch("/api/saved-items")
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch saved items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (savedItemId: string) => {
    try {
      const res = await fetch(`/api/saved-items/${savedItemId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== savedItemId))
      }
    } catch (error) {
      console.error("Failed to remove saved item:", error)
    }
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
          <Bookmark className="w-12 h-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">No saved items</h1>
          <p className="text-muted-foreground">Save items for later</p>
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
      <h1 className="text-3xl font-bold mb-8">Saved Items</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
          >
            <div className="relative w-32 h-32 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={item.product.images?.[0] || "/placeholder.svg?height=128&width=128&query=product"}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-primary font-bold text-lg">₦{item.product.price.toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleRemove(item.id)}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
