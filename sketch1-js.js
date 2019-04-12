// Gravity / Repulsion model
var num = 1000;
var vx = new Array(num);
var vy = new Array(num);
var x = new Array(num);
var y = new Array(num);
var ax = new Array(num);
var ay = new Array(num);

var magnetism = 10.0; //Strength of attraction If you make it negative, it becomes a repulsive force.
var radius = 1; //Radius of the circle to draw
var gensoku = 0.95; // Slow down particle movement

//no setup() needed, everything there now happens in global scope

// equivalent to createCanvas(windowWidth,windowHeight)
var c = document.createElement("canvas");
document.body.appendChild(c);
var ctx = c.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.strokeStyle = "rgba(1, 1, 1, 0)"; // NoStroke()
ctx.fillStyle = "#000000"; //fill(0)
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); //background(0)
ctx.globalCompositeOperation = 'lighter'; //blendMode(ADD)

for(var i =0; i< num; i++){
  x[i] = Math.random() * ctx.canvas.width;
  y[i] = Math.random() * ctx.canvas.height;
  vx[i] = 0;
  vy[i] = 0;
  ax[i] = 0;
  ay[i] = 0;
}

//Additional setup for mouse events
var mouseX = 0;
var mouseY = 0;
c.onmousemove = (e) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

//extra function needed
function map (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//Gets called around 60 times per second by window.requestAnimationFrame(), generally matches display refresh rate
function draw() {
  ctx.fillStyle = "#000000"; //fill(0, 0, 0)
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); //rect(0,0,width,height);

  for(var i=0; i<num; i++){
    var distance = Math.hypot(x[i] - mouseX, y[i] - mouseY); //dist(mouseX, mouseY, x[i], y[i]);
    //Acceleration is inversely proportional to the square of the distance from the center of attraction.
    if(distance > 3){ //Does not update the acceleration if it is too close to the mouse
      ax[i] = magnetism * (mouseX - x[i]) / (distance * distance);
      ay[i] = magnetism * (mouseY - y[i]) / (distance * distance);
    }
    vx[i] += ax[i]; // Increase the speed vx by ax per frame.
    vy[i] += ay[i]; // Increase speed vy by ay per frame.

    vx[i] = vx[i]*gensoku;
    vy[i] = vy[i]*gensoku;

    x[i] += vx[i];  // Advance vx pixels per frame.
    y[i] += vy[i];  // Advance vy pixels per frame.

    var sokudo = Math.hypot(vx[i],vy[i]); // dist(0,0,vx[i],vy[i]); Find velocity from X and Y components of velocity
    var r = map(sokudo, 0, 5, 0, 255); //Calculate color according to speed
    var g = map(sokudo, 0,5, 64, 255);
    var b = map(sokudo, 0,5, 128, 255);
    var alpha = map(32, 0, 255, 0, 1); // Extra remapping needed
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`; //fill(r, g, b, 32)

    //Equivalent to ellipse(x[i],y[i],radius,radius)
    ctx.beginPath();
    ctx.ellipse(x[i], y[i], radius, radius, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);


