import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {

    try {
        // verify authentication
        const token = request.headers.get("Authorization")?.split(" ")[1]
        if (!token) {
            return NextResponse.json({ error: "Authentication required"}, {status: 401})
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token"}, {status: 401})
        }
        await connectToDatabase()

        const appointmentId = params.id
        const appointment = await Appointment.findById(appointmentId)
            .populate("patient", "name email")
            .populate("doctor", "name email specialization department")

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found"}, { status: 404})
        }

        // Role-based access control
        if ( 
            (decoded.role === "patient" && appointment.patient._id.toString() !== decoded.userId) || (decoded.role === "doctor" && appointment.doctor._id.toString() !== decoded.userId)
        ) {
            return NextResponse.json({ error: "Unauthorized" }, {status: 403})
        }
        return NextResponse.json({ appointment })
    } catch (error: any) {
        console.error("Get appointment error:", error)
        return NextResponse.json({ error: error.message || "Failed to get appointment"}, {status: 500})
    }
}

export async function PUT(request: Request, { params }: {params: { id: string}}) {
    try {
        // verify authentication
        const token = request.headers.get("Authorization")?.split(" ")[1]
        if (!!token) {
            return NextResponse.json({ error: "Authentication required"}, { status: 401})
        }
        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token"}, { status: 401})
        }

        await connectToDatabase()

        const appointmentId = params.id
        const body = await request.json()

        // Find the appointment
        const appointment = await Appointment.findById(appointmentId)

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found"}, { status: 404})
        }

        // Role based access control
        if (
            (decoded.role === "patient" && appointment.patient.toString() !== decoded.userId) || 
            (decoded.role === "doctor" && appointment.doctor.toString() !== decoded.userId) 
        ) {
            return NextResponse.json({ error: "Unauthorized"}, {status: 403})
        }

        // Patients can only update status to cancelled
        if (decoded.role === "patient") {
            if (body.status && body.status !== "Cancelled") {
                return NextResponse.json({error: "Patients can only cancel appointments"}, {status: 403})
            }

        // only allow cancellation if appointmentis not already completed or cancelled
        if (appointment.status === "Completed" || appointment.status === "Cancelled") {
            return NextResponse.json({ error: "Cannot cancel a completed or already cancelled appointment"}, {status: 400})
        }
        
        // only update status field
        appointment.status = "Cancelled"
    } else {
        // Doctors and admins can update all fields
        // Check for double booking if date or time is changed
        if (
            (body.date && body.date !== appointment.date.toString().split("T")[0]) || 
            (body.time && body.time !== appointment.time)
        ) {
            const existingAppointment = await Appointment.findOne({
                doctor: appointment.doctor,
                date: body.date ? new Date(body.date) : appointment.date,
                time: body.time || appointment.time,
                status: {$nin: ["Cancelled", "Completed"]},
                _id: { $ne: appointmentId},
            })

            if (existingAppointment) {
                return NextResponse.json({ error: "Doctor already has an appointment at this time"}, { status: 400})
            }
        }

        // Update fields
        if (body.date) appointment.date = new Date(body.date)
        if (body.time) appointment.time = body.time
        if (body.duration) appointment.duration = body.duration
        if (body.type) appointment.type = body.type
        if (body.status) appointment.status = body.status
        if (body.notes) appointment.notes = body.notes
        if (body.department) appointment.department = body.department
    }
    // Save the updated appointment
    await appointment.save()

    return NextResponse.json({
        message: "Appointment updated successfully",
        appointment
    })

} catch (error: any) {
    console.error("Update appointment error:", error)
    return NextResponse.json({ error: error.message || "Failed to update appointment"}, {status: 500})
}
}

export async function Delete(request: Request, { params}: {params: {id: string}}) {
    try {
        // Verify authentication
        const token = request.headers.get("Authorization")?.split(" ")[1]
        if (!token) {
            return NextResponse.json({ error: "Authentication required"}, { status: 401})
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token"}, {status: 401})
        }

        // only admins can delete appointments
        if (decoded.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized. Admin access required"}, { status: 403})
        }

        await connectToDatabase()

        const appointmentId = params.id

        const appointment = await Appointment.findByIdAndDelete(appointmentId)

        if (!appointment) {
            return NextResponse.json({error: "Appointment not found"}, { status: 404})
        }
        return NextResponse.json({
            message: "Appointment deleted successfully"
        })
    } catch (error: any) {
        console.error("Delete appointment error:", error)
        return NextResponse.json({ error: error.message || "Failed to delete appointment"}, {status: 500})
    }
}