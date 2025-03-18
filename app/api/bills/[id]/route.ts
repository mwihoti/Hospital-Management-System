import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Bill from "@/models/Bill"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await connectToDatabase()

    const billId = params.id

    const bill = await Bill.findById(billId).populate("patient", "name email")

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    // Role-based access control
    if (decoded.role === "patient" && bill.patient._id.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ bill })
  } catch (error: any) {
    console.error("Get bill error:", error)
    return NextResponse.json({ error: error.message || "Failed to get bill" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await connectToDatabase()

    const billId = params.id
    const body = await request.json()

    // Find the bill
    const bill = await Bill.findById(billId)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    // Role-based access control
    if (decoded.role === "patient") {
      // Patients can only update status to 'Paid' and provide payment details
      if (body.status && body.status !== "Paid") {
        return NextResponse.json({ error: "Patients can only mark bills as paid" }, { status: 403 })
      }

      // Verify that the patient owns the bill
      if (bill.patient.toString() !== decoded.userId) {
        return NextResponse.json({ error: "Unauthorized. You can only pay your own bills" }, { status: 403 })
      }

      // Update payment details
      bill.status = "Paid"
      bill.paymentMethod = body.paymentMethod
      bill.paymentDate = new Date()
    } else if (decoded.role === "admin" || decoded.role === "doctor") {
      // Admins and doctors can update all fields
      if (body.dueDate) bill.dueDate = new Date(body.dueDate)
      if (body.items) {
        bill.items = body.items
        bill.amount = body.items.reduce((sum: number, item: any) => sum + item.total, 0)
      }
      if (body.status) bill.status = body.status
      if (body.description) bill.description = body.description
      if (body.paymentMethod) bill.paymentMethod = body.paymentMethod
      if (body.paymentDate) bill.paymentDate = new Date(body.paymentDate)
    }

    // Save the updated bill
    await bill.save()

    return NextResponse.json({
      message: "Bill updated successfully",
      bill,
    })
  } catch (error: any) {
    console.error("Update bill error:", error)
    return NextResponse.json({ error: error.message || "Failed to update bill" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Only admins can delete bills
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const billId = params.id

    const bill = await Bill.findByIdAndDelete(billId)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Bill deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete bill error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete bill" }, { status: 500 })
  }
}

