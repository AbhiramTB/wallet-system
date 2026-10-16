import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "./redis.js";

export const userPerMinuteLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rate_limit:user:minute",
  points: 20,
  duration: 60,
});

export const userPerHourLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rate_limit:user:hour",
  points: 1000,
  duration: 60 * 60,
});