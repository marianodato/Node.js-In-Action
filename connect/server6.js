//Example of reusable logger:

function setup(format) { //Setup function can be called multiple times with different configurations
  var regexp = /:(\w+)/g; //Logger component uses a regexp to match request properties
  return function logger(req, res, next) { //Actual logger component that Connect will use
  	var str = format.replace(regexp, function(match, property){ //Use regexp to format log entry for request
  		 return req[property];
	});
	console.log(str); //Print request log entry to console
	next(); //Pass control to next middleware component
  }
}

module.exports = setup; //Directly export logger setup function

//Server:

var connect = require('connect');

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

var app = connect()
  .use(setup(':method :url'))
  .use(hello)
  .listen(3000);