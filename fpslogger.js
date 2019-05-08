/*
 * FPS logger
 * To view the results, type 'console.log(fpsArray);' in the browser console.
 */



//To be put in draw() or similar function that runs every frame
logFPS();



//To be put in global scope
var lastCalledTime = performance.now();
var fpsArray = [];

function logFPS() {
  var delta = (performance.now() - lastCalledTime) / 1000;
  var fps = Math.ceil(1 / delta);
  // var fps = round(frameRate()); // p5.js alternative, no need for delta and lastCalledTime variables
  if (!(fps in fpsArray)) {
    fpsArray[fps] = 0;
  }
  fpsArray[fps] += 1;
  lastCalledTime = performance.now();
}