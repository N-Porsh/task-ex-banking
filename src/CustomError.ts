/* tslint:disable:max-classes-per-file */
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class WrongArguments extends CustomError {
  private arguments: any;

  constructor(args: any) {
    const argsString = typeof args === 'object' ? JSON.stringify(args) : args;
    super('Arguments: ' + argsString);
    this.arguments = args;
  }
}

export class UserAlreadyExists extends CustomError {
  constructor(username: string) {
    super('Username: ' + username);
  }
}

export class UserDoesNotExist extends CustomError {
  constructor(username: string) {
    super('Username: ' + username);
  }
}

export class NotEnoughMoney extends CustomError {
  constructor(balance?: number) {
    balance = balance || 0;
    super('Balance: ' + balance);
  }
}

export class SenderDoesNotExist extends CustomError {
  constructor(senderName: string) {
    super('Sender name: ' + senderName);
  }
}

export class ReceiverDoesNotExist extends CustomError {
  constructor(receiverName: string) {
    super('Receiver name: ' + receiverName);
  }
}
