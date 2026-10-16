import crypto from "node:crypto";

export interface TransactionIdentifiers {
  transactionId: string;
  idempotencyKey: string;
}

export function generateTransactionIdentifiers(
  idempotencyKey?: string,
): TransactionIdentifiers {
  return {
    transactionId: crypto.randomUUID(),
    idempotencyKey: idempotencyKey?.trim() || crypto.randomUUID(),
  };
}

export function generateTransactionId(): string {
  return crypto.randomUUID();
}

export function resolveIdempotencyKey(key?: string): string {
  return key?.trim() || crypto.randomUUID();
}
