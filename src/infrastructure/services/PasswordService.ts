import bcrypt from "bcrypt";
import { injectable } from "tsyringe";

import type { IPasswordService } from "../../application/interfaces/IPasswordService.js";


@injectable()
export class PasswordService implements IPasswordService {

  async hash(password: string): Promise<string> {
    const SALT_ROUNDS = 12;

    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
