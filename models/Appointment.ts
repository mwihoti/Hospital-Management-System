import mongoose, { Schema, type Document, type Model} from "mongoose"

export interface IAppointment extends Document {
    patient: mongoose.Types.ObjectId
    doctor: mongoose.Types.ObjectId
    date: Date
    time: string
    duration: string
    type: string
    status: "Pending" | "Confirmed" | "Cheecked In" | "Completed" | "Cancelled" | "No Show"
    notes?: string
    department: string
    createdAt: Date
    updatedAt: Date

}

const AppointmentSchema: Schema = new Schema(
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
        },
        time: {
            type: String,
            required: [true, "Time is required"],
        },
        duration: {
            type: String,
            default: "30 min",
        },
        type: {
            type: String,
            required: [true, "Appointment type is required"],
            enum: ["Check-up", "Follow-up", "Consultation", "New Patient", "Emergency"]
        },
        status: {
            type: String,
            required: [true, "Status is required"],
            enum: ["Pending", "Confirmed", "Checked In", "Completed", "Cancelled", "No Show"],
            default: "Pending",
        },
        notes: {

            type: String,
        },
        department: {
            type: String,
            required: [true, "Department is required"],
        },
    },
    {timestamps: true}
)

// Create a compound index for doctor, date and time to ensure no double bookings
AppointmentSchema.index({ doctor: 1, date: 1, time: 1}, {unique: true})

const Appointment: Model<IAppointment> = mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment",
    AppointmentSchema)

export default Appointment