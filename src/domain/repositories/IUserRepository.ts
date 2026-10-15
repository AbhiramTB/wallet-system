import type { CreateUserInput, User } from "../entities/User.js";

export interface IUserRepository {
  save(user: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
