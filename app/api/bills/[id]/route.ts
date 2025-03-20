import { NextResponse } from "next/server"
import { getBillById } from "@/lib/db-utils"
import Bill from "@/models/Bill"
import connectToDatabase from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bill ID" }, { status: 400 })
    }

    const bill = await getBillById(id)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json(bill)
  } catch (error: any) {
    console.error("Error fetching bill:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch bill" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bill ID" }, { status: 400 })
    }

    const body = await request.json()

    // Find the bill
    const bill = await Bill.findById(id)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    // Update the bill
    const updatedBill = await Bill.findByIdAndUpdate(id, { $set: body }, { new: true }).populate(
      "patientId",
      "name email",
    )

    return NextResponse.json(updatedBill)
  } catch (error: any) {
    console.error("Error updating bill:", error)
    return NextResponse.json({ error: error.message || "Failed to update bill" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bill ID" }, { status: 400 })
    }

    // Find the bill
    const bill = await Bill.findById(id)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    // Delete the bill
    await Bill.findByIdAndDelete(id)

    return NextResponse.json({ message: "Bill deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting bill:", error)
    return NextResponse.json({ error: error.message || "Failed to delete bill" }, { status: 500 })
  }
}

