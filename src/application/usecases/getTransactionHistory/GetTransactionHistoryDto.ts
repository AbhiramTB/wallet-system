import type {
  Money,
  TransactionStatus,
  TransactionType,
} from "../../../domain/entities/Transaction.js";

export type TransactionDirection = "credit" | "debit";

export interface GetTransactionHistoryDto {
  userId: string;
}

export interface FormattedTransactionHistoryItem {
  transactionId: string;
  idempotencyKey: string;
  type: TransactionType;
  direction: TransactionDirection;
  amount: number;
  currency: string;
  status: TransactionStatus;
  timestamp: Date;
  fromWalletId?: string | undefined;
  toWalletId?: string | undefined;
  originalAmount?: Money | undefined;
  exchangeRate?: number | undefined;
}

export interface TransactionHistoryResponseDto {
  userId: string;
  walletId: string;
  balance: number;
  currency: string;
  totalTransactions: number;
  transactions: FormattedTransactionHistoryItem[];
}
