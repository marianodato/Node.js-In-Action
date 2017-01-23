var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var root = __dirname;

var server = http.createServer(function(req, res){
  var url = parse(req.url);
  var path = join(root, url.pathname); //Construct absolute path
  var stream = fs.createReadStream(path); //Create fs.ReadStream
  stream.on('data', function(chunk){ //Write file data to response
          res.write(chunk);
  });
  stream.on('end', function(){
    res.end(); //End response when file is complete
  });
});

server.listen(3000);

  