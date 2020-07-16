/* Example in Node.js ES6 using request-promise */
const API_KEY = 'b9a489ec-5368-423a-804e-7c474fe2e5d1';

const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
  qs: {
    'id': '1',
    'convert': 'CAD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': API_KEY
  },
  json: true,
  gzip: true
};

var preValues = [];

var money = 20.00;
var bitcoin = 0.0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getNewPrice(response){
    var currentBitcoinPrice = response.data[1].quote.CAD.price;
    preValues.push(currentBitcoinPrice);
    console.log(preValues);
    var changeInOneHour = response.data[1].quote.CAD.percent_change_1h;
    var changeInOneDay = response.data[1].quote.CAD.percent_change_24h;
    var changeInOneWeek = response.data[1].quote.CAD.percent_change_7d;
    console.log('Change in an hour: ' + changeInOneHour);
    console.log('Change in a day: ' + changeInOneDay);
    console.log('Change in a week: ' + changeInOneWeek);
    if(changeInOneHour < -1.5){
        var currBitcoin = bitcoin;
        bitcoin = money / currentBitcoinPrice + currBitcoin;
        money = 0;
    } else if (changeInOneHour > 1.5){
        var currMoney = money;
        money = bitcoin / currentBitcoinPrice + currMoney;
        bitcoin = 0;
    }
    console.log('Current money: ' + money);
    console.log('Current bitcoin: ' + bitcoin);
}

async function recurCall(){
    rp(requestOptions).then(response => {
        getNewPrice(response)
    }).catch((err) => {
        console.log('API call error:', err.message);
    });
    const sleepTime = 400000;
    await sleep(sleepTime);
    recurCall();
}

recurCall();