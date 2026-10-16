import { container } from "tsyringe";

import type { IPasswordService } from "../application/interfaces/IPasswordService.js";
import type { ITokenService } from "../application/interfaces/ITokenService.js";
import type { ISignInUseCase } from "../application/usecases/signIn/ISignInUseCase.js";
import { SignInUseCase } from "../application/usecases/signIn/SignInUseCase.js";
import type { ISignUpUseCase } from "../application/usecases/signUp/ISignUpUseCase.js";
import { SignUpUseCase } from "../application/usecases/signUp/SignUpUseCase.js";
import type { IGetMeUseCase } from "../application/usecases/getMe/IGetMeUseCase.js";
import { GetMeUseCase } from "../application/usecases/getMe/GetMeUseCase.js";
import type { IUpdateExchangeRatesUseCase } from "../application/usecases/updateExchangeRates/IUpdateExchangeRatesUseCase.js";
import { UpdateExchangeRatesUseCase } from "../application/usecases/updateExchangeRates/UpdateExchangeRatesUseCase.js";
import type { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { UserRepository } from "../infrastructure/database/repositories/UserRepository.js";
import type { IWalletRepository } from "../domain/repositories/IWalletRepository.js";
import { WalletRepository } from "../infrastructure/database/repositories/WalletRepository.js";
import type { ITransactionRepository } from "../domain/repositories/ITransactionRepository.js";
import { TransactionRepository } from "../infrastructure/database/repositories/TransactionRepository.js";
import type { ICreateWalletUseCase } from "../application/usecases/createWallet/ICreateWalletUseCase.js";
import { CreateWalletUseCase } from "../application/usecases/createWallet/CreateWalletUseCase.js";
import type { IGetBalanceUseCase } from "../application/usecases/getBalance/IGetBalanceUseCase.js";
import { GetBalanceUseCase } from "../application/usecases/getBalance/GetBalanceUseCase.js";
import type { IDepositUseCase } from "../application/usecases/deposit/IDepositUseCase.js";
import { DepositUseCase } from "../application/usecases/deposit/DepositUseCase.js";
import type { IWithdrawUseCase } from "../application/usecases/withdraw/IWithdrawUseCase.js";
import { WithdrawUseCase } from "../application/usecases/withdraw/WithdrawUseCase.js";
import type { ITransferUseCase } from "../application/usecases/transfer/ITransferUseCase.js";
import { TransferUseCase } from "../application/usecases/transfer/TransferUseCase.js";
import type { IGetTransactionHistoryUseCase } from "../application/usecases/getTransactionHistory/IGetTransactionHistoryUseCase.js";
import { GetTransactionHistoryUseCase } from "../application/usecases/getTransactionHistory/GetTransactionHistoryUseCase.js";
import type { IAddFraudUseCase } from "../application/usecases/addFraud/IAddFraudUseCase.js";
import { AddFraudUseCase } from "../application/usecases/addFraud/AddFraudUseCase.js";
import type { IValidateFraudUseCase } from "../application/usecases/validateFraud/IValidateFraudUseCase.js";
import { ValidateFraudUseCase } from "../application/usecases/validateFraud/ValidateFraudUseCase.js";
import type { IGetExchangeRatesUseCase } from "../application/usecases/getExchangeRates/IGetExchangeRatesUseCase.js";
import { GetExchangeRatesUseCase } from "../application/usecases/getExchangeRates/GetExchangeRatesUseCase.js";
import type { ICacheService } from "../application/interfaces/ICacheService.js";
import type { IExchangeRateService } from "../application/interfaces/IExchangeRateService.js";
import { ExchangeRateService } from "../infrastructure/services/ExchangeRateService.js";
import { PasswordService } from "../infrastructure/services/PasswordService.js";
import { RedisCacheService } from "../infrastructure/services/RedisCacheService.js";
import { TokenService } from "../infrastructure/services/TokenService.js";
import { DI_TOKENS } from "./tokens.js";


container.registerSingleton<IUserRepository>(DI_TOKENS.userRepository, UserRepository);
container.registerSingleton<IWalletRepository>(DI_TOKENS.walletRepository, WalletRepository);
container.registerSingleton<ITransactionRepository>(DI_TOKENS.transactionRepository, TransactionRepository);
container.registerSingleton<IPasswordService>(DI_TOKENS.passwordService, PasswordService);
container.registerSingleton<ITokenService>(DI_TOKENS.tokenService, TokenService);
container.registerSingleton<ICacheService>(DI_TOKENS.cacheService, RedisCacheService);
container.registerSingleton<IExchangeRateService>(DI_TOKENS.exchangeRateService, ExchangeRateService);
container.registerSingleton<ISignUpUseCase>(DI_TOKENS.signUpUseCase, SignUpUseCase);
container.registerSingleton<ISignInUseCase>(DI_TOKENS.signInUseCase, SignInUseCase);
container.registerSingleton<IGetMeUseCase>(DI_TOKENS.getMeUseCase, GetMeUseCase);
container.registerSingleton<ICreateWalletUseCase>(DI_TOKENS.createWalletUseCase, CreateWalletUseCase);
container.registerSingleton<IGetBalanceUseCase>(DI_TOKENS.getBalanceUseCase, GetBalanceUseCase);
container.registerSingleton<IDepositUseCase>(DI_TOKENS.depositUseCase, DepositUseCase);
container.registerSingleton<IWithdrawUseCase>(DI_TOKENS.withdrawUseCase, WithdrawUseCase);
container.registerSingleton<ITransferUseCase>(DI_TOKENS.transferUseCase, TransferUseCase);
container.registerSingleton<IGetTransactionHistoryUseCase>(
  DI_TOKENS.getTransactionHistoryUseCase,
  GetTransactionHistoryUseCase,
);
container.registerSingleton<IAddFraudUseCase>(DI_TOKENS.addFraudUseCase, AddFraudUseCase);
container.registerSingleton<IValidateFraudUseCase>(DI_TOKENS.validateFraudUseCase, ValidateFraudUseCase);
container.registerSingleton<IGetExchangeRatesUseCase>(
  DI_TOKENS.getExchangeRatesUseCase,
  GetExchangeRatesUseCase,
);
container.registerSingleton<IUpdateExchangeRatesUseCase>(
  DI_TOKENS.updateExchangeRatesUseCase,
  UpdateExchangeRatesUseCase,
);

export { DI_TOKENS } from "./tokens.js";
export { container };
