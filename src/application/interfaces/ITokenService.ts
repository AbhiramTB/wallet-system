import type { JwtPayload } from "jsonwebtoken";

export type { JwtPayload };

export interface ITokenService {
  generateAccessToken(userId: string, role: string): string;
  verifyAccessToken(token: string): JwtPayload | null;
}
