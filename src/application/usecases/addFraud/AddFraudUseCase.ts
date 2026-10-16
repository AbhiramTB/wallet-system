import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { FRAUD_CONFIG } from "../../../constants/fraud.js";
import { MESSAGES } from "../../../constants/messages.js";
import type { ICacheService } from "../../interfaces/ICacheService.js";
import type { IAddFraudUseCase } from "./IAddFraudUseCase.js";
import type { AddFraudInputDto, AddFraudResultDto } from "./AddFraudDto.js";

@injectable()
export class AddFraudUseCase implements IAddFraudUseCase {
  constructor(
    @inject(DI_TOKENS.cacheService)
    private readonly cacheService: ICacheService,
  ) {}

  async execute(dto: AddFraudInputDto): Promise<AddFraudResultDto> {
    const cacheKey = `${FRAUD_CONFIG.CACHE_KEY_PREFIX}:${dto.userId}`;

    if (dto.amountInBaseCurrency < FRAUD_CONFIG.MIN_DEPOSIT_AMOUNT) {
      return { isFraud: false };
    }

    let currentAttempts = 0;
    try {
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        currentAttempts = Number(cached) || 0;
      }
    } catch {
      currentAttempts = 0;
    }

    const newAttempts = currentAttempts + 1;

    try {
      if (currentAttempts > 0) {
        await this.cacheService.delete(cacheKey);
      }
      await this.cacheService.set(
        cacheKey,
        String(newAttempts),
        FRAUD_CONFIG.TIME_WINDOW_SECONDS,
      );
    } catch {
      // Ignore cache write failure
    }

    if (newAttempts >= FRAUD_CONFIG.MAX_ATTEMPTS) {
      return {
        isFraud: true,
        attemptsCount: newAttempts,
        reason: MESSAGES.FRAUD_SUSPECTED_HIGH_DEPOSITS,
      };
    }

    return {
      isFraud: false,
      attemptsCount: newAttempts,
    };
  }
}
