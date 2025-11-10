import { connectDB } from "@/lib/db"
import Customer from "@/models/Customer"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 20

    let query: any = {}

    if (search) {
      query = {
        $or: [{ customerName: { $regex: search, $options: "i" } }, { customerId: { $regex: search, $options: "i" } }],
      }
    }

    const skip = (page - 1) * limit
    const total = await Customer.countDocuments(query)
    const customers = await Customer.find(query).skip(skip).limit(limit).lean()

    return NextResponse.json({
      customers,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
