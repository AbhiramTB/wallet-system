import type { UpdateExchangeRatesDto } from "./UpdateExchangeRatesDto.js";

export interface IUpdateExchangeRatesUseCase {
  execute(
    dtoOrBaseCurrency?: UpdateExchangeRatesDto | string,
  ): Promise<Record<string, number>>;
}
