import type { WalletStatus } from "../../../domain/entities/Wallet.js";

export interface CreateWalletDto {
  userId: string;
  balance?: number;
  currency?: string;
  preferredCurrency?: string;
  status?: WalletStatus;
}
