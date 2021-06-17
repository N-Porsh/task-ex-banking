import {
  NotEnoughMoney,
  ReceiverDoesNotExist,
  SenderDoesNotExist,
  UserAlreadyExists,
  UserDoesNotExist,
  WrongArguments,
} from './CustomError';

export type BankingError =
  | Error
  | WrongArguments
  | UserAlreadyExists
  | UserDoesNotExist
  | NotEnoughMoney
  | SenderDoesNotExist
  | ReceiverDoesNotExist;

export type Ok = { success: true };

export interface ExBankingInterface {
  createUser(username: string): Ok | BankingError;

  deposit(username: string, amount: number, currency: string): (Ok & { newBalance: number }) | BankingError;

  withdraw(username: string, amount: number, currency: string): (Ok & { newBalance: number }) | BankingError;

  getBalance(username: string, currency: string): (Ok & { balance: number }) | BankingError;

  send(
    fromUsername: string,
    toUsername: string,
    amount: number,
    currency: string,
  ): (Ok & { fromUsernameBalance: number; toUsernameBalance: number }) | BankingError;
}
