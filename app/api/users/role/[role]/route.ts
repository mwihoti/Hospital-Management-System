import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { role: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role } = params

    // Connect to the database
    await connectToDatabase()

    // Fetch users by role
    const users = await User.find({ role }).select("-password")

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users by role:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

