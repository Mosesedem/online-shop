"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface AddToCartDialogProps {
  product: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddToCartDialog({ product, open, onOpenChange }: AddToCartDialogProps) {
  const router = useRouter()

  const handleCheckout = () => {
    router.push("/checkout")
    onOpenChange(false)
  }

  const handleContinueShopping = () => {
    onOpenChange(false)
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Added to Cart</DialogTitle>
          <DialogDescription>{product.name} has been added to your cart</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>
            <p className="font-semibold">₦{(product.price * product.quantity).toLocaleString()}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleContinueShopping}>
              Continue Shopping
            </Button>
            <Button className="flex-1" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
