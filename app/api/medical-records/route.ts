import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import mongoose from "mongoose"

// Define a schema for medical records if it doesn't exist
let MedicalRecord
try {
  MedicalRecord = mongoose.model("MedicalRecord")
} catch {
  const MedicalRecordSchema = new mongoose.Schema({
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
     
    department: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    notes: String,
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })

  MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema)
}

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
      // Patients can only see their own records
      query.patient = new mongoose.Types.ObjectId(session.user.id)
    } else if (session.user.role === "doctor") {
      // Doctors can see records of patients they treated
      if (!patientId && !doctorId) {
        query.doctor = new mongoose.Types.ObjectId(session.user.id)
      }
    }

    // Fetch records
    const records = await MedicalRecord.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .sort({ date: -1 })

    return NextResponse.json({ records })
  } catch (error: any) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch medical records" }, { status: 500 })
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
    if (!body.patient || !body.diagnosis || !body.treatment) {
      return NextResponse.json({ error: "Patient, diagnosis, and treatment are required" }, { status: 400 })
    }

    // Create medical record
    const newRecord = new MedicalRecord({
      ...body,
      doctor: session.user.id, // Set the current doctor as the creator
      date: body.date || new Date(),
      createdAt: new Date(),
    })

    await newRecord.save()

    // Populate patient and doctor
    await newRecord.populate("patient", "name email")
    await newRecord.populate("doctor", "name specialization")

    return NextResponse.json({ record: newRecord }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating medical record:", error)
    return NextResponse.json({ error: error.message || "Failed to create medical record" }, { status: 500 })
  }
}

