export interface IExchangeRateService {
  getRates(baseCurrency: string): Promise<Record<string, number>>;
  findExchangeRates?(baseCurrency: string): Promise<Record<string, number>>;
}