import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isAuthPage = nextUrl.pathname.startsWith("/auth")
    const isLandingPage = nextUrl.pathname === "/" || nextUrl.pathname === "/landing"
    const isApiRoute = nextUrl.pathname.startsWith("/api")

    // Allow API routes to pass through
    if (isApiRoute) {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages and landing page
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
        
        if (isDashboardPage) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}