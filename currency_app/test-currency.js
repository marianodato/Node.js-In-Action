var currency = require('./lib/currency'); //Path uses ./ to indicate that module exists within same directory as application script

console.log('50 Canadian dollars equals this amount of US dollars:');
console.log(currency.canadianToUS(50)); //Use currency module’s canadianToUS function

console.log('30 US dollars equals this amount of Canadian dollars:');
console.log(currency.USToCanadian(30)); //Use currency module’s USToCanadian function