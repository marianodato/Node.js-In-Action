function asyncFunction(callback) {
  setTimeout(callback, 200);
}

var color = 'blue';
asyncFunction(function() {
  console.log('The color is ' + color); //This is executed last (200 ms later).
});

color = 'green';