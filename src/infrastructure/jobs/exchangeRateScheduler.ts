import { exchangeRateQueue } from "../queue/exchangeRateQueue.js";

export async function scheduleExchangeRateUpdates(): Promise<void> {
  await exchangeRateQueue.upsertJobScheduler(
    "exchange-rate-scheduler",
    {
      every: 24 * 60 * 60 * 1000, // 24 
      // every: 10 * 1000, // 10 s (testing)
    },
    {
      name: "update-exchange-rates",
      data: {},
    },
  );

  await exchangeRateQueue.add(
    "update-exchange-rates",
    {},
    {
      removeOnComplete: true,
      removeOnFail: true,
    },
  );
}