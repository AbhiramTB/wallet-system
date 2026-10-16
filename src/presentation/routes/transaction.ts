import { Router } from "express";

import { container } from "../../container/container.js";
import { TransactionController } from "../controllers/TransactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const transactionRouter = Router();
const transactionController = container.resolve(TransactionController);

transactionRouter.post("/deposit", authMiddleware, transactionController.deposit);
transactionRouter.post("/withdraw", authMiddleware, transactionController.withdraw);
transactionRouter.post("/transfer", authMiddleware, transactionController.transfer);
transactionRouter.get("/history", authMiddleware, transactionController.getHistory);
transactionRouter.get("/history/:userId", authMiddleware, transactionController.getHistory);

export default transactionRouter;
