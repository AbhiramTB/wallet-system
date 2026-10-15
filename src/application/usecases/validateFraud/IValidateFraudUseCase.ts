import type { ValidateFraudInputDto } from "./ValidateFraudDto.js";

export interface IValidateFraudUseCase {
  execute(dto: ValidateFraudInputDto): void;
}
