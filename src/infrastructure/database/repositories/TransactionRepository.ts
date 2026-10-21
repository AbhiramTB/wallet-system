
import { injectable } from "tsyringe";
import { Op } from "sequelize";
import type { Transaction as SequelizeTransaction } from "sequelize";

import type {
  CreateTransactionInput,
  Transaction,
} from "../../../domain/entities/Transaction.js";

import type { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository.js";
import { TransactionModel } from "../models/TransactionModel.js";

function toTransaction(doc: TransactionModel): Transaction {
  return {
    transactionId: doc.transactionId,
    idempotencyKey: doc.idempotencyKey,
    type: doc.type,
    status: doc.status,

    fromWalletId:
      doc.fromWalletId != null ? String(doc.fromWalletId) : undefined,

    toWalletId:
      doc.toWalletId != null ? String(doc.toWalletId) : undefined,

    amount: Number(doc.amount),
    currency: doc.currency,

    originalAmount: doc.originalAmount
      ? {
          amount: Number(doc.originalAmount.amount),
          currency: doc.originalAmount.currency,
        }
      : undefined,

    exchangeRate:
      doc.exchangeRate != null
        ? Number(doc.exchangeRate)
        : undefined,

    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

@injectable()
export class TransactionRepository
  implements ITransactionRepository
{
  constructor(
    private readonly session: SequelizeTransaction | null = null
  ) {}

  async save(
    transaction: CreateTransactionInput,
  ): Promise<Transaction> {
    const document = await TransactionModel.create(
      {
        transactionId: transaction.transactionId,
        idempotencyKey: transaction.idempotencyKey,
        type: transaction.type,
        status: transaction.status ?? "pending",

        fromWalletId: transaction.fromWalletId
          ? Number(transaction.fromWalletId)
          : null,

        toWalletId: transaction.toWalletId
          ? Number(transaction.toWalletId)
          : null,

        amount: transaction.amount,
        currency: transaction.currency,
        originalAmount: transaction.originalAmount ?? null,
        exchangeRate: transaction.exchangeRate ?? null,
      },
      {
        ...(this.session && { transaction: this.session }),
      },
    );

    return toTransaction(document);
  }

  async findByTransactionId(
    id: string,
  ): Promise<Transaction | null> {
    const document = await TransactionModel.findOne({
      where: { transactionId: id },
      ...(this.session && { transaction: this.session }),
    });

    return document ? toTransaction(document) : null;
  }

  async findByIdempotencyKey(
    key: string,
  ): Promise<Transaction | null> {
    const document = await TransactionModel.findOne({
      where: { idempotencyKey: key },
      ...(this.session && { transaction: this.session }),
    });

    return document ? toTransaction(document) : null;
  }

  async getTodayDepositsTotal(
    walletId: string,
    startOfDay: Date,
  ): Promise<number> {
    const id = Number(walletId);

    if (!Number.isSafeInteger(id) || id <= 0) return 0;

    const total = await TransactionModel.sum("amount", {
      where: {
        toWalletId: id,
        type: "deposit",
        status: "completed",
        createdAt: { [Op.gte]: startOfDay },
      },
      ...(this.session && { transaction: this.session }),
    });

    return Number(total ?? 0);
  }

  async getTodayWithdrawalsTotal(
    walletId: string,
    startOfDay: Date,
  ): Promise<number> {
    const id = Number(walletId);

    if (!Number.isSafeInteger(id) || id <= 0) return 0;

    const total = await TransactionModel.sum("amount", {
      where: {
        fromWalletId: id,
        type: "withdrawal",
        status: "completed",
        createdAt: { [Op.gte]: startOfDay },
      },
      ...(this.session && { transaction: this.session }),
    });

    return Number(total ?? 0);
  }

  async getTodayTransfersTotal(
    walletId: string,
    startOfDay: Date,
  ): Promise<number> {
    const id = Number(walletId);

    if (!Number.isSafeInteger(id) || id <= 0) return 0;

    const total = await TransactionModel.sum("amount", {
      where: {
        fromWalletId: id,
        type: "transfer",
        status: "completed",
        createdAt: { [Op.gte]: startOfDay },
      },
      ...(this.session && { transaction: this.session }),
    });

    return Number(total ?? 0);
  }

  async getTodayTransactionCount(
    walletId: string,
    startOfDay: Date,
  ): Promise<number> {
    const id = Number(walletId);

    if (!Number.isSafeInteger(id) || id <= 0) return 0;

    return TransactionModel.count({
      where: {
        [Op.or]: [
          { fromWalletId: id },
          { toWalletId: id },
        ],
        createdAt: { [Op.gte]: startOfDay },
      },
      ...(this.session && { transaction: this.session }),
    });
  }

  async findByWalletId(
    walletId: string,
    options?: { limit?: number; skip?: number },
  ): Promise<Transaction[]> {
    const id = Number(walletId);

    if (!Number.isSafeInteger(id) || id <= 0) return [];

    const documents = await TransactionModel.findAll({
      where: {
        [Op.or]: [
          { fromWalletId: id },
          { toWalletId: id },
        ],
      },
      order: [["createdAt", "DESC"]],
      ...(options?.skip !== undefined && options.skip > 0
        ? { offset: options.skip }
        : {}),
      ...(options?.limit !== undefined && options.limit > 0
        ? { limit: options.limit }
        : {}),
      ...(this.session && { transaction: this.session }),
    });

    return documents.map(toTransaction);
  }

  async countByWalletId(walletId: string): Promise<number> {
    const id = Number(walletId);

    if (!Number.isSafeInteger(id) || id <= 0) return 0;

    return TransactionModel.count({
      where: {
        [Op.or]: [
          { fromWalletId: id },
          { toWalletId: id },
        ],
      },
      ...(this.session && { transaction: this.session }),
    });
  }
}
