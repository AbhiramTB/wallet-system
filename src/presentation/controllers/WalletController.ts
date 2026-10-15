import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../container/tokens.js";
import { MESSAGES } from "../../constants/messages.js";
import { HttpStatus } from "../../constants/httpStatus.js";
import type { IGetBalanceUseCase } from "../../application/usecases/getBalance/IGetBalanceUseCase.js";

@injectable()
export class WalletController {
  constructor(
    @inject(DI_TOKENS.getBalanceUseCase)
    private readonly getBalanceUseCase: IGetBalanceUseCase,
  ) {}

  getBalance = async (request: Request, response: Response): Promise<void> => {
    const userId = response.locals.userId as string | undefined;

    if (!userId) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const currency =
      typeof request.query.currency === "string" && request.query.currency.trim() !== ""
        ? request.query.currency.trim()
        : undefined;

    const result = await this.getBalanceUseCase.execute({
      userId,
      currency,
    });

    response.status(HttpStatus.OK).json(result);
  };
}
