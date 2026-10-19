import mongoose, { type ClientSession } from "mongoose";
import { injectable } from "tsyringe";

import type {
  CreateTransactionInput,
  Transaction,
} from "../../../domain/entities/Transaction.js";
import type { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository.js";
import {
  TransactionModel,
  type TransactionDocument,
} from "../models/TransactionModel.js";

function toTransaction(doc: TransactionDocument): Transaction {
  return {
    transactionId: doc.transactionId,
    idempotencyKey: doc.idempotencyKey,
    type: doc.type,
    status: doc.status,
    fromWalletId: doc.fromWalletId ? doc.fromWalletId.toString() : undefined,
    toWalletId: doc.toWalletId ? doc.toWalletId.toString() : undefined,
    amount: doc.amount,
    currency: doc.currency,
    originalAmount: doc.originalAmount
      ? {
          amount: doc.originalAmount.amount,
          currency: doc.originalAmount.currency,
        }
      : undefined,
    exchangeRate: doc.exchangeRate ?? undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

@injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly session: ClientSession | undefined = undefined) {}
  
 async save(transaction: CreateTransactionInput): Promise<Transaction> {
  const document = new TransactionModel({
    transactionId: transaction.transactionId,
    idempotencyKey: transaction.idempotencyKey,
    type: transaction.type,
    status: transaction.status ?? "pending",
    fromWalletId: transaction.fromWalletId
      ? new mongoose.Types.ObjectId(transaction.fromWalletId)
      : null,
    toWalletId: transaction.toWalletId
      ? new mongoose.Types.ObjectId(transaction.toWalletId)
      : null,
    amount: transaction.amount,
    currency: transaction.currency,
    originalAmount: transaction.originalAmount ?? null,
    exchangeRate: transaction.exchangeRate ?? null,
  });

  await document.save(
    this.session ? { session: this.session } : undefined,
  );

  return toTransaction(document);
}

  async findByTransactionId(transactionId: string): Promise<Transaction | null> {
    const query = TransactionModel.findOne({ transactionId });
    if (this.session) {
      query.session(this.session);
    }
    const document = await query.exec();
    return document ? toTransaction(document) : null;
  }

  async findByIdempotencyKey(key: string): Promise<Transaction | null> {
    const query = TransactionModel.findOne({ idempotencyKey: key });
    if (this.session) {
      query.session(this.session);
    }
    const document = await query.exec();
    return document ? toTransaction(document) : null;
  }

  async getTodayDepositsTotal(walletId: string, startOfDay: Date): Promise<number> {
    if (!mongoose.isValidObjectId(walletId)) {
      return 0;
    }

    const result = await TransactionModel.aggregate<{ total: number }>([
      {
        $match: {
          toWalletId: new mongoose.Types.ObjectId(walletId),
          type: "deposit",
          status: "completed",
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total ?? 0;
  }

  async getTodayWithdrawalsTotal(walletId: string, startOfDay: Date): Promise<number> {
    if (!mongoose.isValidObjectId(walletId)) {
      return 0;
    }

    const result = await TransactionModel.aggregate<{ total: number }>([
      {
        $match: {
          fromWalletId: new mongoose.Types.ObjectId(walletId),
          type: "withdrawal",
          status: "completed",
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total ?? 0;
  }

  async getTodayTransfersTotal(walletId: string, startOfDay: Date): Promise<number> {
    if (!mongoose.isValidObjectId(walletId)) {
      return 0;
    }

    const result = await TransactionModel.aggregate<{ total: number }>([
      {
        $match: {
          fromWalletId: new mongoose.Types.ObjectId(walletId),
          type: "transfer",
          status: "completed",
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total ?? 0;
  }

  async getTodayTransactionCount(walletId: string, startOfDay: Date): Promise<number> {
    if (!mongoose.isValidObjectId(walletId)) {
      return 0;
    }

    const objId = new mongoose.Types.ObjectId(walletId);
    return TransactionModel.countDocuments({
      $or: [{ fromWalletId: objId }, { toWalletId: objId }],
      createdAt: { $gte: startOfDay },
    }).exec();
  }

  async findByWalletId(
    walletId: string,
    options?: { limit?: number | undefined; skip?: number | undefined },
  ): Promise<Transaction[]> {
    if (!mongoose.isValidObjectId(walletId)) {
      return [];
    }

    const objId = new mongoose.Types.ObjectId(walletId);
    let query = TransactionModel.find({
      $or: [{ fromWalletId: objId }, { toWalletId: objId }],
    }).sort({ createdAt: -1 });

    if (options?.skip !== undefined && options.skip > 0) {
      query = query.skip(options.skip);
    }
    if (options?.limit !== undefined && options.limit > 0) {
      query = query.limit(options.limit);
    }

    const documents = await query.exec();
    return documents.map(toTransaction);
  }

  async countByWalletId(walletId: string): Promise<number> {
    if (!mongoose.isValidObjectId(walletId)) {
      return 0;
    }

    const objId = new mongoose.Types.ObjectId(walletId);
    return TransactionModel.countDocuments({
      $or: [{ fromWalletId: objId }, { toWalletId: objId }],
    }).exec();
  }
}
