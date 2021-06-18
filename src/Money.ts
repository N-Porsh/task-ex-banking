import { MoneyInterface } from './MoneyInterface';

export class Money implements MoneyInterface {
  public _amount: number = 0;
  public _currency: string = 'EUR';
}
