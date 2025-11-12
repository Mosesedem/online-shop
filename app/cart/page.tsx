"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCartContext } from "@/components/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } =
    useCartContext();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setIsClearing(true);
      clearCart();
      setTimeout(() => setIsClearing(false), 300);
    }
  };

  const subtotal = total;
  const shipping = 0;
  const tax = 0;
  const finalTotal = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-4 py-12 min-h-[400px]">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl md:text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground text-center">
            Add items to get started
          </p>
          <Button asChild className="mt-4">
            <Link href="/shop">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          disabled={isClearing}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 md:gap-4 bg-card p-3 md:p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden bg-muted  shrink-0">
                <Image
                  src={
                    item.image ||
                    "/placeholder.svg?height=96&width=96&query=product"
                  }
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-primary font-bold text-base md:text-lg">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls - Mobile */}
                <div className="flex items-center gap-2 mt-2 md:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-medium min-w-8 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {/* Quantity Controls - Desktop */}
                <div className="hidden md:flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 1;
                      updateQuantity(item.productId, Math.max(1, value));
                    }}
                    className="w-16 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Item Total and Remove */}
              <div className="flex flex-col items-end justify-between">
                <p className="font-bold text-sm md:text-base">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-4 md:p-6 rounded-lg border border-border lg:sticky lg:top-20">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0
                    ? "Free"
                    : `₦${Number(shipping).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">₦{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-base md:text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ₦{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/shop">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                <svg
                  className="w-4 h-4 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p>Secure checkout with encrypted payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
