"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, MapPin, Heart, Bookmark, HelpCircle, LogOut } from "lucide-react"

export function ProfileSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  const menuItems = [
    { href: "/profile", icon: User, label: "Account Settings" },
    { href: "/profile/orders", icon: ShoppingBag, label: "My Orders" },
    { href: "/profile/addresses", icon: MapPin, label: "Addresses" },
    { href: "/wishlist", icon: Heart, label: "Wishlist" },
    { href: "/saved-items", icon: Bookmark, label: "Saved Items" },
    { href: "/profile/support", icon: HelpCircle, label: "Support" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="font-bold text-lg mb-2">{session?.user?.name || "User"}</h2>
        <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive(item.href) ? "default" : "ghost"} className="w-full justify-start gap-3">
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <Button
        variant="outline"
        className="w-full gap-2 text-destructive hover:text-destructive bg-transparent"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  )
}
