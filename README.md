# yobit-ucash-bot

Trading bot that can buy UCASH on Yobit.net on this trading pair **UCASH/BTC**
```
https://yobit.net/en/trade/UCASH/BTC

```

# Trading Bot

> The code is commented. Change it accordingly for your need. <br>
If you want to place a trade like buying using limit order, uncomment the code under the limit order and change the values accordingly.

## Limit order
### placeTrade(['trade_pair'], ['buy'], ['rate'], [amount], ['limit'])
```bash
placeTrade('ucash_btc', 'buy', '0.00000002', '1111', 'limit');
```

## Market order
### placeTrade(['trade_pair'], ['buy'], [null], [amount], ['market'])
```bash
placeTrade("ucash_btc", "buy", null, "520", "market");
```
## Buy X UCASH over the period of Y seconds
```
buyUcashOverTime(10000, 5); // Buy 10000 UCASH over 5 seconds
```
## Sell X UCASH over the period of Y seconds
```
sellUcashOverTime(10000, 5); // Sell 10000 UCASH over 5 seconds
```
# Run Locally
Clone the project

```bash
  git clone https://github.com/NithinNitz12/yobit-ucash-bot.git
```

Go to the project directory

```bash
  cd yobit-ucash-bot
```
Create a `.env` file and insert your `API_KEY` and `API_SECRET`
```
API_KEY=<Insert the api key>
API_SECRET=<Insert the api secret>
```

Install dependencies

```bash
  npm install
```
### To buy, run this.
```bash
node buy.js
```
### To sell, run this.
```bash
node sell.js
```
### To get the balance info, run this.
```bash
node getInfo.js
```