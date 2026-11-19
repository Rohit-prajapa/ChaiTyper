import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully!");
    console.log("DB HOST:", connection.connection.host);
    console.log("DB NAME:", connection.connection.name);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
