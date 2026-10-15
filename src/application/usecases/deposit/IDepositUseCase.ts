import type { DepositDto, DepositResponseDto } from "./DepositDto.js";

export interface IDepositUseCase {
  execute(dto: DepositDto): Promise<DepositResponseDto>;
}
