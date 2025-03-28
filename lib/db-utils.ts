import { ObjectId } from "mongodb"
import Appointment from "@/models/Appointment"
import MedicalRecord from "@/models/MedicalRecord"
import Prescription from "@/models/Prescription"
import Bill from "@/models/Bill"
import Medication from "@/models/Medication"
import User from "@/models/User"

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}
export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('Connected to MongoDB');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}

// User queries
export async function getUsers(role?: string) {
    await connectToDatabase()

    const query = role ? { role } : {}
    return User.find(query).select("-password")
}

export async function getUserById(id: string) {
    await connectToDatabase()

    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid user id")
    }

    return User.findById(id).select("-password")
}

// Appointment queries
export async function getAppointments(filters: any = {}) {
    await connectToDatabase()

    return Appointment.find(filters)
        .populate("patientId", "name email")
        .populate("doctorId", "name specialization department")
}

export async function getAppointmentById(id: string) {
    await connectToDatabase()

    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid user Id")
    }
    const query = role === "patient"  ? { patientId: userId} : role === "doctor" ? {doctorId: userId} : {}

    return Appointment.find(query)
        .populate("patientId", "name email")
        .populate("doctorId", "name specialization department")
}


export async function getUserAppointments(userId: string, role: string) {
    await connectToDatabase()

    if (!ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID")
    }
    const query = role === "patient" ? { patientId: userId} : role === "doctor" ? { doctorId: userId} : {}


    return Appointment.find(query)
        .populate("patientId", "name email")
        .populate("doctorId", "name specialization ")

}

// Medical record queries
export async function getMedicalRecords(patientId?: string) {
    await connectToDatabase()

    const query = patientId ? { patientId } : {}
    
    return MedicalRecord.find(query).populate("patientId", "name email").populate("doctorId", "name specilization")
}

export async function getMedicalRecordById(id: string) {
    await connectToDatabase()

    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid medical record ID")
    }

    return MedicalRecord.findById(id).populate("patientId", "name email").populate("doctorId", "name specilization")
}

// Prescription queries
export async function getPrescriptions(patientId?: string) {
    await connectToDatabase()

    const query = patientId ? { patientId } : {}

    return Prescription.find(query)
        .populate("patientId", "name email")
        .populate("doctorId", "name specialization")
        .populate("medications")
}

// Bill queries
export async function getBills(patientId?: string) {
    await connectToDatabase()

    const query = patientId ? { patientId } : {}
    return Bill.find(query).populate("patientId", "name email")
}

export async function getBillById(id: string) {
    await connectToDatabase()

    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid bill ID")
    }
    return Bill.findById(id).populate("patientId", "name email")
}

// Medication queries
export async function getMedications(query: any = {}) {
    await connectToDatabase()

    return Medication.find(query)
}

export async function getMedicationById(id: string) {
    await connectToDatabase()

    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid medication ID")
    }

    return Medication.findById(id) 
}


