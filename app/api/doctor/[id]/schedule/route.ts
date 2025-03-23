import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
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

    const doctorId = params.id

    // Connect to the database
    await connectToDatabase()

    // Get doctor's schedule
    const doctor = await User.findById(doctorId).select("schedule")

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({ schedule: doctor.schedule || [] })
  } catch (error) {
    console.error("Error fetching doctor schedule:", error)
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the doctor is updating their own schedule or if admin
    if (session.user.id !== params.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const doctorId = params.id
    const { schedule } = await request.json()

    // Connect to the database
    await connectToDatabase()

    // Update doctor's schedule
    const updatedDoctor = await User.findByIdAndUpdate(doctorId, { $set: { schedule } }, { new: true }).select(
      "schedule",
    )

    if (!updatedDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({ schedule: updatedDoctor.schedule })
  } catch (error) {
    console.error("Error updating doctor schedule:", error)
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 })
  }
}

