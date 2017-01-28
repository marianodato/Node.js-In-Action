var connect = require('connect');

function logger(req, res, next) { //Prints HTTP method and request URL and calls next()
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) { //Ends response to HTTP request with “hello world”
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

connect()
  .use(logger)
  .use(hello)
  .listen(3000);