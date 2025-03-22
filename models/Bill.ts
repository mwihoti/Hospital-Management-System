import mongoose, { Schema, type Document, type Model} from "mongoose"

interface BillItem {
    description: string
    quantity: number
    unitPrice: number
    total: number
}

export interface IBill extends Document {
    patient: mongoose.Types.ObjectId
    date: Date
    dueDate: Date
    items: BillItem[]
    amount: number
    status: "pending" | "Paid" | "Overdue" | "cancelled"
    description: string
    paymentMethod?: string
    paymentDate?: Date
    createdAt: Date
    updatedAt: Date
}

const BillItemSchema: Schema = new Schema({
    description: {
        type: String,
        required: [true, "Description required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
    unitPrice: {
        type: Number,
        required: [true, "Unit price is required"],
        min: [0, "unit price cannot be negative"]
    },
    total: {
        type: Number,
        required: [true, "Total is required"],
        min: [0, "Total cannot be negative"]
    }
})

const BillSchema: Schema = new Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Patient is required"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],

        },
        items: {
            type: [BillItemSchema],
            required: [true, "At least one item is required"],
            validate: {
                validator: (items: BillItem[]) => items.length > 0,
                message: "At least one item is required",
            }
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },
        status: {
            type: String,
            required: [true, "Status is required"],
            enum: ["Pending", "Paid", "Overdue", "Cancelled"],
            default: "Pending"
        },
        description: {
            type: String,
            required: [true, "Description is required"]
        },
        paymentMethod: {
            type: String,
            enum: ["Credit Card", "Debit Card", "Cash", "Insurance", "Bank Transfer", null]
        },
        paymentDate: {
            type: Date,
        }
    },
    { timestamps: true},
)

BillSchema.pre<IBill>("save", function (next) {
    if (this.isModified("items")) {
        this.amount = this.items.reduce((sum, item) => sum + item.total, 0)
    }
    next()
})

const Bill: Model<IBill> = mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema)

export default Bill