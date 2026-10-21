
import { env } from "../../utils/env.js";
import { Sequelize } from "sequelize";

if (!env.DB_PASSWORD || !env.DB_USERNAME || !env.DB_HOST) {
  throw new Error("Database password, username, and host are required");
}

export const sequelize = new Sequelize(
  "wallet_system",
  env.DB_USERNAME,
  env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: env.DB_HOST,
  }
);

async function dbConnect(): Promise<Sequelize> {
  try {
    await sequelize.authenticate();

    console.log("MySQL database connected successfully");

    return sequelize;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export default dbConnect;
