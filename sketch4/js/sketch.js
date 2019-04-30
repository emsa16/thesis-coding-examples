let rowCount, interpolators,
    closestDist, closestText, closestTextX, closestTextY,
    now, delta;
const dataMin = -10;
const dataMax = 10;


// No setup() necessary
// equivalent to createCanvas(640, 400)
const c = document.createElement("canvas");
document.body.appendChild(c);
const ctx = c.getContext("2d");
const width = ctx.canvas.width = 640;
const height = ctx.canvas.height = 400;

const mapImage = new Image();
mapImage.src = '../data/map.png'; //loadImage("../data/map.png")

//File contents are loaded later in load()
let locationTable = new Table();
let nameTable = new Table();
let dataTable = new Table();

ctx.font = '12px Univers'; // textFont(font); loadFont() is also replaced by loading font through CSS

ctx.imageSmoothingEnabled = true; // smooth()
ctx.strokeStyle = "rgba(1, 1, 1, 0)"; // NoStroke()

//instead of frameRate(30), frame durations are calculated and FPS controlled in draw()
const fps = 30;
const interval = 1000/fps;
let then = Date.now();


//Additional setup for mouse events
let mouseX = 0;
let mouseY = 0;
c.onmousemove = (e) => {
  //Coordinates are counted inside target element
  mouseX = e.offsetX;
  mouseY = e.offsetY;
}


//extra function needed
function map (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


//Instead of preload(), asynchronously load file contents for the tables
async function load() {
  // Instead of loadStrings() in preload()
  await locationTable.init("../data/locations.tsv");
  await nameTable.init("../data/names.tsv");
  await dataTable.init("../data/random.tsv");

  rowCount = locationTable.getRowCount();
  interpolators = [];
  for (let row = 0; row < rowCount; row++) {
    const initialValue = dataTable.getFloat(row, 1);
    interpolators[row] = new Integrator(initialValue);
  }
}
load();


function draw() {
  window.requestAnimationFrame(draw);

  //Controlling FPS
  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);

    // Equal to background(255)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(mapImage, 0, 0); // image(mapImage, 0, 0);

    for (let row = 0; row < rowCount; row++) {
      interpolators[row].update();
    }

    closestDist = width*height;  // abritrarily high

    for (let row = 0; row < rowCount; row++) {
      const abbrev = dataTable.getRowName(row);
      const x = locationTable.getFloat(abbrev, 1);
      const y = locationTable.getFloat(abbrev, 2);
      drawData(x, y, abbrev);
    }

    if (closestDist != width*height) {
      ctx.fillStyle = "#000000"; // fill(0);
      ctx.textAlign = 'center'; // textAlign(CENTER);
      ctx.fillText(closestText, closestTextX, closestTextY); //text(closestText, closestTextX, closestTextY);
    }
  }
}
window.requestAnimationFrame(draw);


function drawData(x, y, abbrev) {
  // Figure out what row this is
  const row = dataTable.getRowIndex(abbrev);
  // Get the current value
  const value = interpolators[row].value;

  let radius;
  if (value >= 0) {
    radius = map(value, 0, dataMax, 1.5, 15);
    ctx.fillStyle = '#333366'; // fill('#333366');  // blue
  } else {
    radius = map(value, 0, dataMin, 1.5, 15);
    ctx.fillStyle = '#ec5166'; // fill('#ec5166');  // red
  }

  //Equivalent to ellipse(x, y, radius, radius), ellipseMode() not needed
  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
  ctx.fill();

  const d = Math.hypot(x - mouseX, y - mouseY) // d = dist(x, y, mouseX, mouseY);
  if ((d < radius + 2) && (d < closestDist)) {
    closestDist = d;
    const name = nameTable.getString(abbrev, 1);

    //Equal to nfp(interpolators[row].value, 0, 2);
    let val = interpolators[row].value.toFixed(2);
    val = (val <= 0 ? "": "+") + val;

    closestText = name + " " + val;
    closestTextX = x;
    closestTextY = y-radius-4;
  }
}


function keyPressed(e) {
  if (e.keyCode === 32) { //Space character
    updateTable();
  }
}
window.addEventListener('keydown', keyPressed);


function updateTable() {
  for (let row = 0; row < rowCount; row++) {
    const newValue = Math.random() * (dataMax - dataMin) + dataMin; //random(dataMin, dataMax);
    interpolators[row].target(newValue);
  }
}