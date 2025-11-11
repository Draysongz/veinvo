import { connect } from "mongoose";
import { config } from "../config";

const connectDB = async () => {
  try {
    const conn = await connect(config.mongodb.url);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
