import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {


try {
    // verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
        return NextResponse.json({ error: "Authentication required"}, { status: 401})
    }
    const decoded = verifyToken(token)
    if (!decoded) {
        return NextResponse.json({ error: "Invalid token"}, {status: 401})
    }

    await connectToDatabase()

    const userId = params.id

    // only allow users to access their own data or admins to access any dataa
    if (decoded.userId !== userId && decoded.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized"}, { status: 403})
    }

    const user = await User.findById(userId)
    if (!user) {
        return NextResponse.json({ error: "user mot found"}, {status: 404})
    }
    return NextResponse.json({ user})
} catch (error: any) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: error.message || "Failed to get user"}, {status: 500})
}
}