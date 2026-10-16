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
import type { ITransferUseCase } from "./ITransferUseCase.js";
import type { TransferDto, TransferResponseDto } from "./TransferDto.js";

@injectable()
export class TransferUseCase implements ITransferUseCase {
  constructor(
    @inject(DI_TOKENS.walletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(DI_TOKENS.transactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @inject(DI_TOKENS.getExchangeRatesUseCase)
    private readonly getExchangeRatesUseCase: IGetExchangeRatesUseCase,
    @inject(DI_TOKENS.validateFraudUseCase)
    private readonly validateFraudUseCase: IValidateFraudUseCase,
  ) {}

  async execute(dto: TransferDto): Promise<TransferResponseDto> {
    if (typeof dto.amount !== "number" || isNaN(dto.amount) || dto.amount <= 0) {
      throw new Error(MESSAGES.INVALID_TRANSFER_AMOUNT);
    }

    if (!dto.currency || typeof dto.currency !== "string" || !dto.currency.trim()) {
      throw new Error(MESSAGES.CURRENCY_REQUIRED);
    }

    if (!dto.senderUserId || typeof dto.senderUserId !== "string" || !dto.senderUserId.trim()) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    if (!dto.recipientUserId || typeof dto.recipientUserId !== "string" || !dto.recipientUserId.trim()) {
      throw new Error(MESSAGES.RECIPIENT_USER_ID_REQUIRED);
    }

    const senderUserId = dto.senderUserId.trim();
    const recipientUserId = dto.recipientUserId.trim();

    if (senderUserId === recipientUserId) {
      throw new Error(MESSAGES.CANNOT_TRANSFER_TO_SELF);
    }

    const transferCurrency = dto.currency.trim().toUpperCase();

    await this.validateFraudUseCase.execute({ userId: senderUserId });

    if (dto.idempotencyKey) {
      const existingTx = await this.transactionRepository.findByIdempotencyKey(
        dto.idempotencyKey,
      );
      if (existingTx && existingTx.fromWalletId && existingTx.toWalletId) {
        const existingSenderWallet = await this.walletRepository.findById(existingTx.fromWalletId);
        const existingRecipientWallet = await this.walletRepository.findById(existingTx.toWalletId);
        if (existingSenderWallet && existingRecipientWallet) {
          return {
            transaction: existingTx,
            senderWallet: existingSenderWallet,
            recipientWallet: existingRecipientWallet,
          };
        }
      }
    }

    const senderWallet = await this.walletRepository.findByUserId(senderUserId);
    if (!senderWallet) {
      throw new Error(MESSAGES.WALLET_NOT_FOUND);
    }

    const recipientWallet = await this.walletRepository.findByUserId(recipientUserId);
    if (!recipientWallet) {
      throw new Error(MESSAGES.RECIPIENT_WALLET_NOT_FOUND);
    }

    if (senderWallet.id === recipientWallet.id) {
      throw new Error(MESSAGES.CANNOT_TRANSFER_TO_SELF);
    }

    const senderBaseCurrency = (senderWallet.currency || env.DEFAULT_BASE_CURRENCY).trim().toUpperCase();

    let convertedAmount = dto.amount;
    let exchangeRate = 1;

    if (transferCurrency !== senderBaseCurrency) {
      const rates = await this.getExchangeRatesUseCase.execute(transferCurrency);
      const rate = rates[senderBaseCurrency];

      if (typeof rate !== "number") {
        throw new Error(MESSAGES.CURRENCY_NOT_SUPPORTED);
      }

      exchangeRate = rate;
      convertedAmount = Number((dto.amount * rate).toFixed(2));
    }

    if (senderWallet.balance < convertedAmount) {
      throw new Error(MESSAGES.INSUFFICIENT_FUNDS);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayTxCount = await this.transactionRepository.getTodayTransactionCount(
      senderWallet.id,
      startOfDay,
    );

    if (todayTxCount >= TRANSACTION_LIMITS.MAX_DAILY_TRANSACTION_COUNT) {
      throw new Error(MESSAGES.DAILY_TRANSACTION_LIMIT_EXCEEDED);
    }

    if (convertedAmount > TRANSACTION_LIMITS.MAX_SINGLE_TRANSFER_LIMIT) {
      throw new Error(MESSAGES.TRANSFER_EXCEEDS_SINGLE_LIMIT);
    }

    const todayTransfersTotal = await this.transactionRepository.getTodayTransfersTotal(
      senderWallet.id,
      startOfDay,
    );

    if (todayTransfersTotal + convertedAmount > TRANSACTION_LIMITS.MAX_DAILY_TRANSFER_LIMIT) {
      throw new Error(MESSAGES.TRANSFER_EXCEEDS_DAILY_LIMIT);
    }

    const recipientBaseCurrency = (recipientWallet.currency || env.DEFAULT_BASE_CURRENCY).trim().toUpperCase();
    let recipientAmount = convertedAmount;

    if (senderBaseCurrency !== recipientBaseCurrency) {
      const rates = await this.getExchangeRatesUseCase.execute(senderBaseCurrency);
      const rate = rates[recipientBaseCurrency];

      if (typeof rate !== "number") {
        throw new Error(MESSAGES.CURRENCY_NOT_SUPPORTED);
      }

      recipientAmount = Number((convertedAmount * rate).toFixed(2));
    }

    const updatedSenderWallet = await this.walletRepository.updateBalance(senderWallet.id, -convertedAmount);
    if (!updatedSenderWallet) {
      throw new Error(MESSAGES.INSUFFICIENT_FUNDS);
    }

    const updatedRecipientWallet = await this.walletRepository.updateBalance(recipientWallet.id, recipientAmount);
    if (!updatedRecipientWallet) {

      await this.walletRepository.updateBalance(senderWallet.id, convertedAmount);
      throw new Error(MESSAGES.RECIPIENT_WALLET_NOT_FOUND);
    }

    const { transactionId, idempotencyKey } = generateTransactionIdentifiers(dto.idempotencyKey);

    const transaction = await this.transactionRepository.save({
      transactionId,
      idempotencyKey,
      type: "transfer",
      status: "completed",
      fromWalletId: senderWallet.id,
      toWalletId: recipientWallet.id,
      amount: convertedAmount,
      currency: senderBaseCurrency,
      originalAmount: {
        amount: dto.amount,
        currency: transferCurrency,
      },
      exchangeRate,
    });

    return {
      transaction,
      senderWallet: updatedSenderWallet,
      recipientWallet: updatedRecipientWallet,
    };
  }
}
