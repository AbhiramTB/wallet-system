import { container } from "tsyringe";

import type { IPasswordService } from "../application/interfaces/IPasswordService.js";
import type { ITokenService } from "../application/interfaces/ITokenService.js";
import type { ISignInUseCase } from "../application/usecases/signIn/ISignInUseCase.js";
import { SignInUseCase } from "../application/usecases/signIn/SignInUseCase.js";
import type { ISignUpUseCase } from "../application/usecases/signUp/ISignUpUseCase.js";
import { SignUpUseCase } from "../application/usecases/signUp/SignUpUseCase.js";
import type { IGetMeUseCase } from "../application/usecases/getMe/IGetMeUseCase.js";
import { GetMeUseCase } from "../application/usecases/getMe/GetMeUseCase.js";
import type { IUpdateExchangeRatesUseCase } from "../application/usecases/updateExchangeRates/IUpdateExchangeRatesUseCase.js";
import { UpdateExchangeRatesUseCase } from "../application/usecases/updateExchangeRates/UpdateExchangeRatesUseCase.js";
import type { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { UserRepository } from "../infrastructure/database/repositories/UserRepository.js";
import type { ICacheService } from "../application/interfaces/ICacheService.js";
import type { IExchangeRateService } from "../application/interfaces/IExchangeRateService.js";
import { ExchangeRateService } from "../infrastructure/services/ExchangeRateService.js";
import { PasswordService } from "../infrastructure/services/PasswordService.js";
import { RedisCacheService } from "../infrastructure/services/RedisCacheService.js";
import { TokenService } from "../infrastructure/services/TokenService.js";
import { DI_TOKENS } from "./tokens.js";


container.registerSingleton<IUserRepository>(DI_TOKENS.userRepository, UserRepository);
container.registerSingleton<IPasswordService>(DI_TOKENS.passwordService, PasswordService);
container.registerSingleton<ITokenService>(DI_TOKENS.tokenService, TokenService);
container.registerSingleton<ICacheService>(DI_TOKENS.cacheService, RedisCacheService);
container.registerSingleton<IExchangeRateService>(DI_TOKENS.exchangeRateService, ExchangeRateService);
container.registerSingleton<ISignUpUseCase>(DI_TOKENS.signUpUseCase, SignUpUseCase);
container.registerSingleton<ISignInUseCase>(DI_TOKENS.signInUseCase, SignInUseCase);
container.registerSingleton<IGetMeUseCase>(DI_TOKENS.getMeUseCase, GetMeUseCase);
container.registerSingleton<IUpdateExchangeRatesUseCase>(
  DI_TOKENS.updateExchangeRatesUseCase,
  UpdateExchangeRatesUseCase,
);

export { DI_TOKENS } from "./tokens.js";
export { container };
