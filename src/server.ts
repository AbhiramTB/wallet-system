
import "reflect-metadata";
import "./container/container.js";

import app from "./app.js";
import dbConnect from "./infrastructure/config/db.js";
import { scheduleExchangeRateUpdates } from "./infrastructure/jobs/exchangeRateScheduler.js";
import { env } from "./utils/env.js";
import { setupGracefulShutdown } from "./utils/gracefulShutdown.js";

const port = env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    
   await dbConnect();

    await scheduleExchangeRateUpdates();

    const server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

    setupGracefulShutdown(server);
    
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
