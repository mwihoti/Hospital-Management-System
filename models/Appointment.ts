import mongoose from "mongoose"

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  //status: {
    //type: String,
    //enum: ["scheduled", "confirmed", "cancelled", "completed"],
    //default: "scheduled",
  //},
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)

export default Appointment

