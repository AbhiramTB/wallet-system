import { Router } from "express";

import { container } from "../../container/container.js";
import { TransactionController } from "../controllers/TransactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { rateLimitMiddleware } from "../middleware/rateLimitMiddleware.js";

const transactionRouter = Router();
const transactionController = container.resolve(TransactionController);

transactionRouter.post("/deposit", authMiddleware,rateLimitMiddleware, transactionController.deposit);
transactionRouter.post("/withdraw", authMiddleware,rateLimitMiddleware, transactionController.withdraw);
transactionRouter.post("/transfer", authMiddleware, rateLimitMiddleware, transactionController.transfer);
transactionRouter.get("/history", authMiddleware, rateLimitMiddleware, transactionController.getHistory);

export default transactionRouter;
