import { Router } from "express";

import { container } from "../../container/container.js";
import { WalletController } from "../controllers/WalletController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const walletRouter = Router();
const walletController = container.resolve(WalletController);

walletRouter.get("/balance", authMiddleware, walletController.getBalance);

export default walletRouter;
