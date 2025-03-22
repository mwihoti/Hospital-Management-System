import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db-utils"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    console.log("Connected to MongoDB")
    await connectToDatabase()

    // Check if test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" })

    if (existingUser) {
      // Update password to ensure it's correct
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("password123", salt)

      existingUser.password = hashedPassword
      await existingUser.save()

      return NextResponse.json({
        message: "Test user password updated",
        email: "test@example.com",
        password: "password123",
      })
    }

    // Create a new test user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("password123", salt)

    const newUser = new User({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      role: "patient",
    })

    await newUser.save()

    return NextResponse.json({
      message: "Test user created successfully",
      email: "test@example.com",
      password: "password123",
    })
  } catch (error) {
    console.error("Error creating test user:", error)
    return NextResponse.json({ error: "Failed to create test user" }, { status: 500 })
  }
}

