import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { MESSAGES } from "../../../constants/messages.js";
import { TRANSACTION_LIMITS } from "../../../constants/transaction.js";
import { env } from "../../../utils/env.js";
import { generateTransactionIdentifiers } from "../../../utils/transactionIdentifiers.js";
import type { IWalletRepository } from "../../../domain/repositories/IWalletRepository.js";
import type { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository.js";
import type { IGetExchangeRatesUseCase } from "../getExchangeRates/IGetExchangeRatesUseCase.js";
import type { IAddFraudUseCase } from "../addFraud/IAddFraudUseCase.js";
import type { IValidateFraudUseCase } from "../validateFraud/IValidateFraudUseCase.js";
import type { IDepositUseCase } from "./IDepositUseCase.js";
import type { DepositDto, DepositResponseDto } from "./DepositDto.js";
import type { ITransactionManager } from "../../interfaces/ITransactionManager.js";

@injectable()
export class DepositUseCase implements IDepositUseCase {
  constructor(
    @inject(DI_TOKENS.walletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(DI_TOKENS.transactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @inject(DI_TOKENS.getExchangeRatesUseCase)
    private readonly getExchangeRatesUseCase: IGetExchangeRatesUseCase,
    @inject(DI_TOKENS.addFraudUseCase)
    private readonly addFraudUseCase: IAddFraudUseCase,
    @inject(DI_TOKENS.validateFraudUseCase)
    private readonly validateFraudUseCase: IValidateFraudUseCase,

        @inject(DI_TOKENS.transactionManager)

    private readonly transactionManager: ITransactionManager 
  ) {}

  async execute(dto: DepositDto): Promise<DepositResponseDto> {
    if (typeof dto.amount !== "number" || isNaN(dto.amount) || dto.amount <= 0) {
      throw new Error(MESSAGES.INVALID_AMOUNT);
    }

    if (!dto.currency || typeof dto.currency !== "string" || !dto.currency.trim()) {
      throw new Error(MESSAGES.CURRENCY_REQUIRED);
    }

    const depositCurrency = dto.currency.trim().toUpperCase();

    // Check if user is already flagged for fraud
    await this.validateFraudUseCase.execute({ userId: dto.userId });

    // Idempotency check: if already exists return existing transaction & wallet
    if (dto.idempotencyKey) {
      const existingTx = await this.transactionRepository.findByIdempotencyKey(
        dto.idempotencyKey,
      );
      if (existingTx && existingTx.toWalletId) {
        const existingWallet = await this.walletRepository.findById(existingTx.toWalletId);
        if (existingWallet) {
          return { transaction: existingTx, wallet: existingWallet };
        }
      }
    }

    // Step 3: Fetch user wallet
    const wallet = await this.walletRepository.findByUserId(dto.userId);
    if (!wallet) {
      throw new Error(MESSAGES.WALLET_NOT_FOUND);
    }

    const baseCurrency = (wallet.currency || env.DEFAULT_BASE_CURRENCY).trim().toUpperCase();

    // Step 4: Convert deposit amount into wallet base currency
    let convertedAmount = dto.amount;
    let exchangeRate = 1;

    if (depositCurrency !== baseCurrency) {
      const rates = await this.getExchangeRatesUseCase.execute(depositCurrency);
      const rate = rates[baseCurrency];

      if (typeof rate !== "number") {
        throw new Error(MESSAGES.CURRENCY_NOT_SUPPORTED);
      }

      exchangeRate = rate;
      convertedAmount = Number((dto.amount * rate).toFixed(2));
    }

    // Record / check high-value deposit fraud attempt
    const fraudCheckResult = await this.addFraudUseCase.execute({
      userId: dto.userId,
      amountInBaseCurrency: convertedAmount,
    });
    await this.validateFraudUseCase.execute({ fraudCheckResult });

    // Step 6: Check daily transaction count
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayTxCount = await this.transactionRepository.getTodayTransactionCount(
      wallet.id,
      startOfDay,
    );

    if (todayTxCount >= TRANSACTION_LIMITS.MAX_DAILY_TRANSACTION_COUNT) {
      throw new Error(MESSAGES.DAILY_TRANSACTION_LIMIT_EXCEEDED);
    }

    // Step 7: Check if deposit is greater than max value of single deposit
    if (convertedAmount > TRANSACTION_LIMITS.MAX_SINGLE_DEPOSIT_LIMIT) {
      throw new Error(MESSAGES.DEPOSIT_EXCEEDS_SINGLE_LIMIT);
    }

    // Step 8: Check user today total deposit of the user
    const todayDepositsTotal = await this.transactionRepository.getTodayDepositsTotal(
      wallet.id,
      startOfDay,
    );

    if (todayDepositsTotal + convertedAmount > TRANSACTION_LIMITS.MAX_DAILY_DEPOSIT_LIMIT) {
      throw new Error(MESSAGES.DEPOSIT_EXCEEDS_DAILY_LIMIT);
    }

    const { transactionId, idempotencyKey } = generateTransactionIdentifiers(dto.idempotencyKey);

 /// calling  transaction  calss

    const result = await this.transactionManager.execute(async(context)=>{

    const updatedWallet = await context.wallets.updateBalance(wallet.id, convertedAmount);
    if (!updatedWallet) {
      throw new Error(MESSAGES.WALLET_NOT_FOUND);
    }

    const transaction = await context.transactions.save({
      transactionId,
      idempotencyKey,
      type: "deposit",
      status: "completed",
      toWalletId: wallet.id,
      amount: convertedAmount,
      currency: baseCurrency,
      originalAmount: {
        amount: dto.amount,
        currency: depositCurrency,
      },
      exchangeRate,
    });

       
  return {
      transaction,
      wallet: updatedWallet,
    };


    })

    
return{
  transaction:result.transaction,
  wallet:result.wallet
}
   
  }
}
