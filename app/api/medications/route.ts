import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Medication from "@/models/Medication"
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
    const name = url.searchParams.get("name")
    const inStock = url.searchParams.get("inStock")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")

    // Build query
    const query: any = {}

    // Filter by name if provided
    if (name) {
      query.name = { $regex: name, $options: "i" }
    }

    // Filter by stock status if provided
    if (inStock !== null && inStock !== undefined) {
      query.inStock = inStock === "true"
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get medications
    const medications = await Medication.find(query).skip(skip).limit(limit).sort({ name: 1 })

    // Get total count
    const totalMedications = await Medication.countDocuments(query)

    return NextResponse.json({
      medications,
      pagination: {
        total: totalMedications,
        page,
        limit,
        pages: Math.ceil(totalMedications / limit),
      },
    })
  } catch (error: any) {
    console.error("Get medications error:", error)
    return NextResponse.json({ error: error.message || "Failed to get medications" }, { status: 500 })
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

    // Only admins can add medications
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const body = await request.json()
    const { name, dosages, frequencies, routes, price, stockQuantity, manufacturer, description } = body

    // Validate required fields
    if (
      !name ||
      !dosages ||
      !frequencies ||
      !routes ||
      price === undefined ||
      stockQuantity === undefined ||
      !manufacturer
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if medication already exists
    const existingMedication = await Medication.findOne({ name })
    if (existingMedication) {
      return NextResponse.json({ error: "Medication with this name already exists" }, { status: 400 })
    }

    // Create medication
    const medication = await Medication.create({
      name,
      dosages,
      frequencies,
      routes,
      price,
      inStock: stockQuantity > 0,
      stockQuantity,
      manufacturer,
      description,
    })

    return NextResponse.json({ message: "Medication created successfully", medication }, { status: 201 })
  } catch (error: any) {
    console.error("Create medication error:", error)
    return NextResponse.json({ error: error.message || "Failed to create medication" }, { status: 500 })
  }
}

