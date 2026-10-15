import mongoose from "mongoose";
import { env } from "../../utils/env.js";



async function dbConnect(): Promise<void> {
  try {
    const connection = await mongoose.connect(env.DB_URL);

    console.log(connection.connection.host);
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export default dbConnect;
