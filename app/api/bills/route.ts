import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Bill from "@/models/Bill"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
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

    // Get query parameters
    const url = new URL(request.url)
    const patientId = url.searchParams.get("patient")
    const status = url.searchParams.get("status")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")

    // Build query
    const query: any = {}

    // Role-based access control
    if (decoded.role === "patient") {
      // Patients can only see their own bills
      query.patient = decoded.userId
    } else if (decoded.role === "admin" || decoded.role === "doctor") {
      // Admins and doctors can filter by patient
      if (patientId) {
        query.patient = patientId
      }
    }

    // Filter by status if provided
    if (status) {
      query.status = status
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get bills
    const bills = await Bill.find(query).populate("patient", "name email").skip(skip).limit(limit).sort({ date: -1 })

    // Get total count
    const totalBills = await Bill.countDocuments(query)

    return NextResponse.json({
      bills,
      pagination: {
        total: totalBills,
        page,
        limit,
        pages: Math.ceil(totalBills / limit),
      },
    })
  } catch (error: any) {
    console.error("Get bills error:", error)
    return NextResponse.json({ error: error.message || "Failed to get bills" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    // Only admins and doctors can create bills
    if (decoded.role !== "admin" && decoded.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized. Admin or doctor access required" }, { status: 403 })
    }

    await connectToDatabase()

    const body = await request.json()
    const { patient, date, dueDate, items, description } = body

    // Validate required fields
    if (!patient || !dueDate || !items || !Array.isArray(items) || items.length === 0 || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify that the patient exists
    const patientUser = await User.findById(patient)
    if (!patientUser) {
      return NextResponse.json({ error: "Invalid patient" }, { status: 400 })
    }

    // Calculate total amount
    const amount = items.reduce((sum, item) => sum + item.total, 0)

    // Create bill
    const bill = await Bill.create({
      patient,
      date: date ? new Date(date) : new Date(),
      dueDate: new Date(dueDate),
      items,
      amount,
      status: "Pending",
      description,
    })

    return NextResponse.json({ message: "Bill created successfully", bill }, { status: 201 })
  } catch (error: any) {
    console.error("Create bill error:", error)
    return NextResponse.json({ error: error.message || "Failed to create bill" }, { status: 500 })
  }
}

