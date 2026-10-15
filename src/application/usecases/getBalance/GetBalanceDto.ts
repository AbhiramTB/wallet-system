export interface GetBalanceInputDto {
  userId: string;
  currency?: string | undefined;
}

export interface GetBalanceOutputDto {
  walletId: string;
  userId: string;
  balance: number;
  currency: string;
  walletCurrency: string;
  exchangeRate: number;
}
