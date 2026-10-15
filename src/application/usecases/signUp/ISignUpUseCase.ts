import type { User } from "../../../domain/entities/User.js";
import type { SignUpDto } from "./SignUpDto.js";

export interface ISignUpUseCase {
  execute(dto: SignUpDto): Promise<User>;
}
