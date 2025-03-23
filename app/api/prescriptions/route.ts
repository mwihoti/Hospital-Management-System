import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {connectToDatabase} from "@/lib/db-utils";
import Prescription from "@/models/Prescription";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();

    // Get query parameters
    const url = new URL(request.url);
    const patientId = url.searchParams.get("patient");
    const doctorId = url.searchParams.get("doctor");
    const status = url.searchParams.get("status");
    const limit = Number.parseInt(url.searchParams.get("limit") || "10");
    const page = Number.parseInt(url.searchParams.get("page") || "1");

    // Build query
    const query: any = {};

    // Role-based access control
    if (session.user.role === "patient") {
      query.patient = session.user.id;
    } else if (session.user.role === "doctor") {
      if (patientId) {
        query.patient = patientId;
        query.doctor = session.user.id;
      } else {
        query.doctor = session.user.id;
      }
    } else if (session.user.role === "admin") {
      if (patientId) {
        query.patient = patientId;
      }
      if (doctorId) {
        query.doctor = doctorId;
      }
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const prescriptions = await Prescription.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name email specialization department")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const totalPrescriptions = await Prescription.countDocuments(query);

    return NextResponse.json({
      prescriptions,
      pagination: {
        total: totalPrescriptions,
        page,
        limit,
        pages: Math.ceil(totalPrescriptions / limit),
      },
    });
  } catch (error: any) {
    console.error("Get prescriptions error:", error);
    return NextResponse.json({ error: error.message || "Failed to get prescriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (session.user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized. Doctor access required" }, { status: 403 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { patient, medications, notes, refillsRemaining } = body;

    if (!patient || !medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const patientUser = await User.findById(patient);
    if (!patientUser) {
      return NextResponse.json({ error: "Invalid patient" }, { status: 400 });
    }

    const prescription = await Prescription.create({
      patient,
      doctor: session.user.id,
      date: new Date(),
      medications,
      notes,
      status: "Active",
      refillsRemaining: refillsRemaining || 0,
    });

    return NextResponse.json({ message: "Prescription created successfully", prescription }, { status: 201 });
  } catch (error: any) {
    console.error("Create prescription error:", error);
    return NextResponse.json({ error: error.message || "Failed to create prescription" }, { status: 500 });
  }
}
