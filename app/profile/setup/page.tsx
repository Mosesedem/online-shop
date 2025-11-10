"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfileSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password: password || undefined }),
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Add your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            {success && (
              <div className="bg-success/10 text-success text-sm p-3 rounded-md">Profile updated! Redirecting...</div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={session?.user?.email || ""} disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input type="text" value={session?.user?.name || ""} disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input type="tel" placeholder="+234 (0)..." value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Set Password</label>
              <p className="text-xs text-muted-foreground">
                {session?.user ? "Optional - Update your password" : "Your temporary password was sent to your email"}
              </p>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Continue to Shopping"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
