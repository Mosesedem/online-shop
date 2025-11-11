import type React from "react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { NextAuthSessionProvider } from "@/components/session-provider";
import { CartProvider } from "@/components/cart-context";
import { CommerceHeader } from "@/components/commerce-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Toaster } from "sonner";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Online Shop",
  description: "Online store built for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${geistMono.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
}
        `}</style>
      </head>
      <body
        className={`${figtree.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      >
        <NextAuthSessionProvider>
          <CartProvider>
            <CommerceHeader />
            <div className="pb-16 md:pb-0">
              {children}
            </div>
            <MobileBottomNav />
            <Toaster position="top-center" richColors />
          </CartProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
