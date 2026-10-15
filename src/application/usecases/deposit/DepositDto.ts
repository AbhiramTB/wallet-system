import type { Transaction } from "../../../domain/entities/Transaction.js";
import type { Wallet } from "../../../domain/entities/Wallet.js";

export interface DepositDto {
  userId: string;
  amount: number;
  currency: string;
  idempotencyKey?: string | undefined;
}

export interface DepositResponseDto {
  transaction: Transaction;
  wallet: Wallet;
}
