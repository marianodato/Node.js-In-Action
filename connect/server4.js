var connect = require('connect');

function logger(req, res, next) { //Always calls next(), so subsequent middleware is invoked
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) { //Doesn’t call next(), because component responds to request
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

var app = connect()
  .use(hello)
  .use(logger) //logger will never be invoked because hello doesn’t call next()
  .listen(3000);