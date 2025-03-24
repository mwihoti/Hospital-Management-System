import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import mongoose from "mongoose"

// Get Appointment model
let Appointment
try {
  Appointment = mongoose.model("Appointment")
} catch {
  const AppointmentSchema = new mongoose.Schema({
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled", "completed"],
      default: "scheduled",
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })

  Appointment = mongoose.model("Appointment", AppointmentSchema)
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get appointment
    const appointment = await Appointment.findById(params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization")

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Access control based on user role
    if (session.user.role === "patient" && appointment.patient._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (session.user.role === "doctor" && appointment.doctor && appointment.doctor._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ appointment })
  } catch (error: any) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch appointment" }, { status: 500 })
  }
}

