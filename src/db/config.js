import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbURI = process.env.MONGO_URL || "mongodb+srv://aliahmedrza:ritadanto@blogapp.iz2b4.mongodb.net/?retryWrites=true&w=majority&appName=blogApp";

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
export default dbConfig;