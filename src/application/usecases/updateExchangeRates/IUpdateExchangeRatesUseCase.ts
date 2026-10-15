export interface IUpdateExchangeRatesUseCase {
  execute(): Promise<Record<string, number>>;
}
