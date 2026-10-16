export interface FraudCheckResultDto {
  isFraud: boolean;
  attemptsCount?: number | undefined;
  reason?: string | undefined;
}

export interface ValidateFraudInputDto {
  userId?: string | undefined;
  fraudCheckResult?: FraudCheckResultDto | undefined;
}
