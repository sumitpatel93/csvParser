const fs = require('fs');
const { parse } = require('csv-parse');
const axios = require('axios');

let date;
let token;

var args = process.argv;
if (args.length == 4) {
  date = args[2];
  token = args[3];
}

if (args.length == 3) {
  if (args[2][0] >= '0' && args[2][0] <= '9')
    date = args[2];
  else
    token = args[2];
}


// Initialize the portfolio map
const portfolio = new Map();

// Initialize the USD exchange rates
const exchangeRates = {};

async function getExchangeRate(token) {
  const response = await axios(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD`);
  return response.data.USD;
}

async function getPortfolioValue(date = null, token = null) {
  let value = 0;

  for (const [t, amount] of portfolio) {
    if (token && t !== token) {
      continue;
    }

    // Fetch the exchange rate if it's not already in the cache
    if (!exchangeRates[t]) {
      exchangeRates[t] = await getExchangeRate(t);
    }
    value += amount * exchangeRates[t];

    console.log("********* Token Portfolio (in usd) "+ t + "=" , amount * exchangeRates[t])
  }
  // return value;
}
// Create a readable stream from the CSV file
console.time();

fs.createReadStream("./transactions.csv")
  .pipe(parse({
    columns: ['timestamp', 'transactionType', 'token', 'amount'],
    cast: true
  }))
  .on('readable', function () {
    let record;
    while (record = this.read()) {

      const { timestamp, transactionType, token, amount } = record;
      if (timestamp == date) {
        if (transactionType === 'DEPOSIT') {
          if (portfolio.has(token)) {
            portfolio.set(token, portfolio.get(token) + amount);
          } else {
            portfolio.set(token, amount);
          }
        } else if (transactionType === 'WITHDRAWAL') {
          if (portfolio.has(token)) {
            portfolio.set(token, portfolio.get(token) - amount);
          } else {
            console.warn(`Trying to withdraw ${token}, which is not in the portfolio`);
          }
        }
      } else if (date == undefined) {
        if (transactionType === 'DEPOSIT') {
          if (portfolio.has(token)) {
            portfolio.set(token, portfolio.get(token) + amount);
          } else {
            portfolio.set(token, amount);
          }
        } else if (transactionType === 'WITHDRAWAL') {
          if (portfolio.has(token)) {
            portfolio.set(token, portfolio.get(token) - amount);
          } else {
            console.warn(`Trying to withdraw ${token}, which is not in the portfolio`);
          }
        }
      }
    }
  })
  .on('error', function (err) {
    console.error(err.message);
  })
  .on('end', async function () {
    // Get the latest portfolio value per token in USD
    // Latest portfolio value per token in USD
    if (date == undefined && token == undefined)
      await getPortfolioValue()

    // Latest portfolio value for ETH in USD
    if (date == undefined && token != undefined)
      await getPortfolioValue(null, token);

    // Portfolio value per token on a given date in USD
    if (date != undefined && token == undefined)
      await getPortfolioValue(date);

    // Portfolio value for ETH on a given date in USD 
    if (date != undefined && token != undefined)
      await getPortfolioValue(date, token);

    console.timeEnd();
  });

