
import { injectable } from "tsyringe";
import type { Transaction } from "sequelize";

import { sequelize } from "../config/db.js";

import type {
  ITransactionManager,
  TransactionContext,
} from "../../application/interfaces/ITransactionManager.js";

import { UserRepository } from "./repositories/UserRepository.js";
import { WalletRepository } from "./repositories/WalletRepository.js";
import { TransactionRepository } from "./repositories/TransactionRepository.js";

@injectable()
export class SequelizeTransactionManager implements ITransactionManager {

  async execute<T>(
    callback: (context: TransactionContext) => Promise<T>,
  ): Promise<T> {

    return sequelize.transaction(async (transaction) => {

      const context = this.createTransactionContext(transaction);

      const result = await callback(context);

      return result;
      
    });
  }

  private createTransactionContext(
    transaction: Transaction,
  ): TransactionContext {
    return {
      users: new UserRepository(transaction),
      wallets: new WalletRepository(transaction),
      transactions: new TransactionRepository(transaction),
    };
  }
}
