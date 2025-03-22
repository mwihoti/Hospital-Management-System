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

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Connect to the database
    await connectToDatabase()

    // Get current date
    const currentDate = new Date()

    // Count upcoming appointments
    const upcomingAppointments = await Appointment.countDocuments({
      patientId: id,
      date: { $gte: currentDate },
      status: { $ne: "cancelled" },
    })

    // Count pending bills
    const pendingBills = await Bill.countDocuments({
      patientId: id,
      status: "pending",
    })

    // Count active prescriptions
    const activePrescriptions = await Prescription.countDocuments({
      patientId: id,
      endDate: { $gte: currentDate },
    })

    // Count total medical records
    const totalMedicalRecords = await MedicalRecord.countDocuments({
      patientId: id,
    })

    return NextResponse.json({
      upcomingAppointments,
      pendingBills,
      activePrescriptions,
      totalMedicalRecords,
    })
  } catch (error) {
    console.error("Error fetching patient dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

