"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/components/cart-context";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function CommerceHeader() {
  const pathname = usePathname();
  const { items } = useCartContext();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/faqs", label: "FAQs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-deep-oxblood rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🍆</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">
              Wellness Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-deep-oxblood",
                  pathname === link.href
                    ? "text-deep-oxblood"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search - Desktop only */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              asChild
            >
              <Link href="/shop">
                <Search className="w-5 h-5" />
              </Link>
            </Button>

            {/* Saved Items */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/saved-items">
                <Heart className="w-5 h-5" />
              </Link>
            </Button>

            {/* Cart with Badge */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-deep-oxblood text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* User Account */}
            <Button variant="ghost" size="icon" asChild>
              <Link href={session ? "/profile" : "/auth/login"}>
                <User className="w-5 h-5" />
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-deep-oxblood px-2 py-1",
                    pathname === link.href
                      ? "text-deep-oxblood"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-deep-oxblood px-2 py-1 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search Products
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
