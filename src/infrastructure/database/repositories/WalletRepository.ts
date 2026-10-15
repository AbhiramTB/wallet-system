import { isValidObjectId } from "mongoose";
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
  async save(wallet: CreateWalletInput): Promise<Wallet> {
    const document = await WalletModel.create(wallet);

    return toWallet(document);
  }

  async findById(id: string): Promise<Wallet | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const document = await WalletModel.findById(id).exec();

    return document ? toWallet(document) : null;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    if (!isValidObjectId(userId)) {
      return null;
    }

    const document = await WalletModel.findOne({ userId }).exec();

    return document ? toWallet(document) : null;
  }
}
