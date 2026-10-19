import { isValidObjectId, type ClientSession } from "mongoose";
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
  constructor(private readonly session: ClientSession | undefined = undefined) {}

  async save(user: CreateUserInput): Promise<User> {
    const document = new UserModel(user);
    await document.save(this.session ? { session: this.session } : undefined);

    return toUser(document);
  }

  async findById(id: string): Promise<User | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const query = UserModel.findById(id);
    if (this.session) {
      query.session(this.session);
    }
    const document = await query.exec();

    return document ? toUser(document) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    if (this.session) {
      query.session(this.session);
    }
    const document = await query.exec();

    return document ? toUser(document) : null;
  }
}
