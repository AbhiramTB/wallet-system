
import { injectable } from "tsyringe";
import type { Transaction } from "sequelize";

import type {
  CreateUserInput,
  User,
} from "../../../domain/entities/User.js";

import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { UserModel } from "../models/UserModel.js";

function toUser(document: UserModel): User {
  return {
    id: document.id.toString(),
    username: document.username,
    email: document.email,
    password: document.password,
    createdAt: document.createdAt,
  };
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
 private readonly session: Transaction | null  = null,
  ) {}

  async save(user: CreateUserInput): Promise<User> {
    const newUser = await UserModel.create(
      {
        email: user.email,
        password: user.password,
        username: user.username,
      },
      {
        ...(this.session && { transaction: this.session }),
      },
    );

    return toUser(newUser);
  }

  async findById(id: string): Promise<User | null> {
    const userId = Number(id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return null;
    }

    const user = await UserModel.findByPk(userId, {
      ...(this.session && { transaction: this.session }),
    });

    return user ? toUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      where: { email },
      ...(this.session && { transaction: this.session }),
    });

    return user ? toUser(user) : null;
  }
}
