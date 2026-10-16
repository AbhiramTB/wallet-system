import type { TransferDto, TransferResponseDto } from "./TransferDto.js";

export interface ITransferUseCase {
  execute(dto: TransferDto): Promise<TransferResponseDto>;
}
