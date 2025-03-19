import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Prescription from "@/models/Prescription"
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

    const prescriptionId = params.id

    const prescription = await Prescription.findById(prescriptionId)
      .populate("patient", "name email")
      .populate("doctor", "name email specialization department")

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    // Role-based access control
    if (
      decoded.role === "patient" &&
      prescription.patient._id.toString() !== decoded.userId &&
      decoded.role === "doctor" &&
      prescription.doctor._id.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ prescription })
  } catch (error: any) {
    console.error("Get prescription error:", error)
    return NextResponse.json({ error: error.message || "Failed to get prescription" }, { status: 500 })
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

    await connectToDatabase()

    const prescriptionId = params.id
    const body = await request.json()

    // Find the prescription
    const prescription = await Prescription.findById(prescriptionId)

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    // Role-based access control
    if (decoded.role === "doctor") {
      // Doctors can only update their own prescriptions
      if (prescription.doctor.toString() !== decoded.userId) {
        return NextResponse.json({ error: "Unauthorized. You can only update your own prescriptions" }, { status: 403 })
      }

      // Doctors can update all fields
      if (body.medications) prescription.medications = body.medications
      if (body.notes) prescription.notes = body.notes
      if (body.status) prescription.status = body.status
      if (body.refillsRemaining !== undefined) prescription.refillsRemaining = body.refillsRemaining
    } else if (decoded.role === "admin") {
      // Admins can update all fields
      if (body.medications) prescription.medications = body.medications
      if (body.notes) prescription.notes = body.notes
      if (body.status) prescription.status = body.status
      if (body.refillsRemaining !== undefined) prescription.refillsRemaining = body.refillsRemaining
    } else {
      // Patients cannot update prescriptions
      return NextResponse.json({ error: "Unauthorized. Patients cannot update prescriptions" }, { status: 403 })
    }

    // Save the updated prescription
    await prescription.save()

    return NextResponse.json({
      message: "Prescription updated successfully",
      prescription,
    })
  } catch (error: any) {
    console.error("Update prescription error:", error)
    return NextResponse.json({ error: error.message || "Failed to update prescription" }, { status: 500 })
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

    // Only admins can delete prescriptions
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const prescriptionId = params.id

    const prescription = await Prescription.findByIdAndDelete(prescriptionId)

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Prescription deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete prescription error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete prescription" }, { status: 500 })
  }
}

