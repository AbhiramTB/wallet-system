import type { FraudCheckResultDto, ValidateFraudInputDto } from "./ValidateFraudDto.js";

export interface IValidateFraudUseCase {
  checkIfAlreadyFlagged(userId: string): Promise<FraudCheckResultDto>;
  execute(dto: ValidateFraudInputDto): Promise<void>;
}
