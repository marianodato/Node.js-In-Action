var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var root = __dirname;

var server = http.createServer(function(req, res){
  var url = parse(req.url);
  var path = join(root, url.pathname);
  var stream = fs.createReadStream(path);
  stream.pipe(res); //res.end() called internally by stream.pipe()
  stream.on('error', function(err){
  	res.statusCode = 500;
  	res.end('Internal Server Error');
  });
});

server.listen(3000);