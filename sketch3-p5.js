const vect = [];
let strokeWidth = 0,
    screenSize = 0,
    mainHeight = 0,
    mainStartY = 0,
    nrVectorsX = 15,
    nrVectorsY = 0,
    centerX = 0,
    centerY = 0,
    vectorBaseWidth = 0,
    vectorBaseHeight = 0;

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.zIndex = 0;
    }
    points() {
        this.x1 = this.x * vectorBaseWidth;
        this.y1 = mainStartY + this.y * vectorBaseHeight + strokeWidth * 0.5;
        const distance = dist(centerX, centerY, this.x1, this.y1);
        const rad = mouseIsPressed ? screenSize / 6 : screenSize / 4;
        const len = mouseIsPressed ? 5 : 1;
        if (distance < rad) {
            const k = PI * abs(distance / rad); //Smaller the closer to the center, ranges between 0 and 3.14
            const M = sin(k) * len; //Ranges from 0 to 1 to 0 (if no mousepress)
            const distX = centerX - this.x1;
            const distY = centerY - this.y1;
            this.zIndex = 1 + 3 * (1 - sin(k * 0.5)); //ranges between 1 and 4
            this.x2 = 1 + this.x1 - distX * M;
            this.y2 = 1 + this.y1 - distY * M;
        } else {
            this.zIndex = 1000;
        }
    }
    draw() {
        if (!(this.x == 3 && (this.y == 3 || this.y == 4000))) {
            // return;
        }

        //Shadow
        stroke("rgba(0, 0, 0, 0.3)");
        line(this.x1 + strokeWidth * 0.35, this.y1, this.x2 + strokeWidth * 0.35, this.y2) //Replaces all path commands, shadow is offset by 0.35 times the stroke width

        //Actual vector
        // The closer the mouse is, the higher the zIndex and brighter color
        // The further down the mouse, the more red. The further to the right, the more blue.
        const c = round(-196 + this.zIndex * 255);
        stroke(`rgb(
            ${round(c * mouseY / mainHeight)},
            ${round(c * 0.5)},
            ${round(c * mouseX / screenSize)}
        )`);

        line(this.x1, this.y1, this.x2, this.y2); //Replaces all path commands
    }
};

function reset() {
    screenSize = max(width, height); //size of larger screen dimension
    mainHeight = height * 0.6 - 6; //Height of "main" area
    mainStartY = height * 0.2 + 2; //Start y pos of "main" area
    strokeWidth = round(screenSize / 20); //Dependent on screen size
    vectorBaseWidth = screenSize / nrVectorsX; //Width for base for one vector
    nrVectorsY = round(nrVectorsX * mainHeight / screenSize); //The narrower the screen, the thinner the vectors are and the more they are
    vectorBaseHeight = (mainHeight - strokeWidth) / nrVectorsY; //Height for base for one vector
    // ---- reset ----
    vect.length = 0;
    for (let j = 0; j <= nrVectorsY; j++) {
        for (let i = 0; i <= nrVectorsX; i++) {
            vect.push(new Vector(i, j));
        }
    }
};

//Replaces canvas.init()
function setup() {
    createCanvas(windowWidth,windowHeight); // Replaces all canvas setup and width and height declarations
    background(0); // Instead of setting the color in CSS
    reset();
};

//Replaces canvas.resize()
function windowResized() {
    resizeCanvas(windowWidth, windowHeight); //Replaces size and width declarations
    background(0); // Instead of setting the color in CSS
    reset();
}

function draw() {
    noStroke(); //Needed to avoid window borders

    // ---- clear background ----
    fill('#2a2a2a');
    rect(0, 0, width, height * 0.2);
    rect(0, height * 0.8, width, height * 0.2);
    //instead of clearRect()
    fill(0);
    rect(0, height * 0.2, width, height * 0.6);

    // ---- easing mouse ----
    centerX += (mouseX - centerX) * 0.1; //Center of focus for vectors
    centerY += (mouseY - centerY) * 0.1;
    // ---- calculate positions ----
    for (const o of vect) o.points();
    // ---- zIndex sorting ----
    vect.sort(function(p0, p1) {
        return p0.zIndex - p1.zIndex; //Higher z-index means it is drawn later, on top of earlier vectors
    });
    // ---- draw ----
    strokeCap(ROUND);
    strokeWeight(strokeWidth);
    for (const o of vect) {
        if (o.zIndex < 1000) {
            o.draw();
        }
    }
};