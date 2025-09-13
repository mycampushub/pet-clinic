import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { UserRole } from "@prisma/client"

export async function middleware(request: Request) {
  const token = await getToken({ req: request })
  const { pathname } = new URL(request.url)

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/api/health"]
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )

  // If it's a public route, continue
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based route protection
  const roleBasedRoutes: Record<string, UserRole[]> = {
    "/admin": [UserRole.ADMIN],
    "/tenant-admin": [UserRole.ADMIN, UserRole.CLINIC_ADMIN],
    "/veterinarian": [UserRole.VETERINARIAN, UserRole.ADMIN],
    "/clinic-admin": [UserRole.CLINIC_ADMIN, UserRole.ADMIN],
    "/reception": [UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.CLINIC_ADMIN],
    "/pharmacy": [UserRole.PHARMACIST, UserRole.ADMIN, UserRole.CLINIC_ADMIN],
    "/owner": [UserRole.OWNER]
  }

  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route)) {
      const userRole = token.role as UserRole
      
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }
  }

  // Dashboard access for all authenticated users
  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

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