import { injectable } from "tsyringe";

import { MESSAGES } from "../../../constants/messages.js";
import type { IValidateFraudUseCase } from "./IValidateFraudUseCase.js";
import type { ValidateFraudInputDto } from "./ValidateFraudDto.js";

@injectable()
export class ValidateFraudUseCase implements IValidateFraudUseCase {
  execute(dto: ValidateFraudInputDto): void {
    if (dto.fraudCheckResult.isFraud) {
      throw new Error(
        dto.fraudCheckResult.reason || MESSAGES.FRAUD_SUSPECTED_HIGH_DEPOSITS,
      );
    }
  }
}
