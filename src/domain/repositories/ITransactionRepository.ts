import type { CreateTransactionInput, Transaction } from "../entities/Transaction.js";

export interface ITransactionRepository {
  save(transaction: CreateTransactionInput): Promise<Transaction>;
  findByTransactionId(transactionId: string): Promise<Transaction | null>;
  findByIdempotencyKey(key: string): Promise<Transaction | null>;
  getTodayDepositsTotal(walletId: string, startOfDay: Date): Promise<number>;
  getTodayWithdrawalsTotal(walletId: string, startOfDay: Date): Promise<number>;
  getTodayTransfersTotal(walletId: string, startOfDay: Date): Promise<number>;
  getTodayTransactionCount(walletId: string, startOfDay: Date): Promise<number>;
  findByWalletId(walletId: string): Promise<Transaction[]>;
  countByWalletId(walletId: string): Promise<number>;
}
