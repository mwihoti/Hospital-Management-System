import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import Appointment from "@/models/Appointment"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctor")
    const patientId = searchParams.get("patient")
    const date = searchParams.get("date")
    //const status = searchParams.get("status")

    // Check if the user is the doctor, patient, or admin
    if (doctorId && session.user.id !== doctorId && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (patientId && session.user.id !== patientId && session.user.role !== "admin" && session.user.role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const query: any = {}

    // Add filters to query
    if (doctorId) {
      query.doctor = new mongoose.Types.ObjectId(doctorId)
    }

    if (patientId) {
      query.patient = new mongoose.Types.ObjectId(patientId)
    }

    //if (status) {
     // query.status = status
   // }

    if (date) {
      // Create date range for the entire day
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query.date = { $gte: startDate, $lte: endDate }
    }

    // If user is a patient, they can only see their own appointments
    if (session.user.role === "patient" && !patientId) {
      query.patient = new mongoose.Types.ObjectId(session.user.id)
    }

    // If user is a doctor, they can only see their own appointments
    if (session.user.role === "doctor" && !doctorId) {
      query.doctor = new mongoose.Types.ObjectId(session.user.id)
    }

    // Fetch appointments
    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name specialization department")
      .sort({ date: 1, time: 1 })

    return NextResponse.json({ appointments })
  } catch (error: any) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get request body
    const body = await request.json()

    // Validate required fields
    if (!body.patient || !body.date || !body.time || !body.department || !body.type) {
      return NextResponse.json({ error: "Patient, date, time, department, and type are required" }, { status: 400 })
    }

    // If doctor is not provided, assign a random doctor
    if (!body.doctor) {
      const User = mongoose.model("User")
      const doctors = await User.find({ role: "doctor" }).select("_id")

      if (doctors.length === 0) {
        return NextResponse.json({ error: "No doctors available in the system" }, { status: 400 })
      }

      // Assign a random doctor
      const randomIndex = Math.floor(Math.random() * doctors.length)
      body.doctor = doctors[randomIndex]._id
    }

    // Create appointment with valid status
    const newAppointment = new Appointment({
      ...body,
      //status: body.status || "scheduled", // Using "scheduled" instead of "pending"
      createdAt: new Date(),
    })

    await newAppointment.save()

    // Populate patient and doctor
    await newAppointment.populate("patient", "name email")
    await newAppointment.populate("doctor", "name specialization department")

    return NextResponse.json({ appointment: newAppointment }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: error.message || "Failed to create appointment" }, { status: 500 })
  }
}

