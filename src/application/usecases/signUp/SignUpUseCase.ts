import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import type { User } from "../../../domain/entities/User.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { IPasswordService } from "../../interfaces/IPasswordService.js";
import type { ISignUpUseCase } from "./ISignUpUseCase.js";
import type { SignUpDto } from "./SignUpDto.js";
import type { ITokenService } from "../../interfaces/ITokenService.js";
import { MESSAGES } from "../../../constants/messages.js";

@injectable()
export class SignUpUseCase implements ISignUpUseCase {
  constructor(
    @inject(DI_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @inject(DI_TOKENS.PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(dto: SignUpDto): Promise<User> {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error(MESSAGES.EMAIL_ALREADY_IN_USE);
    }

    const password = await this.passwordService.hash(dto.password);

    return this.userRepository.save({
      username: dto.username.trim(),
      email,
      password,
    });
  }
  
}
