import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Prescription from "@/models/Prescription"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await connectToDatabase()

    // Get query parameters
    const url = new URL(request.url)
    const patientId = url.searchParams.get("patient")
    const doctorId = url.searchParams.get("doctor")
    const status = url.searchParams.get("status")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")

    // Build query
    const query: any = {}

    // Role-based access control
    if (decoded.role === "patient") {
      // Patients can only see their own prescriptions
      query.patient = decoded.userId
    } else if (decoded.role === "doctor") {
      // Doctors can see prescriptions they wrote or filter by patient
      if (patientId) {
        query.patient = patientId
        query.doctor = decoded.userId
      } else {
        query.doctor = decoded.userId
      }
    } else if (decoded.role === "admin") {
      // Admins can filter by patient or doctor
      if (patientId) {
        query.patient = patientId
      }

      if (doctorId) {
        query.doctor = doctorId
      }
    }

    // Filter by status if provided
    if (status) {
      query.status = status
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get prescriptions
    const prescriptions = await Prescription.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name email specialization department")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 })

    // Get total count
    const totalPrescriptions = await Prescription.countDocuments(query)

    return NextResponse.json({
      prescriptions,
      pagination: {
        total: totalPrescriptions,
        page,
        limit,
        pages: Math.ceil(totalPrescriptions / limit),
      },
    })
  } catch (error: any) {
    console.error("Get prescriptions error:", error)
    return NextResponse.json({ error: error.message || "Failed to get prescriptions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Only doctors can create prescriptions
    if (decoded.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized. Doctor access required" }, { status: 403 })
    }

    await connectToDatabase()

    const body = await request.json()
    const { patient, medications, notes, refillsRemaining } = body

    // Validate required fields
    if (!patient || !medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify that the patient exists
    const patientUser = await User.findById(patient)
    if (!patientUser) {
      return NextResponse.json({ error: "Invalid patient" }, { status: 400 })
    }

    // Create prescription
    const prescription = await Prescription.create({
      patient,
      doctor: decoded.userId, // Use the authenticated doctor's ID
      date: new Date(),
      medications,
      notes,
      status: "Active",
      refillsRemaining: refillsRemaining || 0,
    })

    return NextResponse.json({ message: "Prescription created successfully", prescription }, { status: 201 })
  } catch (error: any) {
    console.error("Create prescription error:", error)
    return NextResponse.json({ error: error.message || "Failed to create prescription" }, { status: 500 })
  }
}

