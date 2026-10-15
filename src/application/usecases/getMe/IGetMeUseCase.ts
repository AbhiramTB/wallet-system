import type { GetMeResponseDto } from "./GetMeDto.js";

export interface IGetMeUseCase {
  execute(userId: string): Promise<GetMeResponseDto>;
}
