var parse = require('url').parse;
module.exports = function route(obj) {
  return function(req, res, next){
  	if (!obj[req.method]) { //Check to make sure req.method is defined
  		 next(); //If not, invoke next() and stop any further execution
		 return;
	}
	var routes = obj[req.method] //Lookup paths for req.method
	var url = parse(req.url) //Parse URL for matching against pathname
	var paths = Object.keys(routes) //Store paths for req.method as array
	for (var i = 0; i < paths.length; i++) { //Loop through paths
		var path = paths[i];
  		var fn = routes[path];
  		path = path
    			.replace(/\//g, '\\/')
    			.replace(/:(\w+)/g, '([^\\/]+)');
  		var re = new RegExp('^' + path + '$'); //Construct regular expression
  		var captures = url.pathname.match(re)
		if (captures) { //Attempt match against pathname
			var args = [req, res].concat(captures.slice(1)); //Pass the capture groups
			fn.apply(null, args);
			return; //Return when match is found to prevent following next() call
		}
	}
	next(); 
  }
};
