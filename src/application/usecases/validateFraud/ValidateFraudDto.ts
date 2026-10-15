import type { CheckFraudResultDto } from "../checkFraud/CheckFraudDto.js";

export interface ValidateFraudInputDto {
  fraudCheckResult: CheckFraudResultDto;
}
