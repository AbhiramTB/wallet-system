import type { User } from "../../../domain/entities/User.js";

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignInResponseDto {
  user: Omit<User, "password">;
  accessToken: string;
}
