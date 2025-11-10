"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface OrderDetailPage {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  email: string
  createdAt: string
  items: Array<{
    id: string
    productId: string
    quantity: number
    price: number
    product?: {
      name: string
      images: string[]
    }
  }>
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<OrderDetailPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      }
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="container-max py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="container-max py-12">
        <p className="text-center text-muted-foreground">Order not found</p>
      </main>
    )
  }

  return (
    <main className="container-max py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Confirmation</h1>
        <p className="text-muted-foreground">Order #{order.orderNumber}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-semibold capitalize text-primary">{order.paymentStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items Ordered</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="relative w-16 h-16 rounded bg-muted flex-shrink-0">
                    {item.product?.images?.[0] && (
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Email: {order.email}</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">₦{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <Link href="/shop" className="block mt-6">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
