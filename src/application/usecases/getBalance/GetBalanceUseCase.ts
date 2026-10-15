import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { MESSAGES } from "../../../constants/messages.js";
import { EXCHANGE_RATES } from "../../../constants/exchangeRates.js";
import { env } from "../../../utils/env.js";
import type { ICacheService } from "../../interfaces/ICacheService.js";
import type { IExchangeRateService } from "../../interfaces/IExchangeRateService.js";
import type { IWalletRepository } from "../../../domain/repositories/IWalletRepository.js";
import type { IGetBalanceUseCase } from "./IGetBalanceUseCase.js";
import type { GetBalanceInputDto, GetBalanceOutputDto } from "./GetBalanceDto.js";

@injectable()
export class GetBalanceUseCase implements IGetBalanceUseCase {
  constructor(
    @inject(DI_TOKENS.walletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(DI_TOKENS.cacheService)
    private readonly cacheService: ICacheService,
    @inject(DI_TOKENS.exchangeRateService)
    private readonly exchangeRateService: IExchangeRateService,
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

    const rates = await this.getRatesForBaseCurrency(baseCurrency);
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


  private async getRatesForBaseCurrency(baseCurrency: string): Promise<Record<string, number>> {
    const cacheKey = `${EXCHANGE_RATES.CACHE_KEY}:${baseCurrency}`;

    try {
      const cached = await this.cacheService.get(cacheKey);

      console.log('cachesss------------');
      console.log(cached);
      if (cached) {
        return JSON.parse(cached) as Record<string, number>;
      }
    } catch {
    }

    const rates = await this.exchangeRateService.getRates(baseCurrency);
     console.log(rates);
      console.log('rates------------');

    try {
      await this.cacheService.set(cacheKey, JSON.stringify(rates), env.CURRENCY_CACHE_TTL);
    } catch {
    }

    return rates;
  }
}
