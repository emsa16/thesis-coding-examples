PImage mapImage;
Table locationTable;
Table nameTable;
int rowCount;

Table dataTable;
float dataMin = -10;
float dataMax = 10;

Integrator[] interpolators;


void setup() {
  size(640, 400);
  mapImage = loadImage("map.png");
  locationTable = new Table("locations.tsv");
  nameTable = new Table("names.tsv");
  rowCount = locationTable.getRowCount();  
  
  dataTable = new Table("random.tsv");
  interpolators = new Integrator[rowCount];
  for (int row = 0; row < rowCount; row++) {
    float initialValue = dataTable.getFloat(row, 1);
    interpolators[row] = new Integrator(initialValue, 0.9, 0.1);
  }
  
  PFont font = loadFont("Univers-Bold-12.vlw");
  textFont(font);

  smooth();
  noStroke();  
  //frameRate(30);
}

float closestDist;
String closestText;
float closestTextX;
float closestTextY;


void draw() {
  background(255);
  image(mapImage, 0, 0);
  
  for (int row = 0; row < rowCount; row++) {
    interpolators[row].update();
  }
  
  closestDist = width*height;  // abritrarily high
  
  for (int row = 0; row < rowCount; row++) {
    String abbrev = dataTable.getRowName(row);
    float x = locationTable.getFloat(abbrev, 1);
    float y = locationTable.getFloat(abbrev, 2);
    drawData(x, y, abbrev);
  }
  
  if (closestDist != width*height) {
    fill(0);
    textAlign(CENTER);
    text(closestText, closestTextX, closestTextY);
  }
}


void drawData(float x, float y, String abbrev) {
  // Figure out what row this is
  int row = dataTable.getRowIndex(abbrev);
  // Get the current value
  float value = interpolators[row].value;
  
  float radius = 0;
  if (value >= 0) {
    radius = map(value, 0, dataMax, 1.5, 15);
    fill(#333366);  // blue
  } else {
    radius = map(value, 0, dataMin, 1.5, 15);
    fill(#ec5166);  // red
  }
  ellipseMode(RADIUS);
  ellipse(x, y, radius, radius);

  float d = dist(x, y, mouseX, mouseY);
  if ((d < radius + 2) && (d < closestDist)) {
    closestDist = d;
    String name = nameTable.getString(abbrev, 1);
    String val = nfp(interpolators[row].target, 0, 2);
    closestText = name + " " + val;
    closestTextX = x;
    closestTextY = y-radius-4;
  }
}


void keyPressed() {
  if (key == ' ') {
    updateTable();
  }
}


void updateTable() {  
  for (int row = 0; row < rowCount; row++) {
    float newValue = random(dataMin, dataMax);
    interpolators[row].target(newValue);
  }
}
class Integrator {

  final float DAMPING = 0.5f;
  final float ATTRACTION = 0.2f;

  float value;
  float vel;
  float accel;
  float force;
  float mass = 1;

  float damping = DAMPING;
  float attraction = ATTRACTION;
  boolean targeting;
  float target;


  Integrator() { }


  Integrator(float value) {
    this.value = value;
  }


  Integrator(float value, float damping, float attraction) {
    this.value = value;
    this.damping = damping;
    this.attraction = attraction;
  }


  void set(float v) {
    value = v;
  }


  void update() {
    if (targeting) {
      force += attraction * (target - value);      
    }

    accel = force / mass;
    vel = (vel + accel) * damping;
    value += vel;

    force = 0;
  }


  void target(float t) {
    targeting = true;
    target = t;
  }


  void noTarget() {
    targeting = false;
  }
}
class Table {
  int rowCount;
  String[][] data;
  
  
  Table(String filename) {
    String[] rows = loadStrings(filename);
    data = new String[rows.length][];
    
    for (int i = 0; i < rows.length; i++) {
      if (trim(rows[i]).length() == 0) {
        continue; // skip empty rows
      }
      if (rows[i].startsWith("#")) {
        continue;  // skip comment lines
      }
      
      // split the row on the tabs
      String[] pieces = split(rows[i], TAB);
      // copy to the table array
      data[rowCount] = pieces;
      rowCount++;
      
      // this could be done in one fell swoop via:
      //data[rowCount++] = split(rows[i], TAB);
    }
    // resize the 'data' array as necessary
    data = (String[][]) subset(data, 0, rowCount);
  }
  
  
  int getRowCount() {
    return rowCount;
  }
  
  
  // find a row by its name, returns -1 if no row found
  int getRowIndex(String name) {
    for (int i = 0; i < rowCount; i++) {
      if (data[i][0].equals(name)) {
        return i;
      }
    }
    println("No row named '" + name + "' was found");
    return -1;
  }
  
  
  String getRowName(int row) {
    return getString(row, 0);
  }


  String getString(int rowIndex, int column) {
    return data[rowIndex][column];
  }

  
  String getString(String rowName, int column) {
    return getString(getRowIndex(rowName), column);
  }

  
  int getInt(String rowName, int column) {
    return parseInt(getString(rowName, column));
  }

  
  int getInt(int rowIndex, int column) {
    return parseInt(getString(rowIndex, column));
  }

  
  float getFloat(String rowName, int column) {
    return parseFloat(getString(rowName, column));
  }

  
  float getFloat(int rowIndex, int column) {
    return parseFloat(getString(rowIndex, column));
  }
  
  
  void setRowName(int row, String what) {
    data[row][0] = what;
  }


  void setString(int rowIndex, int column, String what) {
    data[rowIndex][column] = what;
  }

  
  void setString(String rowName, int column, String what) {
    int rowIndex = getRowIndex(rowName);
    data[rowIndex][column] = what;
  }

  
  void setInt(int rowIndex, int column, int what) {
    data[rowIndex][column] = str(what);
  }

  
  void setInt(String rowName, int column, int what) {
    int rowIndex = getRowIndex(rowName);
    data[rowIndex][column] = str(what);
  }

  
  void setFloat(int rowIndex, int column, float what) {
    data[rowIndex][column] = str(what);
  }


  void setFloat(String rowName, int column, float what) {
    int rowIndex = getRowIndex(rowName);
    data[rowIndex][column] = str(what);
  }  
}
