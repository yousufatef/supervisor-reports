import mongoose, { Schema, type Document } from "mongoose"

export interface IDataEntry extends Document {
  supervisorEmail: string
  supervisorName: string
  currentDate: Date
  region: string
  customers: Array<{
    customerCode: string
    customerLocation?: string
  }>
  contractType: string
  targetCustomers: number
  visitedCustomers: number
  psChecked: boolean
  osa: number      // <-- بدل Boolean
  merchDisplay: number // <-- بدل Boolean
  comments?: string
  createdAt: Date
  updatedAt: Date
}

const dataEntrySchema = new Schema<IDataEntry>(
  {
    supervisorEmail: {
      type: String,
      required: true,
    },
    supervisorName: {
      type: String,
      required: true,
    },
    currentDate: {
      type: Date,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    customers: [
      {
        customerCode: String,
        customerLocation: String,
      },
    ],
    contractType: {
      type: String,
      required: true,
    },
    targetCustomers: {
      type: Number,
      required: true,
    },
    visitedCustomers: {
      type: Number,
      required: true,
    },
    psChecked: {
      type: Boolean,
      default: false,
    },
    osa: {
      type: Number,   // <-- هنا
      default: 0,
    },
    merchDisplay: {
      type: Number,   // <-- هنا
      default: 0,
    },
    comments: String,
  },
  { timestamps: true },
)

export default mongoose.models.DataEntry || mongoose.model<IDataEntry>("DataEntry", dataEntrySchema)
