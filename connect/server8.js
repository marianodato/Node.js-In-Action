var connect = require('connect')
var url = require('url')

function findPostIdBySlug(match, cb){
	if (match == "hello"){
		cb(null,1);
	}else{
		cb(new Error ("Post not found"));
	}
}

function rewrite(req, res, next) {
  var path = url.parse(req.url).pathname;
  var match = path.match(/^\/blog\/posts\/(.+)/)
  if (match) { //Only perform lookup on /blog/posts requests
  	findPostIdBySlug(match[1], function(err, id) {
      if (err) return next(err); //If there was a lookup error, inform error handler and stop processing
      if (!id) return next(new Error('User not found')); //If there was no matching ID for slug name, call next() with “User not found” Error argument
      req.url = '/blog/posts/' + id; //Overwrite req.url property so that subsequent middleware can utilize real ID
      next();
    });
  } else {
	next(); 
  }
}

function showPost(req, res) { //Ends response to HTTP request with “hello world”
  var path = url.parse(req.url).pathname;
  var match = path.match(/^\/blog\/posts\/(.+)/)
  if (match) {
  	res.setHeader('Content-Type', 'text/plain');
  	res.end('hello');
  }else
  {
  	res.setHeader('Content-Type', 'text/plain');
  	res.end(new Error ('Post not found'));
  }
}

function errorHandler() {
  var env = process.env.NODE_ENV || 'development';
  return function(err, req, res, next) { //Error-handling middleware defines four arguments
     res.statusCode = 500;
    switch (env) {
      case 'development': //errorHandler middleware component behaves differently depending on value of NODE_ENV
        res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify(err.message));
        break;
      default:
        res.end('Server error');
    } 
  }
}

var app = connect()
  .use(rewrite)
  .use(showPost)
  .use(errorHandler())
  .listen(3000);