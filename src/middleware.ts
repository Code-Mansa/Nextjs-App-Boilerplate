// middleware.ts (at project root, next to app/ and pages/)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/profile",
  "/settings",
  // Add all your protected routes here
] as const;

const AUTH_PATHS = new Set(["/login", "/register"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  const isAuthPath = AUTH_PATHS.has(pathname);

  // Case 1: Trying to access protected route without cookie → redirect to login
  if (isProtectedPath && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Already logged in (has cookie) but visiting login/register → redirect to dashboard
  if (isAuthPath && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 3: Everything else → allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
