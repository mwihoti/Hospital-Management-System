import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Paths that require authentication
const protectedPaths = ["/admin", "/staff", "/patient"]

// Paths that are accessible without authentication
const publicPaths = ["/", "/auth/login", "/auth/register", "/api/auth"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtectedPath) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // If no token, redirect to login
    if (!token) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    // Check role-based access
    if (pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (pathname.startsWith("/staff") && token.role !== "doctor") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (pathname.startsWith("/patient") && token.role !== "patient") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (static assets)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}

