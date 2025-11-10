import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Security headers for adult content compliance */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // HTTPS-only enforcement
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://vercel.live https://*.vercel.app https://*.veriff.com https://withpersona.com https://api.yoti.com",
              "frame-src https://*.veriff.com https://withpersona.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // XSS Protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer policy for privacy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions policy
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },

  /* Image optimization for product images */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com", // S3 buckets
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net", // CloudFront CDN
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  /* Disable x-powered-by header */
  poweredByHeader: false,

  /* Production optimizations */
  compress: true,

  /* Experimental features */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
