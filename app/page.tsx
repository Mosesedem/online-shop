"use client";

import Link from "next/link";
import Header from "@/components/header";
import HeroContent from "@/components/hero-content";
import ShaderBackground from "@/components/shader-background";
import Image from "next/image";
export default function HomePage() {
  return (
    <main>
      <ShaderBackground>
        <Header />
        <HeroContent />
      </ShaderBackground>
    </main>
  );
}
