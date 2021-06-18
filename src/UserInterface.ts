import { Money } from './Money';

export interface UserInterface {
  userName: string;
  money: Money[];

  getBalance(currency: string): number;

  addMoney(value: number, currency: string): number;

  withdrawMoney(value: number, currency: string): number;
}
