export interface Money {
  amount: number;
  currency: string;
}

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "transfer";

export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

export interface ITransaction {
  transactionId: string;
  idempotencyKey: string;

  type: TransactionType;
  status: TransactionStatus;

  fromWalletId?: string;
  toWalletId?: string;

  amount: number;
  currency: string;

  originalAmount?: Money;
  exchangeRate?: number;

  createdAt: Date;
  updatedAt: Date;
}

export type Transaction = ITransaction;

export interface CreateTransactionInput {
  transactionId: string;
  idempotencyKey: string;
  type: TransactionType;
  status?: TransactionStatus;
  fromWalletId?: string;
  toWalletId?: string;
  amount: number;
  currency: string;
  originalAmount?: Money;
  exchangeRate?: number;
}
