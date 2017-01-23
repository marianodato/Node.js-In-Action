var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFilename = './rss_feeds.txt';

function checkForRSSFile () { //Task 1: Make sure file containing the list of RSS feed URLs exists.
  fs.exists(configFilename, function(exists) {
  	if (!exists)
  		return next(new Error('Missing RSS file: ' + configFilename)); //Whenever there is an error, return early.
 	next(null, configFilename);
  });
}

function readRSSFile (configFilename) { //Task 2: Read and parse file containing the feed URLs.
  fs.readFile(configFilename, function(err, feedList) {
    if (err) 
    	return next(err);
    feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split("\n"); //Convert list of feed URLs to a string and then into an array of feed URLs.
	var random = Math.floor(Math.random()*feedList.length); //Select random feed URL from array of feed URLs.
	next(null, feedList[random]);
  });
}

function downloadRSSFeed (feedUrl) { //Task 3: Do an HTTP request and get data for the selected feed.
          request({uri: feedUrl}, function(err, res, body) {
            if (err) 
            	return next(err);
            if (res.statusCode != 200)
            	return next(new Error('Abnormal response status code'))
    		next(null, body);
  		  });
}

function parseRSSFeed (rss) { //Task 4: Parse RSS data into array of items.
  var handler = new htmlparser.RssHandler();
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length)
    return next(new Error('No RSS items found'));
  var item = handler.dom.items.shift();
  console.log(item.title); //Display title and URL of the first feed item, if it exists.
  console.log(item.link);
}

var tasks = [ checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed ]; //Add each task to be performed to an array in execution order.

function next(err, result) { //A function called next executes each task.
  if (err) //Throw exception if task encounters an error.
  	throw err;
  var currentTask = tasks.shift(); //Next task comes from array of tasks.
  if (currentTask) {
    currentTask(result); //Execute current task.
} }

next(); //Start serial execution of tasks.
