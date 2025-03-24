import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import MedicalRecord from "@/models/MedicalRecord"
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

    // Connect to the database
    await connectToDatabase()

    // Get query parameters
    const url = new URL(request.url)
    const patientId = url.searchParams.get("patient")
    const doctorId = url.searchParams.get("doctor")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    // Build query
    const query: any = {}

    if (patientId) {
      query.patient = new mongoose.Types.ObjectId(patientId)
    }

    if (doctorId) {
      query.doctor = new mongoose.Types.ObjectId(doctorId)
    }

    // If user is a patient, they can only see their own medical records
    if (session.user.role === "patient") {
      query.patient = new mongoose.Types.ObjectId(session.user.id)
    }

    // If user is a doctor, they can only see medical records they created
    if (session.user.role === "doctor" && !doctorId) {
      query.doctor = new mongoose.Types.ObjectId(session.user.id)
    }

    // Get medical records
    const records = await MedicalRecord.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ date: -1 })
      .limit(limit)

    return NextResponse.json({ records })
  } catch (error) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is a doctor or admin
    if (!session || (session.user.role !== "doctor" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to the database
    await connectToDatabase()

    // Get request body
    const body = await request.json()

    // Validate required fields
    if (!body.patient || !body.title || !body.description) {
      return NextResponse.json({ error: "Patient, title, and description are required" }, { status: 400 })
    }

    // Create medical record
    const newRecord = new MedicalRecord({
      ...body,
      doctor: session.user.role === "doctor" ? session.user.id : body.doctor,
      date: new Date(),
    })

    await newRecord.save()

    // Populate patient and doctor
    await newRecord.populate("patient", "name email")
    await newRecord.populate("doctor", "name email")

    return NextResponse.json({ record: newRecord }, { status: 201 })
  } catch (error) {
    console.error("Error creating medical record:", error)
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 })
  }
}

