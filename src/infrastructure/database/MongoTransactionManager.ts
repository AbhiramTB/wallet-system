import { injectable } from "tsyringe";
import  { type ITransactionManager, type TransactionContext } from "../../application/interfaces/ITransactionManager.js";
import mongoose from "mongoose";
import { WalletRepository } from "./repositories/WalletRepository.js";
import { TransactionRepository } from "./repositories/TransactionRepository.js";


 
@injectable()

export class MongTransactionManager implements ITransactionManager{
    async execute<T>(callback: (context: TransactionContext) => Promise<T>): Promise<T> {
      const session = await  mongoose.startSession();

      try{

       let result! :T;

      await session.withTransaction(async()=>{
    const context = this.createTransactionContext(session);
    result = await callback(context)
       });

       return result;


      }finally{
        await session.endSession()
      }
         




    }

          private createTransactionContext(
  session: mongoose.ClientSession
): TransactionContext {
  return {
    wallets: new WalletRepository(session),
    transactions: new TransactionRepository(session),
  };
}

}