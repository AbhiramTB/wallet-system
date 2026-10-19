import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository.js";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import type { IWalletRepository } from "../../domain/repositories/IWalletRepository.js";

export interface TransactionContext {
  users: IUserRepository;
  wallets: IWalletRepository;
  transactions: ITransactionRepository;
}

export interface ITransactionManager {
  execute<T>(callback: (context: TransactionContext) => Promise<T>): Promise<T>;
}
