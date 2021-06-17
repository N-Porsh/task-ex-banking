import { Money } from './Money';
import { NotEnoughMoney, WrongArguments } from './CustomError';

interface MoneyInterface {
  _amount: number;
  _currency: string;
}

/*interface UserInterface {
    // readonly id: number
    userName: string
    money: Money[]

    getBalance(currency: string): number

    addMoney(value: number, currency: string): number
}*/

export class User {
  readonly userName: string;
  private money: Money[];

  constructor(userName: string) {
    this.userName = userName;
    this.money = [new Money()];
  }

  public getBalance(currency: string): number {
    const money = this.money.find((item) => item._currency === currency);
    if (!money) {
      return 0;
    }

    return money._amount;
  }

  // todo: 2 decimal points
  public addMoney(value: number, currency: string): number {
    const moneyObject: MoneyInterface = {
      _amount: value,
      _currency: currency,
    };
    const money = this.findUserMoney(currency);

    // simplify this block
    if (!money) {
      this.money.push(moneyObject);
    } else {
      const index = this.money.findIndex((item) => item._currency === currency);
      this.money[index]._amount += value;
    }

    return this.getBalance(currency);
  }

  public withdrawMoney(value: number, currency: string): number {
    const money = this.findUserMoney(currency);

    if (!money) {
      throw new WrongArguments(money);
    }
    if (!this.hasEnoughMoney(money._amount, value)) {
      throw new NotEnoughMoney(money._amount);
    }

    const index = this.money.findIndex((item) => item._currency === currency);
    this.money[index]._amount -= value;

    return this.money[index]._amount;
  }

  private findUserMoney(currency: string) {
    return this.money.find((item) => item._currency === currency);
  }

  private hasEnoughMoney(currentBalance: number, amountToTake: number): boolean {
    return currentBalance >= amountToTake;
  }
}
