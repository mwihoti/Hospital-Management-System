import { NextResponse } from "next/server"
import {connectToDatabase} from "@/lib/db-utils"
import Prescription from "@/models/Prescription"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"


export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    
    const session = await getServerSession(authOptions)
   
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // connect to database

    await connectToDatabase()
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patient")

    //build query based on user role and parameters
    let query = {}
    if (patientId) {
      // if a specific patient requested
      if (session.user.role === "patient" && patientId !== session.user.id) {
        // patients can only see their own prescriptions
        return NextResponse.json({ error: "Unauthorized"}, { status: 405})
      }
      query = { patient: patientId}
    } else if (session.user.role === "patient") {
      // patients can only see their own prescriptions
      query = { patient: session.user.id }
    } else if (session.user.role === "doctor") {
      // doctors can access prescriptions they created
      query = { doctor: session.user.id}
    }

    // admin can see all prescriptions if no filters are applied


      const prescriptions = await Prescription.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name email specialization department")
      .populate("medications")
      
    return NextResponse.json({ prescriptions })
  } catch (error: any) {
    console.error("Get prescription error:", error)
    return NextResponse.json({ error: error.message || "Failed to get prescription" }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    
    await connectToDatabase()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.patient || !body.medications || !body.medications.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Create new prescription with the doctor set to the current user
    const prescription = new Prescription({
      ...body,
      doctor: session.user.id,
      date: new Date(),
      status: body.status || "active"
    })
    
    await prescription.save()
    
    return NextResponse.json(
      { message: "Prescription created successfully", prescription },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create prescription error:", error)
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const session = getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized"}, { status: 403})
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
    if (session.role === "doctor") {
      // Doctors can only update their own prescriptions
      if (prescription.doctor.toString() !== session.userId) {
        return NextResponse.json({ error: "Unauthorized. You can only update your own prescriptions" }, { status: 403 })
      }

      // Doctors can update all fields
      if (body.medications) prescription.medications = body.medications
      if (body.notes) prescription.notes = body.notes
      if (body.status) prescription.status = body.status
      if (body.refillsRemaining !== undefined) prescription.refillsRemaining = body.refillsRemaining
    } else if (session.role === "admin") {
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
    const session = getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized"}, {status: 401})
    }

    // Only admins can delete prescriptions
    if (session.role !== "admin") {
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

