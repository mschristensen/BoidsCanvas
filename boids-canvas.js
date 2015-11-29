// VECTOR HELPER CLASS
var Vector = function(x, y) {
  if(x === 'undefined') x = 0;
  if(y === 'undefined') y = 0;
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function(v) {
  return new Vector(this.x + v.x, this.y + v.y);
}
Vector.prototype.sub = function(v) {
  return new Vector(this.x - v.x, this.y - v.y);
}
Vector.prototype.mul = function(v) {
  return new Vector(this.x * v.x, this.y * v.y);
}
Vector.prototype.div = function(v) {
  return new Vector(this.x / v.x, this.y / v.y);
}
Vector.prototype.mag = function() {
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
}
Vector.prototype.normalise = function(v) {
  var mag = this.mag();
  return new Vector(this.x / mag, this.y / mag);
}
Vector.prototype.dist = function(v) {
  return Math.sqrt((this.x - v.x)*(this.x - v.x) + (this.y - v.y)*(this.y - v.y));
}
Vector.prototype.limit = function(limit) {
  var v;
  if(this.mag() > limit) {
    v = this.normalise().mul(new Vector(limit, limit));
  } else {
    v = this;
  }
  return v;
}

// INDIVIDUAL BOID CLASS
var Boid = function(parent, position, velocity, size, colour) {
  // Initialise the boid parameters
  this.position = new Vector(position.x, position.y);
  this.velocity = new Vector(velocity.x, velocity.y);
  this.acceleration = new Vector(0, 0);

  // Check if valid colour
  if (!(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(colour)) {
    console.error('Please specify a valid boid hexadecimal color');
    return false;
  }
  this.size = size;
  this.colour = colour;
  this.parent = parent;
}

Boid.prototype.draw = function () {
  // Draw boid
  this.parent.ctx.beginPath();
  this.parent.ctx.fillStyle = this.colour;
  this.parent.ctx.globalAlpha = 0.7;
  this.parent.ctx.arc(this.position.x, this.position.y, this.parent.boidRadius * this.size, 0, 2 * Math.PI);
  this.parent.ctx.fill();
};

/* Update the boid positions according to Reynold's rules.
** Called on every frame  */
Boid.prototype.update = function () {
  var v1 = this.cohesion();
  var v2 = this.separation();
  var v3 = this.alignment();
  var v4 = this.interactivity();

  // Weight rules to get best behaviour
  v1 = v1.mul(new Vector(1, 1));
  v2 = v2.mul(new Vector(1.5, 1.5));
  v3 = v3.mul(new Vector(1, 1));
  v4 = v4.mul(new Vector(1.8, 1.8));

  this.applyForce(v1);
  this.applyForce(v2);
  this.applyForce(v3);
  this.applyForce(v4);

  this.velocity = this.velocity.add(this.acceleration);
  this.velocity = this.velocity.limit(this.parent.options.speed);

  this.position = this.position.add(this.velocity);
  this.acceleration = this.acceleration.mul(new Vector(0, 0));
  this.borders();
}

// BOIDS FLOCKING RULES

/* Cohesion rule: steer towards average position of local flockmates */
Boid.prototype.cohesion = function () {
  var sum = new Vector(0, 0); // Average flockmate position
  var count = 0;  // number of local flockmates

  // For each boid close enough to be seen...
  for(var i = 0; i < this.parent.boids.length; i++) {
    var d = this.position.dist(this.parent.boids[i].position);
    if(d > 0 && d < this.parent.visibleRadius) {
      sum = sum.add(this.parent.boids[i].position);
      count++;
    }
  }

  if(count > 0) {
    // Calculate average position and return the force required to steer towards it
    sum = sum.div(new Vector(count, count));
    sum = this.seek(sum);
    return sum;
  } else {
    return new Vector(0, 0);
  }
}

/* Separation rule: steer to avoid crowding local flockmates */
Boid.prototype.separation = function () {
  var steer = new Vector(0, 0); // Average steer
  var count = 0;  // number of flockmates considered "too close"

  // For each boid which is too close, calculate a vector pointing
  // away from it weighted by the distance to it
  for(var i = 0; i < this.parent.boids.length; i++) {
    var d = this.position.dist(this.parent.boids[i].position) - (this.size * this.parent.boidRadius);
    if(d > 0 && d < this.parent.separationDist) {
      var diff = this.position.sub(this.parent.boids[i].position);
      diff = diff.normalise();
      diff = diff.div(new Vector(d, d));
      steer = steer.add(diff);
      count++;
    }
  }
  // Calculate average
  if(count > 0) {
    steer = steer.div(new Vector(count, count));
  }

  // Steering = Desired - Velocity
  if(steer.mag() > 0) {
    steer = steer.normalise();
    steer = steer.mul(new Vector(this.parent.options.speed, this.parent.options.speed));
    steer = steer.sub(this.velocity);
    steer = steer.limit(this.parent.maxForce);
  }
  return steer;
}

/* Alignment rule: steer toward average heading of local flockmates */
Boid.prototype.alignment = function () {
  var sum = new Vector(0, 0); // Average velocity
  var count = 0;  // number of local flockmates

  // For each boid which is close enough to be seen
  for(var i = 0; i < this.parent.boids.length; i++) {
    var d = this.position.dist(this.parent.boids[i].position);
    if(d > 0 && d < this.parent.visibleRadius) {
      sum = sum.add(this.parent.boids[i].velocity);
      count++;
    }
  }

  if(count > 0) {
    // Calculate average and limit
    sum = sum.div(new Vector(count, count));
    sum = sum.normalise();
    sum = sum.mul(new Vector(this.parent.options.speed, this.parent.options.speed));

    // Steering = Desired - Velocity
    var steer = sum.sub(this.velocity);
    steer = steer.limit(this.parent.maxForce);
    return steer;
  } else {
    return new Vector(0, 0);
  }
}

Boid.prototype.interactivity = function () {
  if(this.parent.options.interactive && this.parent.mousePos !== undefined &&
     this.position.dist(this.parent.mousePos) < this.parent.visibleRadius) {
    return this.seek(this.parent.mousePos);
  } else {
    return new Vector(0, 0);
  }
}

// Implement torus boundaries
Boid.prototype.borders = function() {
  if(this.position.x < 0) this.position.x = this.parent.canvas.width;
  if(this.position.y < 0) this.position.y = this.parent.canvas.height;
  if(this.position.x > this.parent.canvas.width) this.position.x = 0;
  if(this.position.y > this.parent.canvas.height) this.position.y = 0;
}

/* Calculate a force to apply to a boid to steer
** it towards a target position */
Boid.prototype.seek = function(target) {
  var desired = target.sub(this.position);
  desired = desired.normalise();
  desired = desired.mul(new Vector(this.parent.options.speed, this.parent.options.speed));

  var steer = desired.sub(this.velocity);
  steer = steer.limit(this.parent.maxForce);
  return steer;
}

// Adjust the acceleration by applying a force, using A = F / M
// with M = boid size so that larger boids have more inertia
Boid.prototype.applyForce = function(force) {
  this.acceleration = this.acceleration.add(force.div(new Vector(this.size, this.size)));
}

// BOIDS CANVAS CLASS
var BoidsCanvas = function(canvas, options) {
  this.canvasDiv = canvas;
  this.canvasDiv.size = {
    'width': this.canvasDiv.offsetWidth,
    'height': this.canvasDiv.offsetHeight
  };

  // Set customisable boids parameters
  options = options !== undefined ? options : {};
  this.options = {
    background: (options.background !== undefined) ? options.background : '#1a252f',
    density: this.setDensity(options.density),
    speed: this.setSpeed(options.speed),
    interactive: (options.interactive !== undefined) ? options.interactive : true,
    mixedSizes: (options.mixedSizes !== undefined) ? options.mixedSizes : true,
    boidColours: (options.boidColours !== undefined && options.boidColours.length != 0) ? options.boidColours : ["#ff3333"]
  };

  // Internal boids parameters
  this.visibleRadius = 150;
  this.maxForce = 0.04;
  this.separationDist = 80;
  this.boidRadius = 5;  //size of the smallest boid

  this.init();
}

BoidsCanvas.prototype.init = function() {

  // Create background div
  this.bgDiv = document.createElement('div');
  this.canvasDiv.appendChild(this.bgDiv);
  this.setStyles(this.bgDiv, {
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'bottom': 0,
    'right': 0,
    'z-index': 1
  });

  // Check if valid background hex color
  if ((/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(this.options.background)) {
    this.setStyles(this.bgDiv, {
      'background': this.options.background
    });
  }
  // Else check if valid image
  else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(this.options.background)) {
    this.setStyles(this.bgDiv, {
      'background': 'url("' + this.options.background + '") no-repeat center',
      'background-size': 'cover'
    });
  }
  // Else throw error
  else {
    console.error('Please specify a valid background image or hexadecimal color');
    return false;
  }

  // Create canvas & context
  this.canvas = document.createElement('canvas');
  this.canvasDiv.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
  this.canvas.width = this.canvasDiv.size.width;
  this.canvas.height = this.canvasDiv.size.height;
  this.setStyles(this.canvasDiv, { 'position': 'relative' });
  this.setStyles(this.canvas, {
    'z-index': '20',
    'position': 'relative'
  });

  // Add resize listener to canvas
  window.addEventListener('resize', function () {
    // Check if div has changed size
    if (this.canvasDiv.offsetWidth === this.canvasDiv.size.width && this.canvasDiv.offsetHeight === this.canvasDiv.size.height) {
      return false;
    }

    // Scale canvas
    this.canvas.width = this.canvasDiv.size.width = this.canvasDiv.offsetWidth;
    this.canvas.height = this.canvasDiv.size.height = this.canvasDiv.offsetHeight;

    this.initialiseBoids();
  }.bind(this));

  this.initialiseBoids();

  // Mouse event listeners
  this.canvas.addEventListener('mousemove', function (e) {
    this.mousePos = new Vector(e.clientX - this.canvas.offsetLeft,
                               e.clientY - this.canvas.offsetTop);
  }.bind(this));
  this.canvas.addEventListener('mouseleave', function (e) {
    this.mousePos = undefined;
  }.bind(this));

  // Update canvas
  requestAnimationFrame(this.update.bind(this));
}

// Initialise boids according to options
BoidsCanvas.prototype.initialiseBoids = function() {
  this.boids = [];
  for(var i = 0; i < this.canvas.width * this.canvas.height / this.options.density; i++) {
    var position = new Vector(Math.floor(Math.random()*(this.canvas.width+1)),
                              Math.floor(Math.random()*(this.canvas.height+1)));
    var max_velocity = 5;
    var min_velocity = -5;
    var velocity = new Vector(Math.floor(Math.random()*(max_velocity-min_velocity+1)+min_velocity),
                              Math.floor(Math.random()*(max_velocity-min_velocity+1)+min_velocity));
    var size = (this.options.mixedSizes) ? Math.floor(Math.random()*(3-1+1)+1) : 1;
    var colourIdx = Math.floor(Math.random()*(this.options.boidColours.length-1+1));
    this.boids.push(new Boid(this, position, velocity, size, this.options.boidColours[colourIdx]));
  }
}

BoidsCanvas.prototype.update = function() {
  // Clear canvas
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.globalAlpha = 1;

  // Update and draw boids
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].update();
    this.boids[i].draw();
  }

  // Request next frame
  requestAnimationFrame(this.update.bind(this));
}

// Helper method to set density multiplier
BoidsCanvas.prototype.setSpeed = function (speed) {
  if (speed === 'fast') {
    return 3;
  }
  else if (speed === 'slow') {
    return 1;
  }
  return 2;
}

// Helper method to set density multiplier
BoidsCanvas.prototype.setDensity = function (density) {
  if (density === 'high') {
    return 5000;
  }
  else if (density === 'low') {
    return 20000;
  }
  return 10000;
}

// Helper method to set multiple styles
BoidsCanvas.prototype.setStyles = function (div, styles) {
  for (var property in styles) {
    div.style[property] = styles[property];
  }
}
