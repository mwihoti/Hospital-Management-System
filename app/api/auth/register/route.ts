import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    console.log("Received form data", formData)

    const { name, email, password, role, department,
       contactNumber, specialization, address, dateOfBirth, gender, bloodGroup } = formData

     
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "patient",
      specialization,
      department,
      contactNumber,
      address,
      dateOfBirth,
      gender,
      bloodGroup
    })

    // Save user to database
    await newUser.save()

    // Return success response
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}

