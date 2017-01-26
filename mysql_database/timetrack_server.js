var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql'); //Require MySQL API

var db = mysql.createConnection({ //Connect to MySQL
  host:     '127.0.0.1',
  user:     'root',
  password: 'root',
  database: 'psj'
});

var server = http.createServer(function(req, res) {
  switch (req.method) {
	case 'POST': //Route HTTP POST requests
	  switch(req.url) {
	    case '/':
	      work.add(db, req, res);
	      break;
	    case '/archive':
	      work.archive(db, req, res);
	      break;
	    case '/delete':
	      work.delete(db, req, res);
	      break;
	}
	  break;
	case 'GET': //Route HTTP GET requests
	  switch(req.url) {
	    case '/':
	      work.show(db, res);
	      break;
	    case '/archived':
	      work.showArchived(db, res);
	  }
	break; 
  }
});

db.query(
  "CREATE TABLE IF NOT EXISTS work (" //Table-creation SQL
  + "id INT(10) NOT NULL AUTO_INCREMENT, "
  + "hours DECIMAL(5,2) DEFAULT 0, "
  + "date DATE, "
  + "archived INT(1) DEFAULT 0, "
  + "description LONGTEXT,"
  + "PRIMARY KEY(id))",
  function(err) {
    if (err) throw err;
    console.log('Server started...');
    server.listen(3000, '127.0.0.1'); //Start HTTP server
  } 
);
