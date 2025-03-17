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
        return NextResponse.json({ error: "user not found"}, {status: 404})
    }
    return NextResponse.json({ user})
} catch (error: any) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: error.message || "Failed to get user"}, {status: 500})
}
}

export async function PUT(request: Request, { params }: { params: { id: string}}) {
    try {
        // Verify authentication
        const token = request.headers.get("Authorization")?.split(" ")[1]
        if (!token) {
            return NextResponse.json({error: "Authentication required"}, { status: 401})
        }
        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token"}, { status: 401})
        }
        await connectToDatabase()
        
        const userId = params.id
        // only allow users to update their own data or admins to update any data
        if (decoded.userId !== userId && decoded.role !== "admin") {
            return NextResponse.json({ error: "unauthorized"}, {status: 403})
        }

        const body = await request.json()

        // Don't allow role change through this endpoint
        delete body.role

        //Don't allow password updates through this endpoint
        delete body.password

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: body}, { new: true, runValidators: true})

        if (!updatedUser) {
            return NextResponse.json({error: "User not found"}, { status: 404})
        }

        return NextResponse.json({
            message: "User updated successfully",
            user: updatedUser,
        })
    } catch (error: any) {
        console.error("Update user error.", error)
        return NextResponse.json({ error: error.message || "Failed to update user"}, { status: 500})
    }
}