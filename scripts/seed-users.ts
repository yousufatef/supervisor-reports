import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/User"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/data-entry"

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing users
    await User.deleteMany({})

    const supervisors = [
      {
        email: "supervisor1@company.com",
        password: "password123",
        name: "John Supervisor",
        region: "North",
      },
      {
        email: "supervisor2@company.com",
        password: "password123",
        name: "Jane Supervisor",
        region: "South",
      },
      {
        email: "supervisor3@company.com",
        password: "password123",
        name: "Mike Supervisor",
        region: "East",
      },
    ]

    for (const supervisor of supervisors) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(supervisor.password, salt)

      await User.create({
        email: supervisor.email,
        password: hashedPassword,
        name: supervisor.name,
        region: supervisor.region,
      })

      console.log(`Created supervisor: ${supervisor.email}`)
    }

    console.log("Users seeded successfully!")
  } catch (error) {
    console.error("Error seeding users:", error)
  } finally {
    await mongoose.disconnect()
  }
}

seedUsers()
