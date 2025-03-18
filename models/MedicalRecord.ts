import mongoose, { Schema, type Document, type Model } from "mongoose"


interface Attachment {
    name: string
    type: string
    url: string
}

export interface IMedicalRecord extends Document {
    patient: mongoose.Types.ObjectId
    doctor: mongoose.Types.ObjectId
    date: Date
    type: string
    diagnosis: string
    notes: string
    department: string
    attachments?: Attachment[]
    createdAt: Date
    updatedAt: Date
}

const AttachmentSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, "Attachment name is required"],
    },
    type: {
        type: String,
        required: [true, "Attachment type is required"]
    },
    url: {
        type: String,
        required: [true, "Attachment url is required"]
    }
})

const MedicalRecordSchema: Schema = new Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Patient is required"],
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Doctor is required"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now
        },
        type: {
            type: String,
            required: [true, "Record type is required"],
            enum: ["Check-up", "Consultation", "Follow-up", "Surgery", "Emergency", "Test Results"],
        },
        diagnosis: {
            type: String,
            required: [true, "Diagnosis is required"],
        },
        notes: {
            type: String,
            required: [true, "Notes are required"]
        },
        department: {
            type: String,
            required: [true, "Department is required"]
        },
        attachments: {
            type: [AttachmentSchema],
            default: [],
        },
    },
    { timestamps: true}
)

const MedicalRecord: Model<IMedicalRecord> = mongoose.models.MedicalRecord || mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema)

export default MedicalRecord