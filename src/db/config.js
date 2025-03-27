import mongoose from "mongoose";

const dbConfig = async () => {
  try {
    await mongoose.connect("mongodb+srv://aliahmedrza:ritadanto@blogapp.iz2b4.mongodb.net/?retryWrites=true&w=majority&appName=blogApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
      socketTimeoutMS: 45000, // Increase socket timeout
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConfig;
