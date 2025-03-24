import { NextResponse } from "next/server"
import { connectToDatabase, getMedicalRecordById } from "@/lib/db-utils"
import MedicalRecord from "@/models/MedicalRecord"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid medical record ID" }, { status: 400 })
    }

    const medicalRecord = await getMedicalRecordById(id)

    if (!medicalRecord) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    return NextResponse.json(medicalRecord)
  } catch (error: any) {
    console.error("Error fetching medical record:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch medical record" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid medical record ID" }, { status: 400 })
    }

    const body = await request.json()

    // Find the medical record
    const medicalRecord = await MedicalRecord.findById(id)

    if (!medicalRecord) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    // Update the medical record
    const updatedMedicalRecord = await MedicalRecord.findByIdAndUpdate(id, { $set: body }, { new: true })
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization")

    return NextResponse.json(updatedMedicalRecord)
  } catch (error: any) {
    console.error("Error updating medical record:", error)
    return NextResponse.json({ error: error.message || "Failed to update medical record" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid medical record ID" }, { status: 400 })
    }

    // Find the medical record
    const medicalRecord = await MedicalRecord.findById(id)

    if (!medicalRecord) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    // Delete the medical record
    await MedicalRecord.findByIdAndDelete(id)

    return NextResponse.json({ message: "Medical record deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting medical record:", error)
    return NextResponse.json({ error: error.message || "Failed to delete medical record" }, { status: 500 })
  }
}

