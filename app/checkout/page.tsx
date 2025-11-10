"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCartContext } from "@/components/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, total, clearCart } = useCartContext()

  const [step, setStep] = useState<"info" | "address" | "payment">("info")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [payment, setPayment] = useState<"paystack" | "etegram">("paystack")

  // Info step state
  const [email, setEmail] = useState(session?.user?.email || "")
  const [createAccount, setCreateAccount] = useState(false)
  const [password, setPassword] = useState("")

  // Address step state
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [useNewAddress, setUseNewAddress] = useState(true)
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    phone: "",
  })

  // Fetch addresses on mount if authenticated
  React.useEffect(() => {
    if (session?.user?.email) {
      fetchAddresses()
    } else {
      setIsLoadingAddresses(false)
    }
  }, [session])

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses")
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
        if (data.length > 0) {
          setSelectedAddressId(data[0].id)
          setUseNewAddress(false)
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const handleStepComplete = async (nextStep: typeof step) => {
    setError("")
    setIsLoading(true)

    try {
      if (step === "info") {
        // Handle account creation if needed
        if (createAccount && !session?.user?.email) {
          const tempPassword = Math.random().toString(36).slice(-12)

          const signupRes = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: email.split("@")[0],
              email,
              password: tempPassword,
            }),
          })

          if (!signupRes.ok) {
            const data = await signupRes.json()
            throw new Error(data.message || "Failed to create account")
          }

          // Send password to email
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              subject: "Your Store Account",
              message: `Your account has been created. Password: ${tempPassword}`,
            }),
          })
        }
        setStep(nextStep)
      } else if (step === "address") {
        // Validate address selection
        if (useNewAddress) {
          if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.phone) {
            throw new Error("Please fill all address fields")
          }

          // Save new address if authenticated
          if (session?.user?.email) {
            const addressRes = await fetch("/api/addresses", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newAddress),
            })

            if (addressRes.ok) {
              const data = await addressRes.json()
              setSelectedAddressId(data.id)
            }
          }
        } else if (!selectedAddressId) {
          throw new Error("Please select a delivery address")
        }

        setStep(nextStep)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async (provider: string) => {
    setError("")
    setIsLoading(true)

    try {
      if (items.length === 0) {
        throw new Error("Your cart is empty")
      }

      // Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items,
          addressId: selectedAddressId || undefined,
          paymentMethod: provider,
        }),
      })

      if (!orderRes.ok) {
        throw new Error("Failed to create order")
      }

      const order = await orderRes.json()

      // Initialize payment with provider
      if (provider === "paystack") {
        // Redirect to Paystack payment
        window.location.href = `/api/payments/paystack/initialize?orderId=${order.id}`
      } else if (provider === "etegram") {
        // Redirect to Etegram payment
        window.location.href = `/api/payments/etegram/initialize?orderId=${order.id}`
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment initialization failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="container-max py-12">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shopping
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container-max py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <Tabs value={step} onValueChange={(v) => setStep(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info" disabled={step !== "info" && !email}>
                Info
              </TabsTrigger>
              <TabsTrigger value="address" disabled={step !== "address" && !email}>
                Address
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={step !== "payment"}>
                Payment
              </TabsTrigger>
            </TabsList>

            {/* Step 1: Info */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Enter your email to continue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={!!session?.user?.email}
                    />
                  </div>

                  {!session?.user?.email && (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="createAccount"
                          checked={createAccount}
                          onChange={(e) => setCreateAccount(e.target.checked)}
                        />
                        <label htmlFor="createAccount" className="text-sm cursor-pointer">
                          Create an account for faster checkout next time
                        </label>
                      </div>

                      {createAccount && (
                        <div>
                          <label className="text-sm font-medium">Password</label>
                          <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            A temporary password will be sent to your email
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <Button
                    onClick={() => handleStepComplete("address")}
                    disabled={!email || isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Processing..." : "Continue to Address"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2: Address */}
            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingAddresses ? (
                    <p className="text-muted-foreground">Loading addresses...</p>
                  ) : (
                    <>
                      {/* Saved Addresses */}
                      {addresses.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="font-medium text-sm">Your Addresses</h3>
                          {addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted"
                              onClick={() => {
                                setUseNewAddress(false)
                                setSelectedAddressId(addr.id)
                              }}
                            >
                              <input
                                type="radio"
                                checked={selectedAddressId === addr.id && !useNewAddress}
                                onChange={() => {
                                  setUseNewAddress(false)
                                  setSelectedAddressId(addr.id)
                                }}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{addr.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {addr.street}, {addr.city}, {addr.state}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* New Address */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <input type="radio" checked={useNewAddress} onChange={() => setUseNewAddress(true)} />
                          <label className="text-sm font-medium cursor-pointer">
                            {addresses.length > 0 ? "Use Different Address" : "Enter Address"}
                          </label>
                        </div>

                        {useNewAddress && (
                          <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={newAddress.name}
                              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="text"
                              placeholder="Street Address"
                              value={newAddress.street}
                              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="City"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                className="w-full p-2 border rounded"
                              />
                              <input
                                type="text"
                                placeholder="State"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                className="w-full p-2 border rounded"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Phone"
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep("info")} className="flex-1">
                          Back
                        </Button>
                        <Button onClick={() => handleStepComplete("payment")} disabled={isLoading} className="flex-1">
                          {isLoading ? "Processing..." : "Continue to Payment"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3: Payment */}
            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    onClick={() => setPayment("paystack")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      payment === "paystack" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Paystack</h3>
                        <p className="text-sm text-muted-foreground">Secure payment with your card</p>
                      </div>
                      <input type="radio" checked={payment === "paystack"} onChange={() => setPayment("paystack")} />
                    </div>
                  </div>

                  <div
                    onClick={() => setPayment("etegram")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      payment === "etegram" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Etegram</h3>
                        <p className="text-sm text-muted-foreground">Fast checkout with Etegram</p>
                      </div>
                      <input type="radio" checked={payment === "etegram"} onChange={() => setPayment("etegram")} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep("address")} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={() => handlePayment(payment)} disabled={isLoading} className="flex-1">
                      {isLoading
                        ? "Processing..."
                        : `Pay ₦${total.toLocaleString()} with ${payment.charAt(0).toUpperCase() + payment.slice(1)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Summary */}
        <div className="bg-card p-6 rounded-lg border border-border h-fit sticky top-20">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
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
            <div className="flex justify-between font-bold border-t border-border pt-3">
              <span>Total</span>
              <span className="text-primary">₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
