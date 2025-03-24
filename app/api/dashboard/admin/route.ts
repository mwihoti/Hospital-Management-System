import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import User from "@/models/User"
import Appointment from "@/models/Appointment"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to the database
    await connectToDatabase()

    // Get total patients
    const totalPatients = await User.countDocuments({ role: "patient" })

    // Get total doctors
    const totalDoctors = await User.countDocuments({ role: "doctor" })

    // Get total appointments
    const totalAppointments = await Appointment.countDocuments()

    // Calculate total revenue (this is a placeholder, real implementation would depend on your billing model)
    // For this example, we'll assume each completed appointment generates $100 revenue
    const completedAppointments = await Appointment.countDocuments({ status: "completed" })
    const totalRevenue = completedAppointments * 100

    return NextResponse.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue,
    })
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

