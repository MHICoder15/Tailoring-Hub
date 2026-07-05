import mongoose from "mongoose";
import { config } from "./config.ts";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(`Connected to MongoDB Successfully ${mongoose.connection.host}, ${mongoose.connection.name}`);
    });
    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting to MongoDB", err);
    });
    mongoose.connect(config.mongodbUri as string);
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
