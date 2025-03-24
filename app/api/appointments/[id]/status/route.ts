import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import Appointment from "@/models/Appointment"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to the database
    await connectToDatabase()

    // Get appointment
    const appointment = await Appointment.findById(params.id)

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Check permissions
    // Admin can update any appointment
    // Doctor can update their own appointments
    // Patient can cancel their own appointments
    if (
      session.user.role !== "admin" &&
      session.user.role === "doctor" &&
      session.user.id !== appointment.doctor.toString() &&
      session.user.role === "patient" &&
      session.user.id !== appointment.patient.toString()
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get request body
    const body = await request.json()

    // Validate status
    const validStatuses = ["scheduled", "completed", "cancelled"]
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Patients can only cancel appointments
    if (session.user.role === "patient" && body.status !== "cancelled") {
      return NextResponse.json({ error: "Patients can only cancel appointments" }, { status: 403 })
    }

    // Update appointment
    appointment.status = body.status
    await appointment.save()

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error("Error updating appointment status:", error)
    return NextResponse.json({ error: "Failed to update appointment status" }, { status: 500 })
  }
}

