import mongoose, { Schema, type Document, type Model } from "mongoose"

interface Medication {
    name: string
    dosage: string
    frequency: string
    route: string
    duration: string
    instructions?: string
}

export interface IPrescription extends Document {
    patient: mongoose.Types.ObjectId
    doctor: mongoose.Types.ObjectId
    date: Date
    medications: Medication[]
    notes?: string
   // status: "Active" | "Completed" | "Cancelled"
    refillsRemaining: number
    createdAt: Date
    updatedAt: Date
}

const MedicationSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, "Medication name is required"],
    },
    dosage: {
        type: String,
        required: [true, "Dosage is required"]
    },
    frequency: {
        type: String,
        required: [true, "Frequency is required"],
    },
    route: {
        type: String,
        required: [true, "Route is required"],
        enum: ["Oral", "Intravenous", "Intramuscular", "Topical", "Sublingual", "Inhalation", "Rectal"],
    },
    duration: {
        type: String,
        required: [true, "Duration is required"],
    },
    instructions: {
        type:  String
    }
})

const PrescriptionSchema: Schema = new Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Patient is required"]
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Doctor is required"]
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        medications: {
            type: [MedicationSchema],
            required: [true, "At Least one medication is required"],
            validate: {
                validator: (medications: Medication[]) => medications.length > 0,
                message: "At least one medication is required"
            },
        },
        notes: {
            type: String,
        }, 
        
        refillsRemaining: {
            type: Number,
            default: 0,
            min: 0
        },
    },
    {timestamps: true},
)

const Prescription: Model<IPrescription> = mongoose.models.Prescription || mongoose.model<IPrescription>("Prescription", PrescriptionSchema)

export default Prescription