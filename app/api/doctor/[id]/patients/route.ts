import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import Appointment from "@/models/Appointment"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the doctor is accessing their own patients or if admin
    if (session.user.id !== params.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const doctorId = params.id

    // Get query parameters
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    // Connect to the database
    await connectToDatabase()

    // Get unique patient IDs from appointments
    const uniquePatientIds = await Appointment.distinct("patient", { doctor: doctorId })

    // Get patient details
    const patients = await User.find({
      _id: { $in: uniquePatientIds },
      role: "patient",
    })
      .select("-password")
      .limit(limit)

    return NextResponse.json({ patients })
  } catch (error) {
    console.error("Error fetching doctor's patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

