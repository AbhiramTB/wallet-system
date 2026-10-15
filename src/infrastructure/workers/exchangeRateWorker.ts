import { Worker, type Job } from "bullmq";
import { container } from "tsyringe";
import "../../container/container.js";
import { UpdateExchangeRatesUseCase } from "../../application/usecases/updateExchangeRates/UpdateExchangeRatesUseCase.js";
import { bullMqConnection } from "../config/redis.js";

export const exchangeRateWorker = new Worker(
  "exchange-rates",
  async (job: Job) => {
    console.log(`ExchangeRateWorker Processing job ${job.id} (${job.name})...`);
    const useCase = container.resolve(UpdateExchangeRatesUseCase);
    const rates = await useCase.execute();
    console.log(
      `ExchangeRateWorker Successfully updated exchange rates (${Object.keys(rates).length} currencies).`,
    );
    return rates;
  },
  {
    connection: bullMqConnection,
  },
);

exchangeRateWorker.on("completed", (job: Job) => {
  console.log(`ExchangeRateWorker Job ${job.id} completed successfully.`);
});

exchangeRateWorker.on("failed", (job: Job | undefined, error: Error) => {
  console.error(`ExchangeRateWorker Job ${job?.id} failed:`, error.message);
});

exchangeRateWorker.on("error", (error: Error) => {
  console.error("ExchangeRateWorker Worker error:", error);
});