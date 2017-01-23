var flow = require('nimble');

flow.series([ //Provide an array of functions for Nimble to execute, one after the other.
  function (callback) {
    setTimeout(function() {
      console.log('I execute first.');
      callback();
}, 1000); },

  function (callback) {
    setTimeout(function() {
      console.log('I execute next.');
      callback();
    }, 500);
  },

  function (callback) {
    setTimeout(function() {
      console.log('I execute last.');
      callback();
}, 100); }
    
]);