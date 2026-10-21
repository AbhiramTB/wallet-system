import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { MESSAGES } from "../../../constants/messages.js";
import type { IWalletRepository } from "../../../domain/repositories/IWalletRepository.js";
import type { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository.js";
import type { Transaction } from "../../../domain/entities/Transaction.js";
import type { IGetTransactionHistoryUseCase } from "./IGetTransactionHistoryUseCase.js";
import type {
  FormattedTransactionHistoryItem,
  GetTransactionHistoryDto,
  TransactionDirection,
  TransactionHistoryResponseDto,
} from "./GetTransactionHistoryDto.js";

@injectable()
export class GetTransactionHistoryUseCase implements IGetTransactionHistoryUseCase {
  constructor(
    @inject(DI_TOKENS.walletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(DI_TOKENS.transactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(dto: GetTransactionHistoryDto): Promise<TransactionHistoryResponseDto> {
    if (!dto.userId || typeof dto.userId !== "string" || !dto.userId.trim()) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const userId = dto.userId.trim();

    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new Error(MESSAGES.WALLET_NOT_FOUND);
    }

    const rawTransactions = await this.transactionRepository.findByWalletId(wallet.id);

    const totalTransactions = await this.transactionRepository.countByWalletId(wallet.id);

    const formattedTransactions: FormattedTransactionHistoryItem[] = rawTransactions.map(
      (tx: Transaction) => {
        let direction: TransactionDirection;

        if (tx.type === "deposit") {
          direction = "credit";
        } else if (tx.type === "withdrawal") {
          direction = "debit";
        } else if (tx.type === "transfer") {
          if (tx.toWalletId === wallet.id) {
            direction = "credit";
          } else {
            direction = "debit";
          }
        } else {
          direction = tx.toWalletId === wallet.id ? "credit" : "debit";
        }

        return {
          transactionId: tx.transactionId,
          idempotencyKey: tx.idempotencyKey,
          type: tx.type,
          direction,
          amount: tx.amount,
          currency: tx.currency,
          status: tx.status,
          timestamp: tx.createdAt,
          fromWalletId: tx.fromWalletId,
          toWalletId: tx.toWalletId,
          originalAmount: tx.originalAmount,
          exchangeRate: tx.exchangeRate,
        };
      },
    );

    return {
      userId,
      walletId: wallet.id,
      balance: wallet.balance,
      currency: wallet.currency,
      totalTransactions,
      transactions: formattedTransactions,
    };
  }
}
