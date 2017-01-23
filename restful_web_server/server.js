var http = require('http');
var url = require('url');
var items = []; //The data store is a regular JavaScript Array in memory.

var server = http.createServer(function(req, res){
  switch (req.method) { //req.method is the HTTP method requested.
  	case 'POST':
      var item = ''; //Set up string buffer for the incoming item.
      req.setEncoding('utf8'); //Encode incoming data events as UTF-8 strings.
      req.on('data', function(chunk){
        item += chunk; //Concatenate data chunk onto the buffer.
        });
      req.on('end', function(){
        items.push(item); //Push complete new item onto the items array.
        res.statusCode = 201;
        res.end('OK\n');
  	  });
		break;
	case 'GET':
        var body = items.map(function(item, i){
          return i + ') ' + item;
		}).join('\n');
		res.setHeader('Content-Length', Buffer.byteLength(body));
		res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
		res.end(body);
        break;
    case 'DELETE': //Add DELETE case to the switch statement
  		var path = url.parse(req.url).pathname;
  		var i = parseInt(path.slice(1), 10);
  		if (isNaN(i)) { //Check that number is valid
		    res.statusCode = 400;
		    res.end('Invalid item id');
		} else if (!items[i]) { //Ensure requested index exists
		    res.statusCode = 404;
		    res.end('Item not found');
		} else {
		    items.splice(i, 1); //Delete requested item
		    res.statusCode = 204;
		    res.end('OK\n');
		}
		break;
  }
});

server.listen(3000);