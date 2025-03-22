import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    console.log("Connected to MongoDB")
    await connectToDatabase()

    // Check if test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" })

    if (existingUser) {
      // Update the password to ensure it's correct
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("password123", salt)

      existingUser.password = hashedPassword
      await existingUser.save()

      return NextResponse.json({
        message: "Test user updated",
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      })
    }

    // Create test user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("password123", salt)

    const testUser = new User({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      role: "admin", // Create as admin to have full access
    })

    await testUser.save()

    return NextResponse.json({
      message: "Test user created",
      user: {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        role: testUser.role,
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to create test user" }, { status: 500 })
  }
}

