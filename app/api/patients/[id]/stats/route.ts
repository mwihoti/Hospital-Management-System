import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import Appointment from "@/models/Appointment"
import Bill from "@/models/Bill"
import Prescription from "@/models/Prescription"
import MedicalRecord from "@/models/MedicalRecord"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const patientId = params.id

    // Connect to the database
    await connectToDatabase()

    // Get total appointments
    const totalAppointments = await Appointment.countDocuments({
      patientId: patientId,
    })

    // Get pending bills
    const pendingBills = await Bill.countDocuments({
      patientId: patientId,
      status: "pending",
    })

    // Get active prescriptions
    const activePrescriptions = await Prescription.countDocuments({
      patientId: patientId,
      status: "active",
    })

    // Get total medical records
    const totalMedicalRecords = await MedicalRecord.countDocuments({
      patientId: patientId,
    })

    return NextResponse.json({
      totalAppointments,
      pendingBills,
      activePrescriptions,
      totalMedicalRecords,
    })
  } catch (error) {
    console.error("Error fetching patient statistics:", error)
    return NextResponse.json({ error: "Failed to fetch patient statistics" }, { status: 500 })
  }
}

