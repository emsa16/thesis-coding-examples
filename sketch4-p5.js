let mapImage, locationData, nameData, dataData, font, locationTable, nameTable, rowCount, dataTable, interpolators, closestDist, closestText, closestTextX, closestTextY,
    dataMin = -10,
    dataMax = 10;


function preload() {
    mapImage = loadImage("sketch4-data/map.png");
    locationData = loadStrings("sketch4-data/locations.tsv");
    nameData = loadStrings("sketch4-data/names.tsv");
    dataData = loadStrings("sketch4-data/random.tsv");
    font = loadFont("sketch4-data/UNVR65W.TTF");
}


function setup() {
  createCanvas(640, 400);
  locationTable = new Table(locationData);
  nameTable = new Table(nameData);
  rowCount = locationTable.getRowCount();

  dataTable = new Table(dataData);
  interpolators = new Array(rowCount);
  for (let row = 0; row < rowCount; row++) {
    const initialValue = dataTable.getFloat(row, 1);
    interpolators[row] = new Integrator(initialValue);
  }

  textFont(font);

  smooth();
  noStroke();
  frameRate(30); //To make state transition animation slower and more visible
}


function draw() {
  background(255);
  image(mapImage, 0, 0);

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
    fill(0);
    textAlign(CENTER);
    text(closestText, closestTextX, closestTextY);
  }
}


function drawData(x, y, abbrev) {
  // Figure out what row this is
  const row = dataTable.getRowIndex(abbrev);
  // Get the current value
  const value = interpolators[row].value;

  let radius = 0;
  if (value >= 0) {
    radius = map(value, 0, dataMax, 1.5, 15);
    fill('#333366');  // blue
  } else {
    radius = map(value, 0, dataMin, 1.5, 15);
    fill('#ec5166');  // red
  }
  ellipseMode(RADIUS);
  ellipse(x, y, radius, radius);

  const d = dist(x, y, mouseX, mouseY);
  if ((d < radius + 2) && (d < closestDist)) {
    closestDist = d;
    const name = nameTable.getString(abbrev, 1);
    const val = nfp(interpolators[row].targetProp, 0, 2);
    closestText = name + " " + val;
    closestTextX = x;
    closestTextY = y-radius-4;
  }
}


function keyPressed() {
  if (keyCode === 32) { //Space character
    updateTable();
  }
}


function updateTable() {
  for (let row = 0; row < rowCount; row++) {
    const newValue = random(dataMin, dataMax);
    interpolators[row].target(newValue);
  }
}