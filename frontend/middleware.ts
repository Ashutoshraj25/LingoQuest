import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth pages that authenticated users should not visit
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

  const isAuthRoute = PUBLIC_AUTH_ROUTES.some(
    (route) => pathname.startsWith(route)
  );

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
