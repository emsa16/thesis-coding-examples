var PARTICLES_FROM_POINT = 32,
    GRAVITY = .01,
    δ,
    cr,
    particles = [],
    φ = 0;

var randomSign = (k) => (random() < (k || .5)) ? -1: 1; //TEMP FINNS DETTA I P5?

var Particle = function(x, y, c, r) {
	this.x = x || 0;
	this.y = y || 0;
	this.vx = randomSign() * random(.125, .5);
	this.vy = randomSign() * random(.125, .5);
	this.ax = 0;
	this.ay = GRAVITY;
	this.c = c || 'white';
	this.alpha = 255;
	this.r = r || random(.5, 3);

	this.evolve = function() {
		this.alpha -= 2.04; // p5 alpha values go 0-255, so decrement value is 255 * 0,008 = 2,04

		this.vx += this.ax;
		this.vy += this.ay;

		this.x += this.vx;
		this.y += this.vy;

    //TEMP denna verkar hantera att partiklarna når botten på canvaselementet, fast varför jobbar den med bredden? Är detta ett fel?
		if (this.y > .5 * width - this.r) {
			this.y = .5 * width - this.r;
			this.vx *= .95;
			this.vy *= -.9;
		}

    //TEMP abs(this.x) > .5 * width ??? att partikeln tas bort om x är mer än halva bredden?
    //TEMP this.y < -.5 * height ???? det kommer aldrig hända
		if ((abs(this.x) > .5 * width + 2 * this.r) || (this.y < -.5 * height - 2 * this.r) || this.alpha <= 0) {
			this.destroy();
			return;
		} else {
      this.draw();
    }
	};

	this.draw = function() {
    var c = color(this.c);
    c.setAlpha(this.alpha); //ct.globalAlpha = this.alpha;
    fill(c); //ct.fillStyle = this.c;
    circle(this.x, this.y, this.r); //Replaces creating Canvas circles with arc
	};

	this.destroy = function() {
		var idx = particles.indexOf(this);
		particles.splice(idx, 1);
	};
};



function setup() {
  createCanvas(windowWidth,windowHeight); // Replaces all canvas setup and width and height declarations
  background(0); // Instead of setting the color in CSS
  noStroke();  //Needed addition, default seems to be black stroke

  // TEMP BEHÖVS?
  // html {
  //   overflow: hidden;
  // }

  cr = .25 * min(height, width); //TEMP VAD ÄR DETTA???
  δ = PI/90; //TEMP FINNS DETTA I P5?

  // TEMP TEST
  // var _r = cr * (2 + sin(.73 * φ))/2,
  // x = _r * cos(φ),
  // y = _r * sin(φ),
  // hue = ~~(.183 * φ / PI * 360) % 360,
  // light,
  // p;
  // translate(.5 * width, .5 * height);
  // light = 40 * (1  + random());
  // p = new Particle(x + randomSign() * random(8), y + randomSign() * random(8), 'hsl(' + hue + ',100%,' + light + '%)');
  // p.draw();
  // particles.push(p);
};



//Replaces size() and addEventListener('resize', size, false)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0); // Instead of setting the color in CSS
  noStroke();  //Needed addition, default seems to be black stroke
  cr = .25 * min(height, width); //TEMP VAD ÄR DETTA???
}



function draw() {
  var _r = cr * (2 + sin(.73 * φ))/2, //TEMP VAD ÄR DETTA?
      x = _r * cos(φ),
      y = _r * sin(φ),
      hue = ~~(.183 * φ / PI * 360) % 360,
      light,
      p,
      n = particles.length;

  translate(.5 * width, .5 * height);

  fill('rgba(0, 0, 0, 0.08)');
  rect(-.5 * width, -.5 * height, width, height); //TEMP Default rectmode är corner, ska det verkligen vara såhär?

  for(var i = 0; i < n; i++) {
    particles[i].evolve();

    if(particles.length != n) {
      n--;
      i--;
    }
  }

  for(var i = 0; i < PARTICLES_FROM_POINT; i++) {
    light = 40 * (1  + random());
    p = new Particle(x + randomSign() * random(8), y + randomSign() * random(8), 'hsl(' + hue + ',100%,' + light + '%)');
    p.draw();
    particles.push(p);
  }

  φ += δ; //Replaces injecting φ + δ into the ani() function

  // TEMP funderar på this
  // requestAnimationFrame(ani.bind(this, φ + δ))
};



//TEMP TA BORT
function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}

