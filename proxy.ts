/**
 * Next.js Middleware
 * Route protection for age-verified content
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require age verification
const VERIFIED_REQUIRED_ROUTES = [
  "/shop",
  "/products",
  "/cart",
  "/checkout",
  "/orders",
  "/wishlist",
  "/saved-items",
];

// Routes that require authentication but not verification
const AUTH_REQUIRED_ROUTES = ["/profile", "/verify"];

// Public routes (age gate required)
const PUBLIC_ROUTES = ["/", "/auth", "/api/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if route requires verification
  const requiresVerification = VERIFIED_REQUIRED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const requiresAuth = AUTH_REQUIRED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if auth required and not authenticated
  if ((requiresVerification || requiresAuth) && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check verification status
  if (requiresVerification && token) {
    // @ts-ignore - isVerified is added to token in auth config
    const isVerified = token.isVerified as boolean;

    if (!isVerified) {
      const verifyUrl = new URL("/verify", request.url);
      verifyUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(verifyUrl);
    }
  }

  // Check age gate acceptance (stored in cookie)
  const ageGateAccepted = request.cookies.get("age-gate-accepted");

  if (!ageGateAccepted && !pathname.startsWith("/age-gate")) {
    const ageGateUrl = new URL("/age-gate", request.url);
    ageGateUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(ageGateUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
