import mongoose from "mongoose";
import "../database"
const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error; 
  }
}
