import type { WithdrawDto, WithdrawResponseDto } from "./WithdrawDto.js";

export interface IWithdrawUseCase {
  execute(dto: WithdrawDto): Promise<WithdrawResponseDto>;
}
