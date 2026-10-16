import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../container/tokens.js";
import { MESSAGES } from "../../constants/messages.js";
import { HttpStatus } from "../../constants/httpStatus.js";
import type { IDepositUseCase } from "../../application/usecases/deposit/IDepositUseCase.js";
import type { IWithdrawUseCase } from "../../application/usecases/withdraw/IWithdrawUseCase.js";
import type { ITransferUseCase } from "../../application/usecases/transfer/ITransferUseCase.js";
import type { IGetTransactionHistoryUseCase } from "../../application/usecases/getTransactionHistory/IGetTransactionHistoryUseCase.js";

@injectable()
export class TransactionController {
  constructor(
    @inject(DI_TOKENS.depositUseCase)
    private readonly depositUseCase: IDepositUseCase,
    @inject(DI_TOKENS.withdrawUseCase)
    private readonly withdrawUseCase: IWithdrawUseCase,
    @inject(DI_TOKENS.transferUseCase)
    private readonly transferUseCase: ITransferUseCase,
    @inject(DI_TOKENS.getTransactionHistoryUseCase)
    private readonly getTransactionHistoryUseCase: IGetTransactionHistoryUseCase,
  ) {}

  deposit = async (request: Request, response: Response): Promise<void> => {
    const userId = response.locals.userId as string | undefined;

    if (!userId) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const { amount, currency } = request.body;

    if (amount === undefined || amount === null || typeof amount !== "number") {
      throw new Error(MESSAGES.INVALID_AMOUNT);
    }

    if (typeof currency !== "string" || !currency.trim()) {
      throw new Error(MESSAGES.CURRENCY_REQUIRED);
    }

    const bodyKey = request.body.idempotencyKey ?? request.body["idempotency-key"];
    const idempotencyKey =
      typeof bodyKey === "string" && bodyKey.trim() !== ""
        ? bodyKey.trim()
        : undefined;

    const result = await this.depositUseCase.execute({
      userId,
      amount,
      currency,
      idempotencyKey,
    });

    response.status(HttpStatus.CREATED).json(result);
  };

  withdraw = async (request: Request, response: Response): Promise<void> => {
    const userId = response.locals.userId as string | undefined;

    if (!userId) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const { amount, currency } = request.body;

    if (amount === undefined || amount === null || typeof amount !== "number") {
      throw new Error(MESSAGES.INVALID_WITHDRAWAL_AMOUNT);
    }

    if (typeof currency !== "string" || !currency.trim()) {
      throw new Error(MESSAGES.CURRENCY_REQUIRED);
    }

    const bodyKey = request.body.idempotencyKey ?? request.body["idempotency-key"];
    const idempotencyKey =
      typeof bodyKey === "string" && bodyKey.trim() !== ""
        ? bodyKey.trim()
        : undefined;

    const result = await this.withdrawUseCase.execute({
      userId,
      amount,
      currency,
      idempotencyKey,
    });

    response.status(HttpStatus.CREATED).json(result);
  };

  transfer = async (request: Request, response: Response): Promise<void> => {
    const senderUserId = response.locals.userId as string | undefined;

    if (!senderUserId) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const { amount, currency, recipientUserId } = request.body;

    if (amount === undefined || amount === null || typeof amount !== "number") {
      throw new Error(MESSAGES.INVALID_TRANSFER_AMOUNT);
    }

    if (typeof currency !== "string" || !currency.trim()) {
      throw new Error(MESSAGES.CURRENCY_REQUIRED);
    }

    if (
      recipientUserId === undefined ||
      recipientUserId === null ||
      typeof recipientUserId !== "string" ||
      !recipientUserId.trim()
    ) {
      throw new Error(MESSAGES.RECIPIENT_USER_ID_REQUIRED);
    }

    const bodyKey = request.body.idempotencyKey ?? request.body["idempotency-key"];
    const idempotencyKey =
      typeof bodyKey === "string" && bodyKey.trim() !== ""
        ? bodyKey.trim()
        : undefined;

    const result = await this.transferUseCase.execute({
      senderUserId,
      recipientUserId: recipientUserId.trim(),
      amount,
      currency,
      idempotencyKey,
    });

    response.status(HttpStatus.CREATED).json(result);
  };

  getHistory = async (request: Request, response: Response): Promise<void> => {
    const authUserId = response.locals.userId as string | undefined;

    const requestedUserId =
      typeof request.params.userId === "string" && request.params.userId.trim() !== ""
        ? request.params.userId.trim()
        : typeof request.query.userId === "string" && request.query.userId.trim() !== ""
          ? request.query.userId.trim()
          : authUserId;

    if (!requestedUserId) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const page =
      typeof request.query.page === "string" && !isNaN(Number(request.query.page))
        ? parseInt(request.query.page, 10)
        : undefined;

    const limit =
      typeof request.query.limit === "string" && !isNaN(Number(request.query.limit))
        ? parseInt(request.query.limit, 10)
        : undefined;

    const type =
      typeof request.query.type === "string" &&
      ["deposit", "withdrawal", "transfer"].includes(request.query.type)
        ? (request.query.type as "deposit" | "withdrawal" | "transfer")
        : undefined;

    const result = await this.getTransactionHistoryUseCase.execute({
      userId: requestedUserId,
      page,
      limit,
      type,
    });

    response.status(HttpStatus.OK).json(result);
  };
}
