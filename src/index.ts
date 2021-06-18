import { ReceiverDoesNotExist, SenderDoesNotExist, UserAlreadyExists, UserDoesNotExist } from './CustomError';

import { User } from './User';
import { BankingError, ExBankingInterface, Ok } from './ExBankingInterface';

export class ExBanking implements ExBankingInterface {
  users: User[] = [];

  createUser(username: string): Ok | BankingError {
    const user = this.findUserByUserName(username);
    if (user) {
      throw new UserAlreadyExists(username);
    }

    // creates new user with default currency EUR and '0' amount
    const newUser: User = new User(username);
    this.users.push(newUser);

    return { success: true };
  }

  deposit(username: string, amount: number, currency: string): (Ok & { newBalance: number }) | BankingError {
    const user = this.findUserByUserName(username);

    if (!user) {
      throw new UserDoesNotExist(username);
    }
    const newBalance: number = user.addMoney(amount, currency);

    return { success: true, newBalance };
  }

  withdraw(username: string, amount: number, currency: string): (Ok & { newBalance: number }) | BankingError {
    const user = this.findUserByUserName(username);

    if (!user) {
      throw new UserDoesNotExist(username);
    }
    const newBalance = user.withdrawMoney(amount, currency);

    return { success: true, newBalance };
  }

  getBalance(username: string, currency: string): (Ok & { balance: number }) | BankingError {
    const user = this.findUserByUserName(username);
    if (!user) {
      throw new UserDoesNotExist(username);
    }

    const balance: number = user.getBalance(currency);

    return { success: true, balance };
  }

  send(
    fromUsername: string,
    toUsername: string,
    amount: number,
    currency: string,
  ): (Ok & { fromUsernameBalance: number; toUsernameBalance: number }) | BankingError {
    const userSender = this.findUserByUserName(fromUsername);
    if (!userSender) {
      throw new SenderDoesNotExist(fromUsername);
    }

    const userReceiver = this.findUserByUserName(toUsername);
    if (!userReceiver) {
      throw new ReceiverDoesNotExist(toUsername);
    }

    const userSenderNewBalance: number = userSender.withdrawMoney(amount, currency);
    const userReceiverNewBalance: number = userReceiver.addMoney(amount, currency);

    return { success: true, fromUsernameBalance: userSenderNewBalance, toUsernameBalance: userReceiverNewBalance };
  }

  private findUserByUserName(userName: string): User | undefined {
    return this.users.find((user) => user.userName === userName);
  }
}
