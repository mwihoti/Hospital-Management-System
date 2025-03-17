import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const { name, email, password, role, ...additionalFields } = body;


        // Check if user already
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists"}, {status: 400})
        }

        // Validate role
        if (!["admin", "doctor", "patient"].includes(role)) {
            return NextResponse.json({ error: "Invalid role. Role must be an admin, patient and doctor"}, {status: 400})
        }
        // Validate role-specific required fields
        if (role === "doctor" && (!additionalFields.specialization || !additionalFields.department)) {
            return NextResponse.json({error: "Doctors must provide spacialization and department"}, {status: 400})
        }
        // Create new user

        const user = await User.create({
            name,
            email,
            password,
            role,
            ...additionalFields,
        })

        // Remove password from response
        const userResponse = user.toObject()
        delete userResponse.password

        console.log("User registered successfully:", {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({ message: "User registered successfully", user: userResponse}, {status: 201})
    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: error.message || "Failed to register user"}, {status: 500})
    }
}