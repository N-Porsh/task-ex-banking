# Task Ex-banking
### Installation requirements:
* node v8+
### Installation
* `npm install`
* install typescript globally ? `npm i -g typescript`
### Usage
1. Check `package.json` for different `script` options
    * run tests: `npm run test`
    * build js files: `npm run build` 
2. Code example:
```javascript
import {ExBanking} from "./src"; // src if you are in project root directory
const bank = new ExBanking();

bank.createUser('John');
bank.deposit('John', 1000, 'EUR');
bank.withdraw('John', 200, 'EUR');
bank.getBalance('John', 'EUR');

bank.createUser('Mark');

bank.send('John', 'Mark', 100, 'EUR');
```