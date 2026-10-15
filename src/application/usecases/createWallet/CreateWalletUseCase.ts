import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import type { Wallet } from "../../../domain/entities/Wallet.js";
import type { IWalletRepository } from "../../../domain/repositories/IWalletRepository.js";
import type { ICreateWalletUseCase } from "./ICreateWalletUseCase.js";
import type { CreateWalletDto } from "./CreateWalletDto.js";

@injectable()
export class CreateWalletUseCase implements ICreateWalletUseCase {
  constructor(
    @inject(DI_TOKENS.walletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(dto: CreateWalletDto): Promise<Wallet> {
    const existingWallet = await this.walletRepository.findByUserId(dto.userId);

    if (existingWallet) {
      return existingWallet;
    }

    return this.walletRepository.save({
      userId: dto.userId,
      balance: dto.balance ?? 0,
      currency: dto.currency ?? "INR",
      preferredCurrency: dto.preferredCurrency ?? "USD",
      status: dto.status ?? "active",
    });
  }
}
