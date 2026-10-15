import type { Wallet } from "../../../domain/entities/Wallet.js";
import type { CreateWalletDto } from "./CreateWalletDto.js";

export interface ICreateWalletUseCase {
  execute(dto: CreateWalletDto): Promise<Wallet>;
}
