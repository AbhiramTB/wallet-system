import { container } from "tsyringe";

import type { IPasswordService } from "../application/interfaces/IPasswordService.js";
import type { ITokenService } from "../application/interfaces/ITokenService.js";
import type { ISignInUseCase } from "../application/usecases/signIn/ISignInUseCase.js";
import { SignInUseCase } from "../application/usecases/signIn/SignInUseCase.js";
import type { ISignUpUseCase } from "../application/usecases/signUp/ISignUpUseCase.js";
import { SignUpUseCase } from "../application/usecases/signUp/SignUpUseCase.js";
import type { IGetMeUseCase } from "../application/usecases/getMe/IGetMeUseCase.js";
import { GetMeUseCase } from "../application/usecases/getMe/GetMeUseCase.js";
import type { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { UserRepository } from "../infrastructure/database/repositories/UserRepository.js";
import { PasswordService } from "../infrastructure/services/PasswordService.js";
import { TokenService } from "../infrastructure/services/TokenService.js";
import { DI_TOKENS } from "./tokens.js";


container.registerSingleton<IUserRepository>(DI_TOKENS.USER_REPOSITORY, UserRepository);
container.registerSingleton<IPasswordService>(DI_TOKENS.PASSWORD_SERVICE, PasswordService);
container.registerSingleton<ITokenService>(DI_TOKENS.TOKEN_SERVICE, TokenService);
container.registerSingleton<ISignUpUseCase>(DI_TOKENS.SIGN_UP_USE_CASE, SignUpUseCase);
container.registerSingleton<ISignInUseCase>(DI_TOKENS.SIGN_IN_USE_CASE, SignInUseCase);
container.registerSingleton<IGetMeUseCase>(DI_TOKENS.GET_ME_USE_CASE, GetMeUseCase);

export { DI_TOKENS } from "./tokens.js";
export { container };
