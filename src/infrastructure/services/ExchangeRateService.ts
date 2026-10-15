import { injectable } from "tsyringe";

import type { IExchangeRateService } from "../../application/interfaces/IExchangeRateService.js";
import { env } from "../../utils/env.js";

@injectable()
export class ExchangeRateService implements IExchangeRateService {
  async getRates(
    baseCurrency: string,
  ): Promise<Record<string, number>> {
    const response = await fetch(
      `${env.EXCHANGE_RATE_API_URL}/${baseCurrency.toUpperCase()}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = (await response.json()) as {
      result: string;
      rates: Record<string, number>;
    };

    if (data.result !== "success") {
      throw new Error("Failed to fetch exchange rates");
    }

    return data.rates;
  }

  async findExchangeRates(
    baseCurrency: string,
  ): Promise<Record<string, number>> {
    return this.getRates(baseCurrency);
  }
}
