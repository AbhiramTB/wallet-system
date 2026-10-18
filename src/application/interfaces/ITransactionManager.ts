import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository.js";
import type { IWalletRepository } from "../../domain/repositories/IWalletRepository.js";

export interface TransactionContext {
  wallets: IWalletRepository;
  transactions: ITransactionRepository;
}

export interface ITransactionManager{
    execute<T>(
        callback:(session:TransactionContext)=>Promise<T>,
    ):Promise<T>
    
}
