import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import type { User } from "../../../domain/entities/User.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { IPasswordService } from "../../interfaces/IPasswordService.js";
import type { ITransactionManager } from "../../interfaces/ITransactionManager.js";
import type { ISignUpUseCase } from "./ISignUpUseCase.js";
import type { SignUpDto } from "./SignUpDto.js";
import { MESSAGES } from "../../../constants/messages.js";

@injectable()
export class SignUpUseCase implements ISignUpUseCase {
  constructor(
    @inject(DI_TOKENS.userRepository)
    private readonly userRepository: IUserRepository,
    @inject(DI_TOKENS.passwordService)
    private readonly passwordService: IPasswordService,
    @inject(DI_TOKENS.transactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(dto: SignUpDto): Promise<User> {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error(MESSAGES.EMAIL_ALREADY_IN_USE);
    }

    const password = await this.passwordService.hash(dto.password);

    return this.transactionManager.execute(async (context) => {
      const user = await context.users.save({
        username: dto.username.trim(),
        email,
        password,
      });

      await context.wallets.save({
        userId: user.id,
        balance: 0,
        currency: "INR",
        preferredCurrency: "USD",
        status: "active",
      });

      return user;
    });
  }
}
