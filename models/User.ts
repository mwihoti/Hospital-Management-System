import mongoose, { Schema, type Document, type Model} from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: "admin" | "doctor" | "patient"
    specialization?: string
    department?: string
    contactNumber?: string
    address?: string
    dateOfBirth?: Date
    gender?: string
    bloodGroup?: string
    medicalHistory?: string[]
    comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
            maxlength: [50, "Name cannot be more than 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email",
              ],
            unique:  true,
            lowercase: true,
            trim: true

            
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false
        },
        role: {
            type: String,
            enum: ["admin", "doctor", "patient"],
            default: "patient"
        },

        // Doctor specific fields
        specialization: {
            type: String,
            required: function () {
                return this.role === "doctor"
            },
            trim: true,
        },
        department: {
            type: String,
            required: function () {
                return this.role === "doctor"
            }
        },
        //Common fields
        contactNumber: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        // Patient specific fields
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        medicalHistory: {
            type: [String]
        }
    
    },
    { timestamps: true},
)

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next ()

        try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
            next()
        } catch (error: any) {
            next(error)
        }
})
// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
}

// Ceck if model exists before creating a new one 
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User