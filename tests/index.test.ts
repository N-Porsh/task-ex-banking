import {ExBanking} from '../src';
import {
    NotEnoughMoney, ReceiverDoesNotExist,
    SenderDoesNotExist,
    UserAlreadyExists,
    UserDoesNotExist,
    WrongArguments
} from "../src/CustomError";


let bank: ExBanking;

beforeAll(() => {
    bank = new ExBanking();
});

beforeEach(() => {
    bank.users = [];
});

describe('Test createUser method', () => {

    test('Should have one user', () => {
        bank.createUser('Test User');
        expect(bank.users).toHaveLength(1);
        expect(bank.users[0].userName).toBe('Test User');
    });

    test('Should have an array of two users', () => {
        bank.createUser('Test User');
        bank.createUser('Test User 2');
        expect(bank.users).toHaveLength(2);
        expect(bank.users[0].userName).toBe('Test User');
        expect(bank.users[1].userName).toBe('Test User 2');
    });

    test('New user should have default EUR currency', () => {
        bank.createUser('Test User');
        expect(bank.users[0].money[0]._currency).toBe('EUR');
    });

    test('Should throw UserAlreadyExists exception', () => {
        bank.createUser('first');
        const t = () => {
            bank.createUser('first');
        };

        expect(t).toThrow(UserAlreadyExists);
        expect(t).toThrow("first");
    });

})

describe('Test deposit method', () => {

    test('Should add 1000 EUR to specific user', () => {
        bank.createUser('John');
        const result = bank.deposit('John', 1000, 'EUR');
        const resultBalance = bank.getBalance('John', 'EUR');

        expect(result).toEqual({success: true, newBalance: 1000});
        expect(resultBalance).toEqual({success: true, balance: 1000});
    });

    test('Should add additional money to existing user for the same currency', () => {
        bank.createUser('John');
        bank.deposit('John', 1000, 'EUR');
        const result = bank.deposit('John', 500, 'EUR');
        const resultBalance = bank.getBalance('John', 'EUR');

        expect(result).toEqual({success: true, newBalance: 1500});
        expect(resultBalance).toEqual({success: true, balance: 1500});
    });

    test('Should throw UserDoesNotExist exception when user not found', () => {
        const t = () => {
            bank.deposit('John', 100, 'EUR');
        };

        expect(t).toThrow(UserDoesNotExist);
        expect(t).toThrow("Username: John");
    });

    test('Should add money in different currency', () => {
        bank.createUser('Joe');
        bank.deposit('Joe', 1000, 'USD');

        expect(bank.users).toHaveLength(1);
        expect(bank.users[0].money[0]._currency).toBe('EUR');
        expect(bank.users[0].money[1]._currency).toBe('USD');
        expect(bank.users[0].money).toHaveLength(2);
    })

    test('Money amount should not be negative', () => {
        bank.createUser('John');

        const t = () => {
            bank.deposit('John', -100, 'EUR');
        };

        expect(t).toThrow(WrongArguments);
        expect(t).toThrow("Arguments: -100");
    })

});

describe('Test withdraw method', () => {

    test('Should throw UserDoesNotExist exception when user not found', () => {
        const t = () => {
            bank.withdraw('John', 100, 'EUR');
        };

        expect(t).toThrow(UserDoesNotExist);
        expect(t).toThrow("Username: John");
    });

    test('Should throw WrongArguments exception when currency not found', () => {
        bank.createUser('John');
        const t = () => {
            bank.withdraw('John', 100, 'USD');
        };

        expect(t).toThrow(WrongArguments);
        expect(t).toThrow("Arguments: undefined");
    });

    test('Should throw NotEnoughMoney exception when you have insufficient funds', () => {
        bank.createUser('John');
        const t = () => {
            bank.withdraw('John', 100, 'EUR');
        };

        expect(t).toThrow(NotEnoughMoney);
        expect(t).toThrow("Balance: 0");
    });

    test('Should withdraw 100 EUR', () => {
        bank.createUser('John');
        bank.deposit('John', 1000, 'EUR');

        const result = bank.withdraw('John', 100, 'EUR');
        const resultBalance = bank.getBalance('John', 'EUR');

        expect(result).toEqual({success: true, newBalance: 900});
        expect(resultBalance).toEqual({success: true, balance: 900});
    });

});

describe('Test getBalance method', () => {

    test('Should throw UserDoesNotExist exception when user not found', () => {
        const t = () => {
            bank.getBalance('John', 'EUR');
        };

        expect(t).toThrow(UserDoesNotExist);
        expect(t).toThrow("Username: John");
    });

    test('New user should have zero balance and default EUR currency', () => {
        bank.createUser('John');
        const result = bank.getBalance('John', 'EUR');

        expect(result).toEqual({success: true, balance: 0});
    });

    test('Should return some balance when there is some money', () => {
        bank.createUser('John');
        bank.deposit('John', 1000, 'EUR');
        bank.deposit('John', 2000, 'EUR');
        const result = bank.getBalance('John', 'EUR');

        expect(result).toEqual({success: true, balance: 3000});
    });

    test('Should return balance with 2 decimal precision', () => {
        bank.createUser('John');
        bank.deposit('John', 100.1234567, 'EUR');
        const result = bank.getBalance('John', 'EUR');

        expect(result).toEqual({success: true, balance: 100.12});
    });

});

describe('Test send method', () => {

    test('Should throw SenderDoesNotExist exception when sender not found', () => {
        bank.createUser('Sam');
        const t = () => {
            bank.send('John', 'Sam', 100, 'EUR');
        };

        expect(t).toThrow(SenderDoesNotExist);
        expect(t).toThrow("Sender name: John");
    });

    test('Should throw ReceiverDoesNotExist exception when sender not found', () => {
        bank.createUser('John');
        bank.deposit('John', 1000, 'EUR');

        const t = () => {
            bank.send('John', 'Sam', 100, 'EUR');
        };

        expect(t).toThrow(ReceiverDoesNotExist);
        expect(t).toThrow("Receiver name: Sam");
    });

    test('Should be able to transfer money from one user to another ', () => {
        bank.createUser('John');
        bank.createUser('Sam');
        bank.deposit('John', 1000, 'EUR');
        bank.deposit('Sam', 1000, 'EUR');

        bank.getBalance('John', 'EUR');

        const result = bank.send('John', 'Sam', 500, 'EUR');
        expect(result).toEqual({success: true, fromUsernameBalance: 500, toUsernameBalance: 1500});
    });

});