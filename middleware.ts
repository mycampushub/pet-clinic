import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isAuthPage = nextUrl.pathname.startsWith("/auth") || nextUrl.pathname === "/login"
    const isLandingPage = nextUrl.pathname === "/" || nextUrl.pathname === "/landing"
    const isApiRoute = nextUrl.pathname.startsWith("/api")

    // Allow API routes to pass through
    if (isApiRoute) {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages and landing page to dashboard
    if ((isAuthPage || isLandingPage) && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { nextUrl } = req
        const isDashboardPage = nextUrl.pathname.startsWith("/dashboard")
        const isAuthPage = nextUrl.pathname.startsWith("/auth") || nextUrl.pathname === "/login"
        const isLandingPage = nextUrl.pathname === "/" || nextUrl.pathname === "/landing"
        
        // For dashboard pages, user must be authenticated
        if (isDashboardPage) {
          return !!token
        }
        
        // For auth and landing pages, always allow access
        if (isAuthPage || isLandingPage) {
          return true
        }
        
        // For other pages, user must be authenticated
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}