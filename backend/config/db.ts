import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("MongoDb is Connected!")
    );
    await mongoose.connect(process.env.MONGO_URL as string);

  } catch (error) {
    console.error("Error Connected to MongoDB", error)
    
  }
};

export default connectDB;