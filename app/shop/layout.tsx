import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Shop",
  description: "Online store built for you.",
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
