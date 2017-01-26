var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2); //Splice out “node cli_tasks.js” to leave arguments
var command = args.shift(); //Pull out first argument (the command)
var taskDescription = args.join(' '); //Join remaining arguments
var file = path.join(process.cwd(), '/.tasks'); //Resolve database path relative to current working directory

switch (command) {
  case 'list': //‘list’ will list all tasks stored
    listTasks(file);
    break;
  case 'add': //‘add’ will add new task
    addTask(file, taskDescription);
    break;
  default: //Anything else will show usage help
    console.log('Usage: ' + process.argv[0]
      + ' list|add [taskDescription]');
}

function loadOrInitializeTaskArray(file, cb) {
  fs.exists(file, function(exists) { //Check if .tasks file already exists
  	var tasks = [];
    if (exists) {
      fs.readFile(file, 'utf8', function(err, data) { //Read to-do data from .tasks file
      	if (err) throw err;
		var data = data.toString();
		var tasks = JSON.parse(data || '[]'); //Parse JSON-encoded to-do data into array of tasks
		cb(tasks);
	  });
	} else {
		cb([]); //Create empty array of tasks if tasks file doesn’t exist
	} 
  });
}

function listTasks(file) {
  loadOrInitializeTaskArray(file, function(tasks) {
    for(var i in tasks) {
      console.log(tasks[i]);
	} 
  });
}

function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
    if (err) throw err;
    console.log('Saved.');
  });
}

function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, function(tasks) {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  });
}