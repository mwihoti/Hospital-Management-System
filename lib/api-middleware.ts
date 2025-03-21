import { NextRequest, NextResponse } from "next/server"
import { verifyJwtToken } from "./auth"

// Define the handler type
type ApiHandler = (req: NextRequest, context: { params: Record<string, string>}) => Promise<NextResponse>

// Define the middleware options
interface MiddlewareOptions {
    allowedRoles?: string[]
}

// create a middleware to protect api router
export function withAuth(handler: ApiHandler, options: MiddlewareOptions = {}) {
    return async  (req: NextRequest, context: { params: Record<string, string>}) => {
        try {
            // get token from the cookies
            const token = req.cookies.get("token")?.value

            // if no token return unauthorized
            if (!token) {
                return NextResponse.json({ error: "Not authenticated"}, { status: 401})
            }

            // verify token
            const decodedToken = await verifyJwtToken(token)

            // Check if the user has the required role
            if (options.allowedRoles && !options.allowedRoles.includes(decodedToken.role)) {
                return NextResponse.json({ error: "Not authorized"}, {status: 403})
            }

            // Add the ser info to the request headers

            const requestHeaders = new Headers(req.headers)
            requestHeaders.set("x-user-id", decodedToken.userId)
            requestHeaders.set("x-user-role", decodedToken.role)

            // Create a new request with the modified
            const newRequesst = new NextRequest(req.url, {
                headers: requestHeaders,
                method: req.method,
                body: req.body,
                cache: req.cache,
                credentials: req.credentials,
                integrity: req.integrity,
                keepalive: req.keepalive,
                mode: req.mode,
                redirect: req.redirect,
                referrer: req.referrer,
                referrerPolicy: req.referrerPolicy,
                signal: req.signal
            })
            // call the handler with modified request
            return handler(newRequesst, context)

        } catch (error) {
            console.error("API middleware error:", error)
            return NextResponse.json({ error: "Not authenticated"}, { status: 401})
        }
    }
}