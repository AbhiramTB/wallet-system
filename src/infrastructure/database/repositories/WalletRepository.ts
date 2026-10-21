
import { injectable } from "tsyringe";
import { literal, Op } from "sequelize";
import type { Transaction } from "sequelize";

import type {
  CreateWalletInput,
  Wallet,
} from "../../../domain/entities/Wallet.js";

import type { IWalletRepository } from "../../../domain/repositories/IWalletRepository.js";
import { WalletModel } from "../models/WalletModel.js";

function toWallet(document: WalletModel): Wallet {
  return {
    id: document.id.toString(),
    userId: document.userId.toString(),
    balance: Number(document.balance),
    currency: document.currency,
    preferredCurrency: document.preferredCurrency,
    status: document.status,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

@injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    private readonly session: Transaction | null  = null,
  ) {}

  async save(wallet: CreateWalletInput): Promise<Wallet> {
    const document = await WalletModel.create(
      {
        balance: wallet.balance ?? 0,
        currency: wallet.currency ?? "INR",
        preferredCurrency: wallet.preferredCurrency ?? "INR",
        status: wallet.status ?? "active",
        userId: Number(wallet.userId),
      },
      {
        ...(this.session && { transaction: this.session }),
      },
    );

    return toWallet(document);
  }

  async findById(id: string): Promise<Wallet | null> {
    const walletId = Number(id);

    if (!Number.isSafeInteger(walletId) || walletId <= 0) {
      return null;
    }

    const document = await WalletModel.findByPk(walletId, {
      ...(this.session && { transaction: this.session }),
    });

    return document ? toWallet(document) : null;
  }

  async findByUserId(id: string): Promise<Wallet | null> {
    const userId = Number(id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return null;
    }

    const document = await WalletModel.findOne({
      where: { userId },
      ...(this.session && { transaction: this.session }),
    });

    return document ? toWallet(document) : null;
  }

  async updateBalance(
    walletId: string,
    amount: number,
  ): Promise<Wallet | null> {
    const id = Number(walletId);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      !Number.isFinite(amount)
    ) {
      return null;
    }

    const where: Record<string, unknown> = { id };

    if (amount < 0) {
      where.balance = {
        [Op.gte]: Math.abs(amount),
      };
    }

    const [affectedCount] = await WalletModel.update(
      {
        balance: literal(`balance + (${amount})`),
      },
      {
        where,
        ...(this.session && { transaction: this.session }),
      },
    );

    if (affectedCount === 0) {
      return null;
    }

    const document = await WalletModel.findByPk(id, {
      ...(this.session && { transaction: this.session }),
    });

    return document ? toWallet(document) : null;
  }
}
