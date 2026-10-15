import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import type { User } from "../../../domain/entities/User.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { IPasswordService } from "../../interfaces/IPasswordService.js";
import type { ISignInUseCase } from "./ISignInUseCase.js";
import type { SignInDto, SignInResponseDto } from "./SignInDto.js";
import type { ITokenService } from "../../interfaces/ITokenService.js";
import { sanitizeUser } from "../../../utils/sanitizeUser.js";
import { MESSAGES } from "../../../constants/messages.js";

@injectable()
export class SignInUseCase implements ISignInUseCase {
  constructor(
    @inject(DI_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @inject(DI_TOKENS.PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,
    @inject(DI_TOKENS.TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email.trim().toLowerCase());

    if (!user || !(await this.passwordService.compare(dto.password, user.password))) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    const accessToken = this.tokenService.generateAccessToken(user.id, "user");

    return {
      user: sanitizeUser(user),
      accessToken,
    };
  }
}
