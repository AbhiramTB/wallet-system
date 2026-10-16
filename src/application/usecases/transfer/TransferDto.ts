import type { Transaction } from "../../../domain/entities/Transaction.js";
import type { Wallet } from "../../../domain/entities/Wallet.js";

export interface TransferDto {
  senderUserId: string;
  recipientUserId: string;
  amount: number;
  currency: string;
  idempotencyKey?: string | undefined;
}

export interface TransferResponseDto {
  transaction: Transaction;
  senderWallet: Wallet;
  recipientWallet: Wallet;
}
