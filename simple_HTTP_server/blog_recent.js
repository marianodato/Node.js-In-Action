var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) { //Create HTTP server and use callback to define response logic
	if (req.url == '/') {
		fs.readFile('./titles.json', function(err, data) { //Read JSON file and use callback to define what to do with its contents
			if (err) { //If error occurs, log error and return “Server Error” to client
			 	console.error(err);
				res.end('Server Error');
			}else{
				var titles = JSON.parse(data.toString()); //Parse data from JSON text
				fs.readFile('./template.html', function(err, data) { //Read HTML template and use callback when it’s loaded
					if (err) {
  						console.error(err);
  						res.end('Server Error');
					}else{
						var tmpl = data.toString();
						var html = tmpl.replace('%', titles.join('</li><li>')); //Assemble HTML page showing blog titles
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.end(html); //Send HTML page to user
					}
				});
			}
		});
	}
}).listen(8000, "127.0.0.1");;
