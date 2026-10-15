
import "reflect-metadata";

import app from "./app.js";
import dbConnect from "./infrastructure/config/db.js";
import { env } from "./utils/env.js";

const port = env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {

    await dbConnect();

    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
