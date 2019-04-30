// Gravity / Repulsion model
var num = 1000;
var vx = new Array(num);
var vy = new Array(num);
var x = new Array(num);
var y = new Array(num);
var ax = new Array(num);
var ay = new Array(num);

var magnetism = 10.0; //Strength of attraction If you make it negative, it becomes a repulsive force.
var radius = 1 ; //Radius of the circle to draw
var gensoku = 0.95; // Slow down particle movement

function setup(){
  createCanvas(windowWidth,windowHeight);
  noStroke();
  fill(0);
  ellipseMode(RADIUS);
  background(0);
  blendMode(ADD);

  for(var i =0; i< num; i++){
    x[i] = random(width);
    y[i] = random(height);
    vx[i] = 0;
    vy[i] = 0;
    ax[i] = 0;
    ay[i] = 0;
  }
}


function draw(){
  fill(0,0,0);
  rect(0,0,width,height);

  for(var i=0; i<num; i++){
    var distance = dist(mouseX, mouseY, x[i], y[i]); //dist(x1,y1,x2,y2) Function to find the distance between two points
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

    var sokudo = dist(0,0,vx[i],vy[i]); // Find velocity from X and Y components of velocity
    var r = map(sokudo, 0, 5, 0, 255); //Calculate color according to speed
    var g = map(sokudo, 0,5, 64, 255);
    var b = map(sokudo, 0,5, 128, 255);
    fill(r, g, b, 32);
    ellipse(x[i],y[i],radius,radius);
  }

}