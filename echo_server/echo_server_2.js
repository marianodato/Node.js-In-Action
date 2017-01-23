var net = require('net');

var server = net.createServer(function(socket) {
	socket.once ('data', function(data) { //data event will only be handled once
    	socket.write(data);
 	});
});

server.listen(8888);