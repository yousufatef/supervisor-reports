import mongoose, { Schema, type Document } from "mongoose"

export interface ICustomer extends Document {
  customerId: string
  customerName: string
  location?: string
  createdAt: Date
}

const customerSchema = new Schema<ICustomer>(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

// Create text index for search
customerSchema.index({ customerName: "text", customerId: "text" })

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", customerSchema)
