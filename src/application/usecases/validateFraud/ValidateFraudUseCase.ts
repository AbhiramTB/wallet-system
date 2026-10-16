import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../../container/tokens.js";
import { FRAUD_CONFIG } from "../../../constants/fraud.js";
import { MESSAGES } from "../../../constants/messages.js";
import type { ICacheService } from "../../interfaces/ICacheService.js";
import type { IValidateFraudUseCase } from "./IValidateFraudUseCase.js";
import type { FraudCheckResultDto, ValidateFraudInputDto } from "./ValidateFraudDto.js";

@injectable()
export class ValidateFraudUseCase implements IValidateFraudUseCase {
  constructor(
    @inject(DI_TOKENS.cacheService)
    private readonly cacheService: ICacheService,
  ) {}

  async checkIfAlreadyFlagged(userId: string): Promise<FraudCheckResultDto> {
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

  async execute(dto: ValidateFraudInputDto): Promise<void> {
    if (dto.userId) {
      const flaggedResult = await this.checkIfAlreadyFlagged(dto.userId);
      if (flaggedResult.isFraud) {
        throw new Error(
          flaggedResult.reason || MESSAGES.FRAUD_SUSPECTED_HIGH_DEPOSITS,
        );
      }
    }

    if (dto.fraudCheckResult?.isFraud) {
      throw new Error(
        dto.fraudCheckResult.reason || MESSAGES.FRAUD_SUSPECTED_HIGH_DEPOSITS,
      );
    }
  }
}
