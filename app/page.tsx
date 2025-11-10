"use client";

import Link from "next/link";
import Header from "@/components/header";
import HeroContent from "@/components/hero-content";
import ShaderBackground from "@/components/shader-background";

export default function HomePage() {
  return (
    <main>
      <ShaderBackground>
        <Header />
        <HeroContent />
      </ShaderBackground>

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
