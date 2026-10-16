import type { AddFraudInputDto, AddFraudResultDto } from "./AddFraudDto.js";

export interface IAddFraudUseCase {
  execute(dto: AddFraudInputDto): Promise<AddFraudResultDto>;
}
