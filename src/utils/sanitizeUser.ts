import type { User } from "../domain/entities/User.js";

export type SanitizedUser = Omit<User, "password">;

export function sanitizeUser(user: User): SanitizedUser {
  const { password: _password, ...safeUser } = user;

  return safeUser;
}
