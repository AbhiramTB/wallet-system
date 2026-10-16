import express from "express";

import userRouter from "./presentation/routes/user.js";
import walletRouter from "./presentation/routes/wallet.js";
import transactionRouter from "./presentation/routes/transaction.js";
import { errorMiddleware } from "./presentation/middleware/errorMiddleware.js";
import morgan from 'morgan';
import { HttpStatus } from "./constants/httpStatus.js";

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use("/api/users", userRouter);
app.use("/api/wallets", walletRouter);
app.use("/api/transactions", transactionRouter);

app.get("/sample", (_req, res) => {
  res.status(HttpStatus.OK).json({ status: "ok" });
});

app.use(errorMiddleware);

export default app;
