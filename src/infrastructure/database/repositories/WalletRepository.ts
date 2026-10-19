import { isValidObjectId, type ClientSession } from "mongoose";
import { injectable } from "tsyringe";

import type { CreateWalletInput, Wallet } from "../../../domain/entities/Wallet.js";
import type { IWalletRepository } from "../../../domain/repositories/IWalletRepository.js";
import { WalletModel, type WalletDocument } from "../models/WalletModel.js";

function toWallet(document: WalletDocument): Wallet {
  return {
    id: document._id.toString(),
    userId: document.userId.toString(),
    balance: document.balance,
    currency: document.currency,
    preferredCurrency: document.preferredCurrency,
    status: document.status,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

@injectable()
export class WalletRepository implements IWalletRepository {
  constructor(private readonly session: ClientSession | undefined = undefined) {}

  async save(wallet: CreateWalletInput): Promise<Wallet> {
    const document = new WalletModel(wallet);
    await document.save(this.session ? { session: this.session } : undefined);

    return toWallet(document);
  }

  async findById(id: string): Promise<Wallet | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const query = WalletModel.findById(id);
    if (this.session) {
      query.session(this.session);
    }
    const document = await query.exec();

    return document ? toWallet(document) : null;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    if (!isValidObjectId(userId)) {
      return null;
    }

    const query = WalletModel.findOne({ userId });
    if (this.session) {
      query.session(this.session);
    }
    const document = await query.exec();

    return document ? toWallet(document) : null;
  }

  async updateBalance(walletId: string, amount: number): Promise<Wallet | null> {
    if (!isValidObjectId(walletId)) {
      return null;
    }

    const filter: Record<string, unknown> = { _id: walletId };
    if (amount < 0) {
      filter.balance = { $gte: Math.abs(amount) };
    }

    const document = await WalletModel.findOneAndUpdate(
      filter,
      { $inc: { balance: amount } },
      {
        new: true,
        ...(this.session && { session: this.session }),
      },
    ).exec();

    return document ? toWallet(document) : null;
  }
}
