import mongoose, { type HydratedDocument, type Model, Schema } from "mongoose";

import type { WalletStatus } from "../../../domain/entities/Wallet.js";

export interface WalletPersistence {
  userId: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  preferredCurrency: string;
  status: WalletStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type WalletDocument = HydratedDocument<WalletPersistence>;

const walletSchema = new Schema<WalletPersistence>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    preferredCurrency: {
      type: String,
      required: true,
      default: "USD",
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "frozen", "closed"],
      default: "active",
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

const existingWalletModel = mongoose.models.Wallet as Model<WalletPersistence> | undefined;

export const WalletModel: Model<WalletPersistence> =
  existingWalletModel ?? mongoose.model<WalletPersistence>("Wallet", walletSchema);
