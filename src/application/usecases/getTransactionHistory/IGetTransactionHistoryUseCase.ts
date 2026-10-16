import type {
  GetTransactionHistoryDto,
  TransactionHistoryResponseDto,
} from "./GetTransactionHistoryDto.js";

export interface IGetTransactionHistoryUseCase {
  execute(dto: GetTransactionHistoryDto): Promise<TransactionHistoryResponseDto>;
}
