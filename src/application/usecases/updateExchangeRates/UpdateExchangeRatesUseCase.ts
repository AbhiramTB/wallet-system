import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { env } from "../../../utils/env.js";
import { EXCHANGE_RATES } from "../../../constants/exchangeRates.js";
import type { ICacheService } from "../../interfaces/ICacheService.js";
import type { IExchangeRateService } from "../../interfaces/IExchangeRateService.js";
import type { IUpdateExchangeRatesUseCase } from "./IUpdateExchangeRatesUseCase.js";

@injectable()
export class UpdateExchangeRatesUseCase implements IUpdateExchangeRatesUseCase {
  constructor(
    @inject(DI_TOKENS.exchangeRateService)
    private readonly exchangeRateService: IExchangeRateService,
    @inject(DI_TOKENS.cacheService)
    private readonly cacheService: ICacheService,
  ) {}

  async execute(
  ): Promise<Record<string, number>> {

    const baseCurrency =  env.DEFAULT_BASE_CURRENCY;

    const ttlSeconds = env.CURRENCY_CACHE_TTL;

    const rates = await this.exchangeRateService.getRates(baseCurrency);

    const cacheKey = `${EXCHANGE_RATES.CACHE_KEY}:${baseCurrency}`;
    await this.cacheService.set(cacheKey, JSON.stringify(rates), ttlSeconds);

    return rates;
  }
}
