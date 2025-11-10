import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    await connectDB();

    const users = [
        { email: "joeatef769@gmail.com", password: "alahly123456", name: "Joe Atef", region: "Cairo" },
        { email: "sara@example.com", password: "password123", name: "Sara Ali", region: "Giza" },
    ];

    for (const u of users) {
        const exists = await User.findOne({ email: u.email });
        if (!exists) {
            const user = new User(u);
            await user.save();
        }
    }

    return NextResponse.json({ message: "Seed users completed" });
}
