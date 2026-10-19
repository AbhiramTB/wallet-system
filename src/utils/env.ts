
import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: "DB_URL" | "JWT_SECRET"): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  DB_URL: requireEnv("DB_URL"),
  PORT: process.env.PORT || 3000,
  JWT_SECRET: requireEnv("JWT_SECRET"),
  REDIS_HOST: process.env.REDIS_HOST,
  EXCHANGE_RATE_API_URL: process.env.EXCHANGE_RATE_API_URL || "https://open.er-api.com/v6/latest",
  DEFAULT_BASE_CURRENCY: process.env.DEFAULT_BASE_CURRENCY || "INR",
  CURRENCY_CACHE_TTL: Number(process.env.CURRENCY_CACHE_TTL) || 86400,
};
