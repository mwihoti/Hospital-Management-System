import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import User from "@/models/User"
import Appointment from "@/models/Appointment"
import Bill from "@/models/Bill"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to the database
    await connectToDatabase()

    // Count total patients
    const totalPatients = await User.countDocuments({ role: "patient" })

    // Count total doctors
    const totalDoctors = await User.countDocuments({ role: "doctor" })

    // Count total appointments
    const totalAppointments = await Appointment.countDocuments()

    // Calculate total revenue from paid bills
    const paidBills = await Bill.find({ status: "paid" })
    const totalRevenue = paidBills.reduce((sum, bill) => sum + (bill.amount || 0), 0)

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

