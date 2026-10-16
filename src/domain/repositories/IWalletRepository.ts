import type { CreateWalletInput, Wallet } from "../entities/Wallet.js";

export interface IWalletRepository {
  save(wallet: CreateWalletInput): Promise<Wallet>;
  findById(id: string): Promise<Wallet | null>;
  findByUserId(userId: string): Promise<Wallet | null>;
  updateBalance(walletId: string, amount: number): Promise<Wallet | null>;
}
