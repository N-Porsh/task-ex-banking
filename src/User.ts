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
    let money = this.money.find((money) => money._currency == currency);
    if (!money) {
      return 0;
    }
    // console.debug('Currency: %s; amount: %d', currency, money._amount);
    return money._amount;
  }

  // todo: 2 decimal points
  public addMoney(value: number, currency: string): number {
    let obj: MoneyInterface = {
      _amount: value,
      _currency: currency,
    };
    // find money data for the given currency
    let money = this.money.find((money) => money._currency == currency);

    // simplify this block
    if (!money) {
      this.money.push(obj);
    } else {
      const index = this.money.findIndex((item) => item._currency === currency);
      this.money[index]._amount += value;
    }

    return this.getBalance(currency); // does it work ?
  }

  public withdrawMoney(value: number, currency: string): number {
    let money = this.money.find((money) => money._currency == currency);

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

  private hasEnoughMoney(currentBalance: number, amountToTake: number): boolean {
    return currentBalance >= amountToTake;
  }
}
