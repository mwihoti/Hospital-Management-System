import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IMedication extends Document {
    name: string
    dosages: string[]
    frequencies: string[]
    routes: string[]
    price: string[]
    inStock: boolean
    stockQuantity: number
    manufacturer: string
    description?: string
    createdAt: Date
    updatedAt: Date
}

const MedicationSchema: Schema = new Schema(
    {
        name: {
          type: String,
          required: [true, "Medication name is required"],
          unique: true,
          trim: true,
        },
        dosages: {
          type: [String],
          required: [true, "At least one dosage is required"],
          validate: {
            validator: (dosages: string[]) => dosages.length > 0,
            message: "At least one dosage is required",
          },
        },
        frequencies: {
          type: [String],
          required: [true, "At least one frequency is required"],
          validate: {
            validator: (frequencies: string[]) => frequencies.length > 0,
            message: "At least one frequency is required",
          },
        },
        routes: {
          type: [String],
          required: [true, "At least one route is required"],
          validate: {
            validator: (routes: string[]) => routes.length > 0,
            message: "At least one route is required",
          },
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price cannot be negative"],
        },
        inStock: {
          type: Boolean,
          default: true,
        },
        stockQuantity: {
          type: Number,
          required: [true, "Stock quantity is required"],
          min: [0, "Stock quantity cannot be negative"],
        },
        manufacturer: {
          type: String,
          required: [true, "Manufacturer is required"],
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
      { timestamps: true },
)

const Medication: Model<IMedication> = mongoose.models.Medication || mongoose.model<IMedication>("Medication", MedicationSchema)


export default Medication