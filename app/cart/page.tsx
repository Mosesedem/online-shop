"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, ArrowLeft } from "lucide-react"
import { useCartContext } from "@/components/cart-context"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartContext()

  if (items.length === 0) {
    return (
      <main className="container-max py-12">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add items to get started</p>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container-max py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-card p-4 rounded-lg border border-border">
              <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg?height=96&width=96&query=product"}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-primary font-bold">₦{item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    −
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, Number.parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                    min="1"
                  />
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    +
                  </Button>
                </div>
              </div>

              <div className="text-right flex flex-col justify-between">
                <p className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</p>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.productId)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card p-6 rounded-lg border border-border h-fit sticky top-20">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>₦0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>₦0</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>

          <Link href="/checkout" className="block mb-3">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>

          <Link href="/shop" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
