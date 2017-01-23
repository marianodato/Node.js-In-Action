var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.setMaxListeners(50);

channel.on('join', function(id, client) {
  var welcome = "Welcome!\n" + 'Guests online: ' + this.listeners('broadcast').length;
  client.write(welcome + "\n");
  this.clients[id] = client; //Add a listener for the join event that stores a user’s client object, allowing the application to send data back to the user.
  this.subscriptions[id] = function(senderId, message) {
  	if (id != senderId) { //Ignore data if it’s been directly broadcast by the user.
      this.clients[id].write(message);
	}
  }
  this.on('broadcast', this.subscriptions[id]); //Add a listener, specific to the current user, for the broadcast event.
});

channel.on('leave', function(id) { //Create listener for leave event
	channel.removeListener('broadcast', this.subscriptions[id]);
 	channel.emit('broadcast', id, id + " has left the chat.\n"); //Remove broadcast listener for specific client
});

channel.on('shutdown', function() {
  channel.emit('broadcast', '', "Chat has shut down.\n");
  channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;
  channel.emit('join', id, client); //Emit a join event when a user connects to the server, specifying the user ID and client object.
  client.on('data', function(data) {
  	data = data.toString();
  	if (data == "shutdown\r\n") {
    	channel.emit('shutdown');
  	}
  channel.emit('broadcast', id, data); //Emit a channel broadcast event, specifying the user ID and message, when any user sends data.
  });
  client.on('close', function() { //Emit leave event when client disconnects
    channel.emit('leave', id);
  });
});
server.listen(8888);