// app/api/data-entry/route.ts
import { connectDB } from "@/lib/db";
import { dataEntrySchema } from "@/lib/validation";
import { verifyToken } from "@/lib/jwt";
import DataEntry from "@/models/DataEntry";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    const validatedData = dataEntrySchema.parse({
      ...body,
      visitedCustomers:
        body.visitedCustomers <= body.targetCustomers
          ? body.visitedCustomers
          : body.targetCustomers,
    });

    const dataEntry = new DataEntry(validatedData);
    await dataEntry.save();

    return NextResponse.json(
      {
        id: dataEntry._id.toString(),
        message: "Data entry saved successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Data entry error:", error);
    return NextResponse.json({ error: "Failed to save data entry" }, { status: 500 });
  }
}
