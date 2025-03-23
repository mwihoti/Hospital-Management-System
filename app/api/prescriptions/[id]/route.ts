import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import Prescription from "@/models/Prescription"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const { id } = params
    const prescription = await Prescription.findById(id)
      .populate("patient", "name email")
      .populate("doctor", "name email specialization department")

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    if (
      session.user.role === "patient" && prescription.patient._id.toString() !== session.user.id ||
      session.user.role === "doctor" && prescription.doctor._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ prescription })
  } catch (error) {
    console.error("Get prescription error:", error)
    return NextResponse.json({ error: "Failed to get prescription" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const { id } = params
    const body = await request.json()
    const prescription = await Prescription.findById(id)

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    if (session.user.role === "doctor" && prescription.doctor.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (session.user.role === "doctor" || session.user.role === "admin") {
      Object.assign(prescription, body)
      await prescription.save()
      return NextResponse.json({ message: "Prescription updated successfully", prescription })
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  } catch (error) {
    console.error("Update prescription error:", error)
    return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectToDatabase()
    const { id } = params
    const prescription = await Prescription.findByIdAndDelete(id)

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Prescription deleted successfully" })
  } catch (error) {
    console.error("Delete prescription error:", error)
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 })
  }
}
