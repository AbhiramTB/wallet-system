import mongoose from "mongoose";
import { injectable } from "tsyringe";

import type {
  ITransactionManager,
  TransactionContext,
} from "../../application/interfaces/ITransactionManager.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { WalletRepository } from "./repositories/WalletRepository.js";
import { TransactionRepository } from "./repositories/TransactionRepository.js";

@injectable()
export class MongoTransactionManager implements ITransactionManager {
  async execute<T>(callback: (context: TransactionContext) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();

    try {
      let result!: T;

      await session.withTransaction(async () => {
        result = await callback(this.createTransactionContext(session));
      });

      return result;
    } finally {
      await session.endSession();
    }
  }

  private createTransactionContext(session: mongoose.ClientSession): TransactionContext {
    return {
      users: new UserRepository(session),
      wallets: new WalletRepository(session),
      transactions: new TransactionRepository(session),
    };
  }
}
