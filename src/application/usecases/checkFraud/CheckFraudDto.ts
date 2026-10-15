export interface CheckFraudInputDto {
  userId: string;
  amountInBaseCurrency: number;
}

export interface CheckFraudResultDto {
  isFraud: boolean;
  reason?: string | undefined;
  attemptsCount?: number | undefined;
}
