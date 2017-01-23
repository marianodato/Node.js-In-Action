// Generate private key:
// openssl genrsa 1024 > key.pem
// Generate public certificate:
// openssl req -x509 -new -key key.pem > key-cert.pem

var https = require('https');
var fs = require('fs');

var options = { //SSL key and cert given as options
  key:  fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./key-cert.pem')
};

https.createServer(options, function (req, res) { //options object is passed in first
	res.writeHead(200); //https and http modules have almost identical APIs
	res.end("hello world\n");
}).listen(3000);
