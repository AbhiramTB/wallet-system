import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { DI_TOKENS } from "../../container/tokens.js";
import type { ISignInUseCase } from "../../application/usecases/signIn/ISignInUseCase.js";
import type { SignInDto } from "../../application/usecases/signIn/SignInDto.js";
import type { ISignUpUseCase } from "../../application/usecases/signUp/ISignUpUseCase.js";
import type { SignUpDto } from "../../application/usecases/signUp/SignUpDto.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";

import { MESSAGES } from "../../constants/messages.js";
import { HttpStatus } from "../../constants/httpStatus.js";

@injectable()
export class UserController {
  constructor(
    @inject(DI_TOKENS.SIGN_UP_USE_CASE)
    private readonly signUpUseCase: ISignUpUseCase,
    @inject(DI_TOKENS.SIGN_IN_USE_CASE)
    private readonly signInUseCase: ISignInUseCase,
  ) {}

  signUp = async (request: Request, response: Response): Promise<void> => {
    const { username, email, password } = request.body 

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      throw new Error(MESSAGES.USERNAME_EMAIL_PASSWORD_REQUIRED);
    }

    if (password.length < 8) {
      throw new Error(MESSAGES.PASSWORD_MIN_LENGTH);
    }

          const dto: SignUpDto = { email,password,username };

    const user = await this.signUpUseCase.execute(dto);

    response.status(HttpStatus.CREATED).json({ user: sanitizeUser(user) });
  };


  

  signIn = async (request: Request, response: Response): Promise<void> => {
    const { email, password } = request.body 

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      throw new Error(MESSAGES.EMAIL_PASSWORD_REQUIRED);
    }

    const dto: SignInDto = { email,password };

    const result = await this.signInUseCase.execute(dto);

    response.status(HttpStatus.OK).json(result);
  };
  


}
