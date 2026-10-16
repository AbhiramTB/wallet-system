export interface AddFraudInputDto {
  userId: string;
  amountInBaseCurrency: number;
}

export interface AddFraudResultDto {
  isFraud: boolean;
  attemptsCount?: number | undefined;
  reason?: string | undefined;
}
