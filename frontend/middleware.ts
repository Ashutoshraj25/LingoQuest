import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that require authentication for state-changing actions
const PROTECTED_ROUTES = [
  "/practice",
  "/lesson",
  "/achievements",
  "/leaderboard",
  "/profile",
  "/settings",
  "/statistics",
  "/shop",
  "/daily-goals",
  "/hearts"
];

// Pages accessible without authentication
const PUBLIC_AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-email"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Bypass middleware for Next.js build worker & internal static requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    request.headers.get("x-nextjs-data") ||
    request.headers.get("purpose") === "prefetch"
  ) {
    return NextResponse.next();
  }

  // Check for token cookie
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  
  const isAuthRoute = PUBLIC_AUTH_ROUTES.some(
    (route) => pathname.startsWith(route)
  );

  // Unauthenticated user attempting to access protected route -> redirect to login with returnUrl
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user attempting to access login/register -> redirect to root dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
