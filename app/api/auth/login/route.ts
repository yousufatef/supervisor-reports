import { connectDB } from "@/lib/db"
import { loginSchema } from "@/lib/validation"
import { signToken } from "@/lib/jwt"
import User from "@/models/User"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const { email, password } = loginSchema.parse(body)

    const user = await User.findOne({ email: email.toLowerCase() })
    console.log("🚀 ~ POST ~ user:", user)


    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      region: user.region,
    })

    const response = NextResponse.json(
      {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          region: user.region,
        },
      },
      { status: 200 },
    )

    // Set secure HTTP-only cookie
    // response.cookies.set("auth-token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 86400, // 1 day
    // })

    return response
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
