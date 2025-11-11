import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication (login only)
// Users must be logged in to access these routes
const AUTH_REQUIRED_ROUTES = ["/checkout", "/orders", "/profile"];

// Public routes - accessible to everyone after age gate
// Includes: /, /shop, /products, /cart, /wishlist, /saved-items, /auth

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

  // Check age gate acceptance (stored in cookie)
  // This is the only gate for browsing the site
  const ageGateAccepted = request.cookies.get("age-gate-accepted");

  if (
    !ageGateAccepted &&
    !pathname.startsWith("/age-gate") &&
    !pathname.startsWith("/auth")
  ) {
    const ageGateUrl = new URL("/age-gate", request.url);
    ageGateUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(ageGateUrl);
  }

  // Get session token for auth-required routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if route requires authentication
  const requiresAuth = AUTH_REQUIRED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if auth required and not authenticated
  if (requiresAuth && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
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
