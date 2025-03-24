import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import User from "@/models/User"

export async function GET(request: NextRequest, { params }: { params: { role: string } }) {
  try {
    await connectToDatabase()
    const { role } = params

    // Validate role
    if (!["admin", "doctor", "patient"].includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 })
    }

    // Find users by role
    const users = await User.find({ role }).select("-password")

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users by role:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

