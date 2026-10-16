import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { MESSAGES } from "../../../constants/messages.js";
import { env } from "../../../utils/env.js";
import type { IWalletRepository } from "../../../domain/repositories/IWalletRepository.js";
import type { IGetExchangeRatesUseCase } from "../getExchangeRates/IGetExchangeRatesUseCase.js";
import type { IGetBalanceUseCase } from "./IGetBalanceUseCase.js";
import type { GetBalanceInputDto, GetBalanceOutputDto } from "./GetBalanceDto.js";

@injectable()
export class GetBalanceUseCase implements IGetBalanceUseCase {
  constructor(
    @inject(DI_TOKENS.walletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(DI_TOKENS.getExchangeRatesUseCase)
    private readonly getExchangeRatesUseCase: IGetExchangeRatesUseCase,
  ) {}

  async execute(dto: GetBalanceInputDto): Promise<GetBalanceOutputDto> {
    const wallet = await this.walletRepository.findByUserId(dto.userId);

    if (!wallet) {
      throw new Error(MESSAGES.WALLET_NOT_FOUND);
    }

    const baseCurrency = (wallet.currency || env.DEFAULT_BASE_CURRENCY).trim().toUpperCase();

    const targetCurrency = (
      dto.currency?.trim() ||
      wallet.currency ||
      wallet.preferredCurrency ||
      env.DEFAULT_BASE_CURRENCY
    )
      .trim()
      .toUpperCase();

    if (targetCurrency === baseCurrency) {
      return {
        walletId: wallet.id,
        userId: wallet.userId,
        balance: wallet.balance,
        currency: baseCurrency,
        walletCurrency: baseCurrency,
        exchangeRate: 1,
      };
    }

    const rates = await this.getExchangeRatesUseCase.execute(baseCurrency);
    const rate = rates[targetCurrency];

    if (typeof rate !== "number") {
      throw new Error(MESSAGES.CURRENCY_NOT_SUPPORTED);
    }

    const convertedBalance = Number((wallet.balance * rate).toFixed(2));

    return {
      walletId: wallet.id,
      userId: wallet.userId,
      balance: convertedBalance,
      currency: targetCurrency,
      walletCurrency: baseCurrency,
      exchangeRate: rate,
    };
  }
}
