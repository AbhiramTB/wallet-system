import type { CheckFraudInputDto, CheckFraudResultDto } from "./CheckFraudDto.js";

export interface ICheckFraudUseCase {
  execute(dto: CheckFraudInputDto): Promise<CheckFraudResultDto>;
  checkIfAlreadyFlagged(userId: string): Promise<CheckFraudResultDto>;
}
