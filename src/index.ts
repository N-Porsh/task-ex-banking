import { ReceiverDoesNotExist, SenderDoesNotExist, UserAlreadyExists, UserDoesNotExist } from './CustomError';

import { User } from './User';
import { BankingError, ExBankingInterface, Ok } from './ExBankingInterface';

export class ExBanking implements ExBankingInterface {
  users: User[] = [];

  createUser(username: string): Ok | BankingError {
    let user = this.findUserByUserName(username);
    if (user) {
      throw new UserAlreadyExists(username);
    }

    //creates new user with default currency EUR and '0' amount
    let newUser = new User(username);
    this.users.push(newUser);

    return { success: true };
  }

  deposit(username: string, amount: number, currency: string): (Ok & { newBalance: number }) | BankingError {
    let user = this.findUserByUserName(username);

    if (!user) {
      throw new UserDoesNotExist(username);
    }
    let newBalance = user.addMoney(amount, currency);

    return { success: true, newBalance: newBalance };
  }

  withdraw(username: string, amount: number, currency: string): (Ok & { newBalance: number }) | BankingError {
    let user = this.findUserByUserName(username);

    if (!user) {
      throw new UserDoesNotExist(username);
    }
    let newBalance = user.withdrawMoney(amount, currency);

    return { success: true, newBalance: newBalance };
  }

  getBalance(username: string, currency: string): (Ok & { balance: number }) | BankingError {
    let user = this.findUserByUserName(username);
    if (!user) {
      throw new UserDoesNotExist(username);
    }

    const balance: number = user.getBalance(currency);

    return { success: true, balance: balance };
  }

  send(
    fromUsername: string,
    toUsername: string,
    amount: number,
    currency: string,
  ): (Ok & { fromUsernameBalance: number; toUsernameBalance: number }) | BankingError {
    let userSender = this.findUserByUserName(fromUsername);
    if (!userSender) {
      throw new SenderDoesNotExist(fromUsername);
    }

    let userReceiver = this.findUserByUserName(toUsername);
    if (!userReceiver) {
      throw new ReceiverDoesNotExist(toUsername);
    }

    let userSenderNewBalance: number = userSender.withdrawMoney(amount, currency);
    let userReceiverNewBalance: number = userReceiver.addMoney(amount, currency);

    return { success: true, fromUsernameBalance: userSenderNewBalance, toUsernameBalance: userReceiverNewBalance };
  }

  private findUserByUserName(userName: string): User | undefined {
    return this.users.find((user) => user.userName == userName);
  }
}

const banking = new ExBanking();

banking.createUser('Nikita');
banking.deposit('Nikita', 1000, 'EUR');
banking.deposit('Nikita', 500, 'USD');
// banking.deposit('Nikita', 123.123456789, 'EUR');
banking.getBalance('Nikita', 'EUR');
banking.getBalance('Nikita', 'USD');
console.log(banking.users[0]);

banking.createUser('John');
banking.deposit('John', 500, 'EUR');
banking.getBalance('John', 'EUR');
console.log(banking.users[1]);

banking.send('Nikita', 'John', 100, 'USD');
console.log(banking.users[0]);
console.log(banking.users[1]);
