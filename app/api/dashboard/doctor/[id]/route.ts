import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import Appointment from "@/models/Appointment"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import mongoose from "mongoose"
import User from "@/models/User"

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Access the ID directly without destructuring
    const id = params.id
    
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the doctor is accessing their own stats or if admin
    if (session.user.id !== id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Connect to the database
    await connectToDatabase()

    const doctorId = new mongoose.Types.ObjectId(params.id)

    // Get today's date (start and end)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get total patients count (unique patients who have appointments with this doctor)
    const totalPatientsResult = await Appointment.aggregate([
      { $match: { doctor: doctorId } },
      { $group: { _id: "$patient" } },
      { $count: "total" },
    ])

    const totalPatients = totalPatientsResult.length > 0 ? totalPatientsResult[0].total : 0

    // Get total appointments count
    const totalAppointments = await Appointment.countDocuments({ doctor: doctorId })

    // Get upcoming appointments count (scheduled appointments with date >= today)
    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "scheduled",
      date: { $gte: today },
    })

    // Get completed appointments count
    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "completed",
    })

    // Get today's appointments count
    const todayAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      date: { $gte: today, $lt: tomorrow },
    })

    // Get recent patients (last 5 unique patients)
    const recentPatientsIds = await Appointment.aggregate([
      { $match: { doctor: doctorId } },
      { $sort: { date: -1 } },
      { $group: { _id: "$patient", lastVisit: { $first: "$date" } } },
      { $limit: 5 },
    ])

    const patientIds = recentPatientsIds.map((p) => p._id)

    const recentPatients = await User.find({
      _id: { $in: patientIds },
    }).select("name email")

    // Add lastVisit to each patient
    const recentPatientsWithVisit = recentPatients.map((patient) => {
      const patientWithVisit = patient.toObject()
      const matchingPatient = recentPatientsIds.find((p) => p._id.toString() === patient._id.toString())
      patientWithVisit.lastVisit = matchingPatient ? matchingPatient.lastVisit : null
      return patientWithVisit
    })

    return NextResponse.json({
      totalPatients,
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      todayAppointments,
      recentPatients: recentPatientsWithVisit,
    })
  } catch (error) {
    console.error("Error fetching doctor dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}