import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.once("connected", () => {
      console.log("MongoDB connected");
    });
    await mongoose.connect(`${process.env.MONGO_URL}/social_media`);
  
    } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
