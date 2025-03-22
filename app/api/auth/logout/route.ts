import { NextResponse } from "next/server"
import { removeTokenCookie } from "@/lib/auth"

export async function POST() {
    try {
        // Remove the token cookie
        removeTokenCookie()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ error: "Internal server error"}, { status: 500})
    }
    
}