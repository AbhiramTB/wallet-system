import type { Request, Response, NextFunction } from "express";
import { userPerMinuteLimiter } from "../../infrastructure/config/rateLimiter.js";
import { userPerHourLimiter } from "../../infrastructure/config/rateLimiter.js";

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId =  req.ip ;
    console.log('-----------------ip ip')
    console.log(req.ip)
      

    if (!userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    await userPerMinuteLimiter.consume(userId);
    
    await userPerHourLimiter.consume(userId);

    next();
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "msBeforeNext" in error
    ) {
      res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
      return;
    }

    next(error);
  }
};