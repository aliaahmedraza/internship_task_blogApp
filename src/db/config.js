import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URL || "mongodb+srv://aliahmedrza:ritadanto@blogapp.iz2b4.mongodb.net/?retryWrites=true&w=majority&appName=blogApp"; // Use a default local DB if env var is missing

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process on failure
  }
};

export default dbConfig;
