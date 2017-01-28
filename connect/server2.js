var connect = require('connect');
var app = connect();
app.use(logger);
app.listen(3000);

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}