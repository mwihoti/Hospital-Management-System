import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
    try {
        await connectToDatabase()

        const body = await request.json()
        const { email, password} = body

        // Validate input
        if  (!email || !password) {
            return NextResponse.json({ error: "Please provide email and password"}, {status: 400})
        }

        // Find user
        const user = await User.findOne({email}).select("+password")

        if (!user) {
            return NextResponse.json({error: "Invalid credentials"}, {status: 401})
        }

        //Check password
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials"}, {status: 401})
        }

        // Generate JWT token

        const token = jwt.sign({ userId: user._id, role: user.role}, process.env.JWT_SECRET || "fallback-secret", {expiresIn: "20h"})

        // Remove password from response

        const userResponse = user.toObject()
        delete userResponse.password
        
        //log successful login with user details
        console.log("User login successful:", {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            timeStamp: new Date().toISOString()
        })

        return NextResponse.json({
            message: "Login Successful",
            user: userResponse,
            token
        })
    } catch (error: any) {
        console.error("Login error:", error)
        return NextResponse.json({ error: error.message ||  "failed to login"}, {status: 500})
    }
}