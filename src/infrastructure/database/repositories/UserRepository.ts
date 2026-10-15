import { isValidObjectId } from "mongoose";
import { injectable } from "tsyringe";

import type { CreateUserInput, User } from "../../../domain/entities/User.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { UserModel, type UserDocument } from "../models/UserModel.js";

function toUser(document: UserDocument): User {
  return {
    id: document._id.toString(),
    username: document.username,
    email: document.email,
    password: document.password,
    createdAt: document.createdAt,
  };
}

@injectable()
export class UserRepository implements IUserRepository {
  async save(user: CreateUserInput): Promise<User> {
    const document = await UserModel.create(user);

    return toUser(document);
  }

  async findById(id: string): Promise<User | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const document = await UserModel.findById(id).exec();

    return document ? toUser(document) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await UserModel.findOne({ email: email.toLowerCase() }).exec();

    return document ? toUser(document) : null;
  }
}
