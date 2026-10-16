export interface IGetExchangeRatesUseCase {
  execute(currency: string): Promise<Record<string, number>>;
}
