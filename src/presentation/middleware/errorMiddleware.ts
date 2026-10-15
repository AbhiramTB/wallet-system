import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../constants/httpStatus.js";
import { MESSAGES } from "../../constants/messages.js";


export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);

  if (err instanceof Error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    return;
  }

  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
};
