"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    phone: "",
    isDefault: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses")
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const newAddress = await res.json()
        setAddresses((prev) => [...prev, newAddress])
        setFormData({
          name: "",
          street: "",
          city: "",
          state: "",
          country: "Nigeria",
          postalCode: "",
          phone: "",
          isDefault: false,
        })
        setIsAdding(false)
      }
    } catch (error) {
      console.error("Failed to add address:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete address:", error)
    }
  }

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Delivery Addresses</h2>
          <p className="text-muted-foreground">Manage your saved addresses</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      {/* Add Address Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <Input
                  placeholder="Street Address"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="md:col-span-2"
                  required
                />
                <Input placeholder="City" name="city" value={formData.city} onChange={handleChange} required />
                <Input placeholder="State" name="state" value={formData.state} onChange={handleChange} required />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
                <label htmlFor="isDefault" className="text-sm cursor-pointer">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Address
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Addresses List */}
      {addresses.length === 0 && !isAdding ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No addresses saved yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold">{address.name}</h3>
                    {address.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(address.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground space-y-1">
                  <div>{address.street}</div>
                  <div>
                    {address.city}, {address.state}
                  </div>
                  <div>{address.country}</div>
                  <div>{address.phone}</div>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
