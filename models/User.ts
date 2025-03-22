import mongoose from "mongoose"
import { hashPassword } from "@/lib/auth"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    default: "patient",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})


// Create a model if it doesn't exist already
const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User

