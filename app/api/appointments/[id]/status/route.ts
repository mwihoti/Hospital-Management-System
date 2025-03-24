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

    // Only doctors and admins can update appointment status
    if (session.user.role !== "doctor" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    // Get request body
    const body = await request.json()

    // Validate status
    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Check if status is valid
    const validStatuses = ["scheduled", "confirmed", "cancelled", "completed"]
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Use await to unwrap the params
    const appointmentId = params.id
    
    // Update appointment status
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: body.status },
      { new: true, runValidators: true },
    )
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization")

    if (!updatedAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ appointment: updatedAppointment })
  } catch (error: any) {
    console.error("Error updating appointment status:", error)
    return NextResponse.json({ error: error.message || "Failed to update appointment status" }, { status: 500 })
  }
}