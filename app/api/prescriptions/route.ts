import { NextResponse } from "next/server"
import {connectToDatabase} from "@/lib/db-utils"
import Prescription from "@/models/Prescription"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
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
    const patientId = searchParams.get("patient")
    const doctorId = searchParams.get("doctor")

    // Build query based on user role and parameters
    const query: any = {}

    if (patientId) {
      query.patient = new mongoose.Types.ObjectId(patientId)
    }

    if (doctorId) {
      query.doctor = new mongoose.Types.ObjectId(doctorId)
    }

    // Access control based on user role
    if (session.user.role === "patient") {
      // Patients can only see their own prescriptions
      query.patient = new mongoose.Types.ObjectId(session.user.id)
    } else if (session.user.role === "doctor") {
      // Doctors can see prescriptions they wrote
      if (!patientId && !doctorId) {
        query.doctor = new mongoose.Types.ObjectId(session.user.id)
      }
    }

    // Fetch prescriptions
    const prescriptions = await Prescription.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .sort({ date: -1 })

    return NextResponse.json({ prescriptions })
  } catch (error: any) {
    console.error("Error fetching prescriptions:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch prescriptions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is a doctor or admin
    if (!session || (session.user.role !== "doctor" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get request body
    const body = await request.json()

    // Validate required fields
    if (!body.patient || !body.medications || body.medications.length === 0) {
      return NextResponse.json({ error: "Patient and at least one medication are required" }, { status: 400 })
    }

    // Validate medications
    const isValidMedications = body.medications.every((med: any) => med.name && med.dosage && med.frequency)

    if (!isValidMedications) {
      return NextResponse.json({ error: "All medications must have name, dosage, and frequency" }, { status: 400 })
    }

    // Create prescription
    const newPrescription = new Prescription({
      ...body,
      doctor: body.doctor || session.user.id, // Set the current doctor as the prescriber if not specified
      date: body.date || new Date(),
      createdAt: new Date(),
    })

    await newPrescription.save()

    // Populate patient and doctor
    await newPrescription.populate("patient", "name email")
    await newPrescription.populate("doctor", "name specialization")

    return NextResponse.json({ prescription: newPrescription }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating prescription:", error)
    return NextResponse.json({ error: error.message || "Failed to create prescription" }, { status: 500 })
  }
}

