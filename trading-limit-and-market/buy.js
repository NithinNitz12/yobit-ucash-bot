require("dotenv").config(); // Load .env file
const axios = require("axios");
const crypto = require("crypto");

// YoBit API credentials from .env
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

// Function to make YoBit API requests
async function yobitApiRequest(method, params = {}) {
  const nonce = Math.floor(Date.now() / 1000); // Generate a nonce based on current time
  params.method = method;
  params.nonce = nonce;

  // Prepare the post data
  const postData = new URLSearchParams(params).toString();

  // Create the HMAC SHA512 signature
  const sign = crypto
    .createHmac("sha512", API_SECRET)
    .update(postData)
    .digest("hex");

  // Make the request
  try {
    const response = await axios.post("https://yobit.net/tapi/", postData, {
      headers: {
        Key: API_KEY,
        Sign: sign,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error making API request:", error);
  }
}

// Function to place a trade
async function placeTrade(pair, type, rate, amount, orderType) {
  const response = await fetch(`https://yobit.net/api/3/depth/${pair}`);
  const data = await response.json();
  const askPrice = data[pair].asks[0][0];

  const tradeParams = {
    pair: pair,
    type: type,
    amount: amount,
  };

  if (orderType === "limit") {
    tradeParams.rate = rate;
  } else if (orderType === "market") {
    try {
      tradeParams.rate = askPrice.toFixed(8);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  } else {
    throw new Error('Invalid order type. Use "limit" or "market".');
  }

  const tradeResult = await yobitApiRequest("Trade", tradeParams);

  if (tradeResult && tradeResult.success === 1) {
    console.log("Trade Successful:", tradeResult.return);
  } else {
    console.log("Trade Error:", tradeResult.error);
  }
}

// Helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to buy UCASH over time
async function buyUcashOverTime(totalAmount, durationSeconds) {
  const pair = 'ucash_btc';
  const type = 'buy';
  const orderType = 'market';
  
  const intervalMs = 1000; // Check every second
  const iterations = durationSeconds;
  const amountPerIteration = totalAmount / iterations;
  
  console.log(`Starting to buy ${totalAmount} UCASH over ${durationSeconds} seconds.`);
  
  for (let i = 0; i < iterations; i++) {
    try {
      await placeTrade(pair, type, null, amountPerIteration.toFixed(8), orderType);
      console.log(`Iteration ${i + 1}: Bought ${amountPerIteration.toFixed(8)} UCASH`);
    } catch (error) {
      console.error(`Error in iteration ${i + 1}:`, error);
    }
    await delay(intervalMs);
  }
  
  console.log(`Completed buying ${totalAmount} UCASH over ${durationSeconds} seconds.`);
}

//--------------------------- UNCOMMENT AND CHANGE VALUES FOR THE TRADE, EITHER LIMIT OR MARKET ORDER. ---------------------------\\

// Limit order
// placeTrade(['trade_pair'], ['buy'], ['rate'], [amount], ['limit'])
// placeTrade('ucash_btc', 'buy', '0.00000002', '1111', 'limit');

// Market order
// placeTrade(['trade_pair'], ['buy'], [null], [amount], ['market'])
// placeTrade("ucash_btc", "buy", null, "520", "market");

//--------------------------------------- TO BUY X AMOUNT OF UCASH OVER THE PERIOD OF Y SECONDS ---------------------------------------\\

// buyUcashOverTime(10000, 5); // Buy 10000 UCASH over 5 seconds