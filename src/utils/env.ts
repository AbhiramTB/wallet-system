
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL || process.env.DB_URL.trim() === "") {
  throw new Error("Missing required environment variable: DB_URL");
}


export const env = {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default_access_token_secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret",
  JWT_SECRET: process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "default_jwt_secret_key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  EXCHANGE_RATE_API_URL: process.env.EXCHANGE_RATE_API_URL || "https://open.er-api.com/v6/latest",
  DEFAULT_BASE_CURRENCY: process.env.DEFAULT_BASE_CURRENCY || "INR",
  CURRENCY_CACHE_TTL: Number(process.env.CURRENCY_CACHE_TTL) || 86400,
};

