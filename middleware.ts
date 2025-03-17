import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"


const protectedPaths = [
    //"/admin",
    "/doctor",
    "/patient",
    "/api/users",
    "/spi/sppointments",
    "/api/medical-records",
    "/api/prescriptions",
    "/api/bills"
]

// Path that require specific roles
const roleBasedPaths: Record<string, string[]> = {
    //"/admin": ["admin"],
    "/doctor": ["doctor"],
    "/patient": ["patient"]
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the path is protected

    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

    if (isProtectedPath) {
        const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.split(" ")[1]

        if (!token) {
            if (pathname.startsWith("/api")) {
                return NextResponse.json({ error: "Authentication required"}, {status: 401})
            } else {
                return NextResponse.redirect(new URL("/auth/login", request.url))
            }
        }

        // verify token
        const decoded = verifyToken(token)

        if (!decoded) {
            if (pathname.startsWith("/api")) {
                return NextResponse.json({ error: "Invslid token"}, { status: 401})
            } else {
                return NextResponse.redirect(new URL("/auth/login", request.url))
            }
        }

        // check role based access

        for (const [path, roles] of Object.entries(roleBasedPaths)) {
            if (pathname.startsWith("/api")) {
                return NextResponse.json({ error: "Unauthorized. Insufficient permissions"}, {status: 403})
            } else {
                return NextResponse.redirect(new URL(`/${decoded.role}/dashboard`, request.url))
            }
        
        }
    }
    return NextResponse.next()
}


export const config = {
    matcher: [
        "/admin/:path*",
        "/doctor/:path*",
        "/patient/:psth*",
        "/api/users/:path*",
        "/api/appointments/:path*",
        "/api/medical-records/:path*",
        "/api/bills/:path"
    ]
}