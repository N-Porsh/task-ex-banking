import { Money } from './Money';
import { NotEnoughMoney, WrongArguments } from './CustomError';
import { UserInterface } from './UserInterface';
import { MoneyInterface } from './MoneyInterface';

// todo: change class name to something more suitable: Account/BankAccount/..
export class User implements UserInterface {
  readonly userName: string;
  private readonly _money: Money[];

  constructor(userName: string) {
    this.userName = userName;
    this._money = [new Money()];
  }

  public getBalance(currency: string): number {
    const money = this._money.find((item) => item._currency === currency);
    // if currency not found then it will be empty balance => '0'
    return !money ? 0 : parseFloat(money._amount.toFixed(2));
  }

  public addMoney(value: number, currency: string): number {
    if (value < 0) {
      throw new WrongArguments(value);
    }
    const moneyObject: MoneyInterface = {
      _amount: value,
      _currency: currency,
    };
    const money = this.findUserMoney(currency);

    // todo: simplify this block
    if (!money) {
      this._money.push(moneyObject);
    } else {
      const index = this._money.findIndex((item) => item._currency === currency);
      this._money[index]._amount += value;
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

    const index = this._money.findIndex((item) => item._currency === currency);
    this._money[index]._amount -= value;

    return this._money[index]._amount;
  }

  get money(): Money[] {
    return this._money;
  }

  private findUserMoney(currency: string) {
    return this._money.find((item) => item._currency === currency);
  }

  private hasEnoughMoney(currentBalance: number, amountToTake: number): boolean {
    return currentBalance >= amountToTake;
  }
}
