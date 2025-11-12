"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
  LogOut,
  FolderTree,
  Star,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  const menuItems = [
    { href: "/admin", icon: LayoutGrid, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/categories", icon: FolderTree, label: "Categories" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/reviews", icon: Star, label: "Reviews" },
    { href: "/admin/payments", icon: CreditCard, label: "Payments" },
    { href: "/admin/verifications", icon: CheckCircle, label: "Verifications" },
  ];

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-deep-oxblood">Admin Panel</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full gap-2 bg-transparent"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
