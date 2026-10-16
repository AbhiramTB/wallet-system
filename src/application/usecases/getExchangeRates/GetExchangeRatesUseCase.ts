import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { EXCHANGE_RATES } from "../../../constants/exchangeRates.js";
import { env } from "../../../utils/env.js";
import type { ICacheService } from "../../interfaces/ICacheService.js";
import type { IExchangeRateService } from "../../interfaces/IExchangeRateService.js";
import type { IGetExchangeRatesUseCase } from "./IGetExchangeRatesUseCase.js";

@injectable()
export class GetExchangeRatesUseCase implements IGetExchangeRatesUseCase {
  constructor(
    @inject(DI_TOKENS.cacheService)
    private readonly cacheService: ICacheService,
    @inject(DI_TOKENS.exchangeRateService)
    private readonly exchangeRateService: IExchangeRateService,
  ) {}

  async execute(currency: string): Promise<Record<string, number>> {
    const normalizedCurrency = currency.trim().toUpperCase();
    const cacheKey = `${EXCHANGE_RATES.CACHE_KEY}:${normalizedCurrency}`;

    try {
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as Record<string, number>;
      }
    } catch {
    }

    const rates = await this.exchangeRateService.getRates(normalizedCurrency);

    try {
      const ttl = env.CURRENCY_CACHE_TTL || 86400;
      await this.cacheService.set(cacheKey, JSON.stringify(rates), ttl);
    } catch {
    }

    return rates;
  }
}
