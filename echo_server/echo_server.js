var net = require('net');

var server = net.createServer(function(socket) { 
	socket.on('data', function(data) { //data events handled whenever new data has been read
		socket.write(data); //Data is written (echoed back) to client
 	});
});

server.listen(8888);

//on = add new listener