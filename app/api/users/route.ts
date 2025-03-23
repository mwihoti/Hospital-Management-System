import { NextResponse } from "next/server"
import { getUsers } from "@/lib/db-utils"
import User from "@/models/User"
import connectToDatabase from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    const users = await getUsers(role || undefined)

    return NextResponse.json(users)
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, email, password, role, ...otherFields } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient",
      ...otherFields,
    })

    // Remove password from response
    const userResponse = { ...user.toObject(), password: undefined }

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 })
  }
}

