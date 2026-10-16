export const FRAUD_CONFIG = {
  MIN_DEPOSIT_AMOUNT: 25_000,
  MAX_ATTEMPTS: 3,
  TIME_WINDOW_SECONDS: 5 * 60, //  (5 minutes)
  FLAG_TIME_SECONDS: 5 * 60,   // (5 minutes)
  CACHE_KEY_PREFIX: "fraud:high-deposit",
} as const;
