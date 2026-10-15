import mongoose, { type HydratedDocument, type Model, Schema } from "mongoose";

import type {
  Money,
  TransactionStatus,
  TransactionType,
} from "../../../domain/entities/Transaction.js";

export interface TransactionPersistence {
  transactionId: string;
  idempotencyKey: string;
  type: TransactionType;
  status: TransactionStatus;
  fromWalletId?: mongoose.Types.ObjectId | null;
  toWalletId?: mongoose.Types.ObjectId | null;
  amount: number;
  currency: string;
  originalAmount?: Money | null;
  exchangeRate?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionDocument = HydratedDocument<TransactionPersistence>;

const moneySchema = new Schema<Money>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
  },
  { _id: false },
);

const transactionSchema = new Schema<TransactionPersistence>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["deposit", "withdrawal", "transfer"],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
      trim: true,
      lowercase: true,
    },
    fromWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      default: null,
      index: true,
    },
    toWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      default: null,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    originalAmount: {
      type: moneySchema,
      default: null,
    },
    exchangeRate: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  { timestamps: true },
);

const existingTransactionModel = mongoose.models.Transaction as
  | Model<TransactionPersistence>
  | undefined;

export const TransactionModel: Model<TransactionPersistence> =
  existingTransactionModel ??
  mongoose.model<TransactionPersistence>("Transaction", transactionSchema);
