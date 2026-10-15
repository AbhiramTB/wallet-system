import { injectable } from "tsyringe";
import type { ICacheService } from "../../application/interfaces/ICacheService.js";
import { redisClient } from "../config/redis.js";

@injectable()
export class RedisCacheService implements ICacheService {
  async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await redisClient.set(key, value, "EX", ttlSeconds);
    } else {
      await redisClient.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }
}

export { RedisCacheService as RedisService };