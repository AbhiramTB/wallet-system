import { Queue } from "bullmq";
import { bullMqConnection } from "../config/redis.js";

export const exchangeRateQueue = new Queue("exchange-rates", {
  connection: bullMqConnection,
});