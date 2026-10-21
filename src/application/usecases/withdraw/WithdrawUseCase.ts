import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { MESSAGES } from "../../../constants/messages.js";
import { TRANSACTION_LIMITS } from "../../../constants/transaction.js";
import { env } from "../../../utils/env.js";
import { generateTransactionIdentifiers } from "../../../utils/transactionIdentifiers.js";
import type { IWalletRepository } from "../../../domain/repositories/IWalletRepository.js";
import type { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository.js";
import type { IGetExchangeRatesUseCase } from "../getExchangeRates/IGetExchangeRatesUseCase.js";
import type { IValidateFraudUseCase } from "../validateFraud/IValidateFraudUseCase.js";
import type { ITransactionManager } from "../../interfaces/ITransactionManager.js";
import type { IWithdrawUseCase } from "./IWithdrawUseCase.js";
import type { WithdrawDto, WithdrawResponseDto } from "./WithdrawDto.js";


@injectable()
export class WithdrawUseCase implements IWithdrawUseCase {
  constructor(
    @inject(DI_TOKENS.walletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(DI_TOKENS.transactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @inject(DI_TOKENS.getExchangeRatesUseCase)
    private readonly getExchangeRatesUseCase: IGetExchangeRatesUseCase,
    @inject(DI_TOKENS.validateFraudUseCase)
    private readonly validateFraudUseCase: IValidateFraudUseCase,
    @inject(DI_TOKENS.transactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(dto: WithdrawDto): Promise<WithdrawResponseDto> {
    if (typeof dto.amount !== "number" || isNaN(dto.amount) || dto.amount <= 0) {
      throw new Error(MESSAGES.INVALID_WITHDRAWAL_AMOUNT);
    }

    if (!dto.currency || typeof dto.currency !== "string" || !dto.currency.trim()) {
      throw new Error(MESSAGES.CURRENCY_REQUIRED);
    }

    const withdrawalCurrency = dto.currency.trim().toUpperCase();

    // Check if user is already flagged for suspicious/fraudulent activity
    await this.validateFraudUseCase.execute({ userId: dto.userId });

    // Idempotency check: if already exists return existing transaction & wallet
    if (dto.idempotencyKey) {
      const existingTx = await this.transactionRepository.findByIdempotencyKey(
        dto.idempotencyKey,
      );
      if (existingTx && existingTx.fromWalletId) {
        const existingWallet = await this.walletRepository.findById(existingTx.fromWalletId);
        if (existingWallet) {
          return { transaction: existingTx, wallet: existingWallet };
        }
      }
    }

    // Step 1: Fetch user wallet
    const wallet = await this.walletRepository.findByUserId(dto.userId);

    if (!wallet) {
      throw new Error(MESSAGES.WALLET_NOT_FOUND);
    }

    const baseCurrency = (wallet.currency || env.DEFAULT_BASE_CURRENCY).trim().toUpperCase();

    // Step 2: Convert withdrawal amount into wallet base currency
    let convertedAmount = dto.amount;
    let exchangeRate = 1;

    if (withdrawalCurrency !== baseCurrency) {
      const rates = await this.getExchangeRatesUseCase.execute(withdrawalCurrency);
      const rate = rates[baseCurrency];

      if (typeof rate !== "number") {
        throw new Error(MESSAGES.CURRENCY_NOT_SUPPORTED);
      }

      exchangeRate = rate;
      convertedAmount = Number((dto.amount * rate).toFixed(2));
    }

    // Step 3: Check for sufficient balance
    if (wallet.balance < convertedAmount) {
      throw new Error(MESSAGES.INSUFFICIENT_FUNDS);
    }

    // Step 4: Check daily transaction count
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayTxCount = await this.transactionRepository.getTodayTransactionCount(
      wallet.id,
      startOfDay,
    );

    if (todayTxCount >= TRANSACTION_LIMITS.MAX_DAILY_TRANSACTION_COUNT) {
      throw new Error(MESSAGES.DAILY_TRANSACTION_LIMIT_EXCEEDED);
    }

    // Step 5: Check single withdrawal limit
    if (convertedAmount > TRANSACTION_LIMITS.MAX_SINGLE_WITHDRAWAL_LIMIT) {
      throw new Error(MESSAGES.WITHDRAWAL_EXCEEDS_SINGLE_LIMIT);
    }

    // Step 6: Check daily withdrawal limit
    const todayWithdrawalsTotal = await this.transactionRepository.getTodayWithdrawalsTotal(
      wallet.id,
      startOfDay,
    );

    if (todayWithdrawalsTotal + convertedAmount > TRANSACTION_LIMITS.MAX_DAILY_WITHDRAWAL_LIMIT) {
      throw new Error(MESSAGES.WITHDRAWAL_EXCEEDS_DAILY_LIMIT);
    }

    const { transactionId, idempotencyKey } = generateTransactionIdentifiers(dto.idempotencyKey);

    return this.transactionManager.execute(async (context) => {
      
      const updatedWallet = await context.wallets.updateBalance(wallet.id, -convertedAmount);
      if (!updatedWallet) {
        throw new Error(MESSAGES.INSUFFICIENT_FUNDS);
      }

      const transaction = await context.transactions.save({

        transactionId,
        idempotencyKey,
        type: "withdrawal",
        status: "completed",
        fromWalletId: wallet.id,
        amount: convertedAmount,
        currency: baseCurrency,
        originalAmount: {
          amount: dto.amount,
          currency: withdrawalCurrency,
        },
        exchangeRate,
      });

      return { transaction, wallet: updatedWallet };
    });
  }
}
