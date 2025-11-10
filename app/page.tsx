"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-linear-to-r from-primary/10 via-primary-light/20 to-primary-dark/10 overflow-hidden">
        <div className="container-max text-center space-y-8 z-10">
          <h1 className="text-5xl md:text-6xl font-bold">Fashion Redefined</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of premium adult wear for men and women,
            plus elegant accessories
          </p>
          <Link href="/shop">
            <Button size="lg" className="gap-2">
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="container-max py-16">
        <h2 className="text-3xl font-bold mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Men's Wear", link: "/shop?category=mens" },
            { name: "Women's Wear", link: "/shop?category=womens" },
            { name: "Accessories", link: "/shop?category=accessories" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={cat.link}
              className="group relative h-64 rounded-lg overflow-hidden bg-muted flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary-dark/20 group-hover:from-primary/40 group-hover:to-primary-dark/40 transition-colors" />
              <h3 className="text-2xl font-bold relative z-10">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
