import type { GetBalanceInputDto, GetBalanceOutputDto } from "./GetBalanceDto.js";

export interface IGetBalanceUseCase {
  execute(dto: GetBalanceInputDto): Promise<GetBalanceOutputDto>;
}
