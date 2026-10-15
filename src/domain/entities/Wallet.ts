export type WalletStatus = "active" | "inactive" | "frozen" | "closed";

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  preferredCurrency: string;
  status: WalletStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWalletInput {
  userId: string;
  balance?: number;
  currency?: string;
  preferredCurrency?: string;
  status?: WalletStatus;
}
