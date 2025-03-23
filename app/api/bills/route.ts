import { NextResponse } from "next/server"
import { connectToDatabase, getBills } from "@/lib/db-utils"
import Bill from "@/models/Bill"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    const bills = await getBills(patientId || undefined)

    return NextResponse.json(bills)
  } catch (error: any) {
    console.error("Error fetching bills:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch bills" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { patientId, amount, description, status, dueDate } = body

    // Validate required fields
    if (!patientId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new bill
    const bill = await Bill.create({
      patientId,
      amount,
      description,
      status: status || "pending",
      dueDate,
      createdAt: new Date(),
    })

    return NextResponse.json(bill, { status: 201 })
  } catch (error: any) {
    console.error("Error creating bill:", error)
    return NextResponse.json({ error: error.message || "Failed to create bill" }, { status: 500 })
  }
}

