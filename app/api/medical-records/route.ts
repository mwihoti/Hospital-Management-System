import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import MedicalRecord from "@/models/MedicalRecord"
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
    const type = url.searchParams.get("type")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")

    // Build query
    const query: any = {}

    // Role-based access control
    if (decoded.role === "patient") {
      // Patients can only see their own records
      query.patient = decoded.userId
    } else if (decoded.role === "doctor") {
      // Doctors can see records of their patients or records they created
      if (patientId) {
        query.patient = patientId
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

    // Filter by type if provided
    if (type) {
      query.type = type
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get medical records
    const records = await MedicalRecord.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name email specialization department")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 })

    // Get total count
    const totalRecords = await MedicalRecord.countDocuments(query)

    return NextResponse.json({
      records,
      pagination: {
        total: totalRecords,
        page,
        limit,
        pages: Math.ceil(totalRecords / limit),
      },
    })
  } catch (error: any) {
    console.error("Get medical records error:", error)
    return NextResponse.json({ error: error.message || "Failed to get medical records" }, { status: 500 })
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

    // Only doctors and admins can create medical records
    if (decoded.role !== "doctor" && decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Doctor or admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const body = await request.json()
    const { patient, doctor, date, type, diagnosis, notes, department, attachments } = body

    // Validate required fields
    if (!patient || !doctor || !type || !diagnosis || !notes || !department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify that the doctor exists and is a doctor
    const doctorUser = await User.findById(doctor)
    if (!doctorUser || doctorUser.role !== "doctor") {
      return NextResponse.json({ error: "Invalid doctor" }, { status: 400 })
    }

    // Verify that the patient exists
    const patientUser = await User.findById(patient)
    if (!patientUser) {
      return NextResponse.json({ error: "Invalid patient" }, { status: 400 })
    }

    // Create medical record
    const medicalRecord = await MedicalRecord.create({
      patient,
      doctor,
      date: date ? new Date(date) : new Date(),
      type,
      diagnosis,
      notes,
      department,
      attachments: attachments || [],
    })

    return NextResponse.json({ message: "Medical record created successfully", record: medicalRecord }, { status: 201 })
  } catch (error: any) {
    console.error("Create medical record error:", error)
    return NextResponse.json({ error: error.message || "Failed to create medical record" }, { status: 500 })
  }
}

