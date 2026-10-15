import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { injectable } from "tsyringe";

import type { ITokenService } from "../../application/interfaces/ITokenService.js";
import { env } from "../../utils/env.js";

@injectable()
export class TokenService implements ITokenService {
  private accessTokenSecret = env.ACCESS_TOKEN_SECRET;

  generateAccessToken(userId: string, role: string): string {
    const expiresIn = (env.JWT_EXPIRES_IN || "1d") as NonNullable<SignOptions["expiresIn"]>;

    return jwt.sign({ [role]: userId }, this.accessTokenSecret, {
      expiresIn,
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret);
      if (typeof decoded === "string") {
        return null;
      }
      return decoded;
    } catch {
      return null;
    }
  }


}
