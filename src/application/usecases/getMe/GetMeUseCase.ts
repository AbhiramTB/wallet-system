import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { sanitizeUser } from "../../../utils/sanitizeUser.js";
import { MESSAGES } from "../../../constants/messages.js";
import type { IGetMeUseCase } from "./IGetMeUseCase.js";
import type { GetMeResponseDto } from "./GetMeDto.js";

@injectable()
export class GetMeUseCase implements IGetMeUseCase {
  constructor(
    @inject(DI_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<GetMeResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    return {
      user: sanitizeUser(user),
    };
  }
}
