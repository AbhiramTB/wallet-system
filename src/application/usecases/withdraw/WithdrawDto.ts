import type { Transaction } from "../../../domain/entities/Transaction.js";
import type { Wallet } from "../../../domain/entities/Wallet.js";

export interface WithdrawDto {
  userId: string;
  amount: number;
  currency: string;
  idempotencyKey?: string | undefined;
}

export interface WithdrawResponseDto {
  transaction: Transaction;
  wallet: Wallet;
}
