import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import Appointment from "@/models/Appointment"
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

    // Count total patients (unique patients who have appointments with this doctor)
    const uniquePatients = await Appointment.distinct("patientId", { doctorId: id })
    const totalPatients = uniquePatients.length

    // Count total appointments
    const totalAppointments = await Appointment.countDocuments({
      doctorId: id,
    })

    // Count upcoming appointments
    const upcomingAppointments = await Appointment.countDocuments({
      doctorId: id,
      date: { $gte: currentDate },
      status: { $ne: "cancelled" },
    })

    // Count completed appointments
    const completedAppointments = await Appointment.countDocuments({
      doctorId: id,
      status: "completed",
    })

    return NextResponse.json({
      totalPatients,
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
    })
  } catch (error) {
    console.error("Error fetching doctor dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

