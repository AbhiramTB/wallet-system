import type { NextFunction, Request, Response } from "express";

import { container } from "../../container/container.js";
import { DI_TOKENS } from "../../container/tokens.js";
import type { ITokenService } from "../../application/interfaces/ITokenService.js";
import { MESSAGES } from "../../constants/messages.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error(MESSAGES.NO_TOKEN_PROVIDED);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error(MESSAGES.NO_TOKEN_PROVIDED);
  }

  const tokenService = container.resolve<ITokenService>(DI_TOKENS.TOKEN_SERVICE);
  const decoded = tokenService.verifyAccessToken(token);

  if (!decoded) {
    throw new Error(MESSAGES.INVALID_TOKEN);
  }

  res.locals.userId = decoded.user || decoded.userId || decoded.id;
  next();
};
