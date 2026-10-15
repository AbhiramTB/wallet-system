
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL || process.env.DB_URL.trim() === "") {
  throw new Error("Missing required environment variable: DB_URL");
}


export const env = {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 3000,
};
