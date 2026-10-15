import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { FRAUD_CONFIG } from "../../../constants/fraud.js";
import { MESSAGES } from "../../../constants/messages.js";
import type { ICacheService } from "../../interfaces/ICacheService.js";
import type { ICheckFraudUseCase } from "./ICheckFraudUseCase.js";
import type { CheckFraudInputDto, CheckFraudResultDto } from "./CheckFraudDto.js";

@injectable()
export class CheckFraudUseCase implements ICheckFraudUseCase {
  constructor(
    @inject(DI_TOKENS.cacheService)
    private readonly cacheService: ICacheService,
  ) {}

  async checkIfAlreadyFlagged(userId: string): Promise<CheckFraudResultDto> {
    const cacheKey = `${FRAUD_CONFIG.CACHE_KEY_PREFIX}:${userId}`;

    try {
      const cached = await this.cacheService.get(cacheKey);
      if (cached && Number(cached) >= FRAUD_CONFIG.MAX_ATTEMPTS) {
        return {
          isFraud: true,
          attemptsCount: Number(cached),
          reason: MESSAGES.FRAUD_SUSPECTED_HIGH_DEPOSITS,
        };
      }
    } catch {
    }

    return { isFraud: false };
  }

  async execute(dto: CheckFraudInputDto): Promise<CheckFraudResultDto> {
    const cacheKey = `${FRAUD_CONFIG.CACHE_KEY_PREFIX}:${dto.userId}`;

    const alreadyFlagged = await this.checkIfAlreadyFlagged(dto.userId);
    if (alreadyFlagged.isFraud) {
      return alreadyFlagged;
    }

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
