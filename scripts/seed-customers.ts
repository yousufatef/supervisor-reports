import mongoose from "mongoose"
import Customer from "../models/Customer"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/data-entry"

async function seedCustomers() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing customers
    await Customer.deleteMany({})

    // Generate 15,000 sample customers
    const customers = []
    const locations = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
    ]

    for (let i = 1; i <= 15000; i++) {
      customers.push({
        customerId: `CUST-${String(i).padStart(6, "0")}`,
        customerName: `Customer ${i}`,
        location: locations[Math.floor(Math.random() * locations.length)],
      })
    }

    // Insert in batches
    const batchSize = 1000
    for (let i = 0; i < customers.length; i += batchSize) {
      const batch = customers.slice(i, i + batchSize)
      await Customer.insertMany(batch)
      console.log(`Inserted ${Math.min(i + batchSize, customers.length)} customers...`)
    }

    console.log("15,000 customers seeded successfully!")
  } catch (error) {
    console.error("Error seeding customers:", error)
  } finally {
    await mongoose.disconnect()
  }
}

seedCustomers()
