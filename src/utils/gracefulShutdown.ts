import type { Server } from "http";

import { exchangeRateQueue } from "../infrastructure/queue/exchangeRateQueue.js";
import { exchangeRateWorker } from "../infrastructure/workers/exchangeRateWorker.js";

export function setupGracefulShutdown(server: Server): void {
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\ ${signal}. Shutting down gracefully...`);

    server.close(async () => {
      try {
        await exchangeRateWorker.close();
        await exchangeRateQueue.close();
        console.log("BullMQ worker and queue closed successfully.");
        process.exit(0);
      } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}
