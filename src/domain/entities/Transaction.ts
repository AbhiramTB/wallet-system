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

  fromWalletId?: string | undefined;
  toWalletId?: string | undefined;

  amount: number;
  currency: string;

  originalAmount?: Money | undefined;
  exchangeRate?: number | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export type Transaction = ITransaction;

export interface CreateTransactionInput {
  transactionId: string;
  idempotencyKey: string;
  type: TransactionType;
  status?: TransactionStatus | undefined;
  fromWalletId?: string | undefined;
  toWalletId?: string | undefined;
  amount: number;
  currency: string;
  originalAmount?: Money | undefined;
  exchangeRate?: number | undefined;
}
