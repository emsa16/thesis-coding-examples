var PARTICLES_FROM_POINT = 32,
		GRAVITY = .01,
		δ = Math.PI/90,
		c = document.querySelector('canvas'),
		ct = c.getContext('2d'), w, h, cr,
		particles = [];

var rand = function(max, min, is_int) {
	var max = ((max - 1) || 0) + 1,
			min = min || 0,
			gen = min + (max - min)*Math.random();

	return is_int?Math.round(gen):gen;
};

var rsgn = function(k) {
	return (Math.random() < (k || .5))?-1:1;
};

var Particle = function(x, y, c, r) {
	this.x = x || 0;
	this.y = y || 0;
	this.vx = rsgn()*rand(.5,.125);
	this.vy = rsgn()*rand(.5,.125);
	this.ax = 0;
	this.ay = GRAVITY;
	this.c = c || 'white';
	this.alpha = 1;
	this.r = r || rand(3,.5);

	this.evolve = function() {
		this.alpha -= .008;

		this.vx += this.ax;
		this.vy += this.ay;

		this.x += this.vx;
		this.y += this.vy;

		if(this.y > .5*w - this.r) {
			this.y = .5*w - this.r;
			this.vx *= .95;
			this.vy *= -.9;
		}

		if((Math.abs(this.x) > .5*w + 2*this.r) ||
			 (this.y < -.5*h - 2*this.r) ||
			 this.alpha <= 0) {
			this.destroy();
			return;
		}
		else { this.draw(); }
	};

	this.draw = function() {
		ct.fillStyle = this.c;
		ct.globalAlpha = this.alpha;
		ct.beginPath();
		ct.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ct.closePath();
		ct.fill();
	};

	this.destroy = function() {
		var idx = particles.indexOf(this);
		particles.splice(idx, 1);
	};
};

var size = function() {
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
	cr = .25*Math.min(h, w);
	ct.restore();
	ct.save();
	ct.translate(.5*w, .5*h);
};

var ani = function(φ) {
	var _r = cr*(2 + Math.sin(.73*φ))/2,
			x = _r*Math.cos(φ), y = _r*Math.sin(φ),
			hue = ~~(.183*φ/Math.PI*360)%360, light, p,
			n = particles.length;

	ct.fillStyle = 'rgba(0,0,0,.08)';
	ct.beginPath();
	ct.fillRect(-.5*w, -.5*h, w, h)

	for(var i = 0; i < n; i++) {
		particles[i].evolve();

		if(particles.length != n) {
			n--;
			i--;
		}
	}

	for(var i = 0; i < PARTICLES_FROM_POINT; i++) {
		light = 40*(1  + Math.random());
		p = new Particle(x + rsgn()*rand(8), y + rsgn()*rand(8), 'hsl(' + hue + ',100%,' + light + '%)');
		p.draw();
		particles.push(p);
	}

	requestAnimationFrame(ani.bind(this, φ + δ))
};

size();
ani(0);

addEventListener('resize', size, false);