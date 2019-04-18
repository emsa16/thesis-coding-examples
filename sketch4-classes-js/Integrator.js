const DAMPING = 0.5;
const ATTRACTION = 0.2;

class Integrator {
    constructor(value, damping, attraction) {
        this.value = value;
        this.damping = damping || DAMPING;
        this.attraction = attraction || ATTRACTION;
        this.vel = 0;
        this.accel = 0;
        this.force = 0;
        this.mass = 1;
        this.targeting = false;
        this.targetProp = 0;
    }


    set(v) {
      this.value = v;
    }


    update() {
      if (this.targeting) {
        this.force += this.attraction * (this.targetProp - this.value);
      }

      this.accel = this.force / this.mass;
      this.vel = (this.vel + this.accel) * this.damping;
      this.value += this.vel;

      this.force = 0;
    }


    target(t) {
      this.targeting = true;
      this.targetProp = t;
    }


    noTarget() {
      this.targeting = false;
    }
}