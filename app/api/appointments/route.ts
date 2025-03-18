import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"
import { error } from "console"

export async function GET(request: Request) {
    try {
        // Verify authentication
        const token = request.headers.get("Authorization")?.split(" ")[1]
        if (!token) {
            return NextResponse.json({ error: "Authentication required"}, {status: 401})
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, {status: 401})
        }

        await connectToDatabase()

        // Get query parameters
        const url = new URL(request.url)
        const status = url.searchParams.get("status")
        const date = url.searchParams.get("date")
        const doctorId = url.searchParams.get("doctor")
        const patientId = url.searchParams.get("patient")
        const limit = Number.parseInt(url.searchParams.get("limit") || "10")
        const page = Number.parseInt(url.searchParams.get("page") || "1")

        // Build query
        const query: any = {}

        // Filter by status if provided
        if (status) {
            query.status = status
        }

        // Filter by date if provided
        if (date) {
            const startDate = new Date(date)
            startDate.setHours(0, 0, 0, 0)


            const endDate = new Date(date)
            endDate.setHours(23, 59, 59, 999)

            query.date = { $gte: startDate, $lte: endDate}
        }
        // Role-based access control
        if (decoded.role === "doctor") {
            // Doctors can only see their own  appointments
            query.doctor = decoded.userId
        } else if (decoded.role === "patient") {
            // Patients can only see their own appointments
            query.patient = decoded.userId
        } else if (decoded.role === "admin") {
            // Admins can filter by doctor or  patient
            if (doctorId) {
                query.doctor = doctorId
            }

            if (patientId) {
                query.patient = patientId
            }
        }
        // Calculate pagination
        const skip = (page - 1) * limit

        // Get appointments
        const appointments = await Appointment.find(query)
            .populate("patient", "name email")
            .populate("doctor", "name email specialization department")
            .skip(skip)
            .limit(limit)
            .sort({ date: 1, time: 1})
        // Get total count
        const totalAppointments = await Appointment.countDocuments(query)

        return NextResponse.json({
            appointments,
            pagination: {
                total: totalAppointments,
                page,
                limit,
                pages: Math.
            }
        })
    }
}