import type { SignInDto, SignInResponseDto } from "./SignInDto.js";

export interface ISignInUseCase {
  execute(dto: SignInDto): Promise<SignInResponseDto>;
}
