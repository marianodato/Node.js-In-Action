var fs = require('fs');

var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete() {
  completedTasks++;
  if (completedTasks == tasks.length) {
    for (var index in wordCounts) { //When all tasks have completed, list each word used in the files and how many times it was used.
      console.log(index +': ' + wordCounts[index]);
	}
  }
}

function countWordsInText(text) {
  var words = text.toString().toLowerCase().split(/\W+/).sort();
  for (var index in words) { //Count word occurrences in text.
    var word = words[index];
    if (word) {
      wordCounts[word] =
         (wordCounts[word]) ? wordCounts[word] + 1 : 1;
	}
  }
}

fs.readdir(filesDir, function(err, files) { //Get a list of the files in the text directory.
  if (err) throw err;
  for(var index in files) {
    var task = (function(file) { //Define a task to handle each file. Each task includes a call to a function that will asynchronously read the file and then count the file’s word usage.
      return function() {
        fs.readFile(file, function(err, text) {
          if (err) throw err;
          countWordsInText(text);
          checkIfComplete();
		});
      }
    })(filesDir + '/' + files[index]);

    tasks.push(task); //Add each task to an array of functions to call in parallel.
  }
  
  for(var task in tasks) { //Start executing every task in parallel.
    tasks[task]();
  }
});
