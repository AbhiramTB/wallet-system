import { Redis, type RedisOptions } from "ioredis";
import { env } from "../../utils/env.js";

export const redisConfig: RedisOptions = {
  host: env.REDIS_HOST || "127.0.0.1",
  port: Number(env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

export const bullMqConnection = {
  host: env.REDIS_HOST || "127.0.0.1",
  port: Number(env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

export const redisClient = new Redis(redisConfig as any);

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("error", (error: unknown) => {
  console.error("Redis connection error:", error);
});