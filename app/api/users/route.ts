import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const token = request.headers.get("Authorization")?.split(" ")[1]
        if (!token) {
            return NextResponse.json({error: "Authentication required"}, {status: 401})
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({error: "Invalid token"}, {status: 401})
        }

        // only admins can access all users

        if (decoded.role !== "admin") {
            return NextResponse.json({error: "Unauthorized.Admin access required"}, {status: 403})
        }
        await connectToDatabase()

        // Get query parameter
        const url = new URL(request.url)
        const role = url.searchParams.get("role")
        const limit = Number.parseInt(url.searchParams.get("limit") || "10")
        const page = Number.parseInt(url.searchParams.get("page") || "1")

        // Build query
        const query: any = {}
        if (role && ["admin", "doctor", "patient"].includes(role)) {
            query.role = role
        }

        // calculate pagination
        const skip = (page - 1) * limit

        // get users
        const users = await User.find(query).skip(skip).limit(limit).sort({ createdAt: -1})

        // Get total count
        const totalUsers = await User.countDocuments(query)

        return NextResponse.json({
            users,
            pagination: {
                total: totalUsers,
                page,
                limit,
                pages: Math.ceil(totalUsers / limit),
            },
        })
    } catch (error: any) {
        console.error("Get users error:", error)
        return NextResponse.json({error: error.message || "Failed to get users"}, {status: 500})
    }
}