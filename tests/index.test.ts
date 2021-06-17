import {ExBanking} from '../src';

let bank: ExBanking;
beforeAll(() => {
    bank = new ExBanking();
})
beforeEach(() => {
    bank.users = [];
});

describe('test createUser method', () => {

    test('Should have one user', () => {
        bank.createUser('Test User');
        expect(bank.users).toHaveLength(1);
        expect(bank.users[0].userName).toBe('Test User');
    });

    test('new user should have zero balance', () => {
        bank.createUser('John');
        const result = bank.getBalance('John', 'EUR');
        expect(result).toEqual({success: true, balance: 0});
    });

    test('deposit should add 1000 EUR to specific user', () => {
        bank.createUser('John');
        const result = bank.deposit('John', 1000, 'EUR');
        const resultBalance = bank.getBalance('John', 'EUR');

        expect(result).toEqual({success: true, newBalance: 1000});
        expect(resultBalance).toEqual({success: true, balance: 1000});
    });
})