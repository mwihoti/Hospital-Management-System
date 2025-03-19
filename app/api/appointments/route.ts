import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import { getAppointments, getUserAppointments } from "@/lib/db-utils"




export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const role = searchParams.get("role")

        let appointments

        if (userId && role) {
            appointments = await getUserAppointments(userId, role)
        } else {
            appointments = await getAppointments()
        }
        return NextResponse.json(appointments)
    } catch (error: any) {
        console.error("Error fetching appointments:", error)
        return NextResponse.json({ error: error.message || "Failed to fetch appointments"}, { status: 500})
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase()

        const body = await request.json()
        const { patientId, doctorId, date, time, status, reason } = body

        // validate required fields
        if (!patientId || !doctorId || !date || !time) {
            return NextResponse.json({ error: "Missing required fields"}, { status: 400})
        }

        // Create new appointment
        const appointment = await Appointment.create({
            patientId,
            doctorId,
            date,
            time,
            status: status || "scheduled",
            reason
        })
        return NextResponse.json(appointment, {status: 201})
    } catch (error: any) {
        console.error("Error creating appointment:", error)
        return NextResponse.json({error: error.message || "Failed to create appointment"}, {status: 500})
    }
}