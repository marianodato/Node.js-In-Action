var connect = require('connect');

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

function authenticateWithDatabase(user, pass, cb){
	if (user == "tobi" && pass == "ferret")
		cb();
	else
		cb("Unauthorized");
}

function restrict(req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));
  var parts = authorization.split(' ')
  var scheme = parts[0]
  var auth = new Buffer(parts[1], 'base64').toString().split(':')
  var user = auth[0]
  var pass = auth[1];
  authenticateWithDatabase(user, pass, function (err) { //A function that checks credentials
  	if (err) return next(err); //Informs dispatcher that an error occurred
  	next(); //Calls next() with no arguments when given valid credentials
  });
} 

function admin(req, res, next) {
         switch (req.url) {
            case '/':
              res.end('try /users');
              break;
            case '/users':
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(['tobi', 'loki', 'jane']));
              break;
		 } 
}

var app = connect()
  .use(logger)
  .use('/admin', restrict)
  .use('/admin', admin)
  .use(hello)
  .listen(3000);




