import { NextResponse } from "next/server"
import { connectToDatabase, getAppointmentById } from "@/lib/db-utils"
import Appointment from "@/models/Appointment"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 })
    }

    const appointment = await getAppointmentById(id)

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error: any) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch appointment" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 })
    }

    const body = await request.json()

    // Find the appointment
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, { $set: body }, { new: true })
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization department")

    return NextResponse.json(updatedAppointment)
  } catch (error: any) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: error.message || "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 })
    }

    // Find the appointment
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(id)

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ error: error.message || "Failed to delete appointment" }, { status: 500 })
  }
}

