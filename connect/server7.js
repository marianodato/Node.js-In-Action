var connect = require('connect');
var router = require('./middleware/router'); //router component

var routes = { //Routes are stored as an object
  GET: {
    '/users': function(req, res){
      res.end('tobi, loki, ferret');
    },
    '/user/:id': function(req, res, id){ //Each entry maps to request URL and contains callback function to be invoked
      res.end('user ' + id);
    }
  }, DELETE: {
    '/user/:id': function(req, res, id){
      res.end('deleted user ' + id);
	}
  }
};

connect()
  .use(router(routes)) //Pass routes object to router setup function
  .listen(3000);