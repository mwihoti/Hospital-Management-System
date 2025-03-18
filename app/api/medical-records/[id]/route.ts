import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import MedicalRecord from "@/models/MedicalRecord"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const recordId = params.id

    const record = await MedicalRecord.findById(recordId)
      .populate("patient", "name email")
      .populate("doctor", "name email specialization department")

    if (!record) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    // Role-based access control
    if (
      decoded.role === "patient" &&
      record.patient._id.toString() !== decoded.userId &&
      decoded.role === "doctor" &&
      record.doctor._id.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ record })
  } catch (error: any) {
    console.error("Get medical record error:", error)
    return NextResponse.json({ error: error.message || "Failed to get medical record" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    // Only doctors and admins can update medical records
    if (decoded.role !== "doctor" && decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Doctor or admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const recordId = params.id
    const body = await request.json()

    // Find the record
    const record = await MedicalRecord.findById(recordId)

    if (!record) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    // Doctors can only update their own records
    if (decoded.role === "doctor" && record.doctor.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Unauthorized. You can only update your own records" }, { status: 403 })
    }

    // Update fields
    if (body.type) record.type = body.type
    if (body.diagnosis) record.diagnosis = body.diagnosis
    if (body.notes) record.notes = body.notes
    if (body.department) record.department = body.department
    if (body.attachments) record.attachments = body.attachments
    if (body.date) record.date = new Date(body.date)

    // Save the updated record
    await record.save()

    return NextResponse.json({
      message: "Medical record updated successfully",
      record,
    })
  } catch (error: any) {
    console.error("Update medical record error:", error)
    return NextResponse.json({ error: error.message || "Failed to update medical record" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Only admins can delete medical records
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const recordId = params.id

    const record = await MedicalRecord.findByIdAndDelete(recordId)

    if (!record) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Medical record deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete medical record error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete medical record" }, { status: 500 })
  }
}

