import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { env } from "../../../utils/env.js";
import type { ICacheService } from "../../interfaces/ICacheService.js";
import type { IExchangeRateService } from "../../interfaces/IExchangeRateService.js";
import type { IUpdateExchangeRatesUseCase } from "./IUpdateExchangeRatesUseCase.js";
import type { UpdateExchangeRatesDto } from "./UpdateExchangeRatesDto.js";

@injectable()
export class UpdateExchangeRatesUseCase implements IUpdateExchangeRatesUseCase {
  constructor(
    @inject(DI_TOKENS.exchangeRateService)
    private readonly exchangeRateService: IExchangeRateService,
    @inject(DI_TOKENS.cacheService)
    private readonly cacheService: ICacheService,
  ) {}

  async execute(
    dtoOrBaseCurrency?: UpdateExchangeRatesDto | string,
  ): Promise<Record<string, number>> {
    const baseCurrency = (
      typeof dtoOrBaseCurrency === "string"
        ? dtoOrBaseCurrency
        : dtoOrBaseCurrency?.baseCurrency || env.DEFAULT_BASE_CURRENCY
    )
      .trim()
      .toUpperCase();

    const ttlSeconds =
      typeof dtoOrBaseCurrency === "object" && dtoOrBaseCurrency?.ttlSeconds !== undefined
        ? dtoOrBaseCurrency.ttlSeconds
        : env.DEFAULT_TTL_SECONDS;

    const rates = await this.exchangeRateService.getRates(baseCurrency);

    const cacheKey = `exchange_rates:${baseCurrency}`;
    await this.cacheService.set(cacheKey, JSON.stringify(rates), ttlSeconds);

    return rates;
  }
}
