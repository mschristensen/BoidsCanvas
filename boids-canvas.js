var Boid = function(parent, position, velocity, colour) {
  this.position = position;
  this.velocity = velocity;

  // Check if valid colour
  if (!(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(colour)) {
    console.error('Please specify a valid boid hexadecimal color');
    return false;
  }
  this.colour = colour;
  this.parent = parent;
}

Boid.prototype.draw = function () {
  // Draw boid
  this.parent.ctx.beginPath();
  this.parent.ctx.fillStyle = this.colour;
  this.parent.ctx.globalAlpha = 0.7;
  this.parent.ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
  this.parent.ctx.fill();
};

Boid.prototype.update = function () {
  var v1 = this.cohesion();
  var v2 = this.separation();
  var v3 = this.alignment();
  var v4 = this.contain();

  this.velocity.x += (v1.x + v2.x + v3.x + v4.x);
  this.velocity.y += (v1.y + v2.y + v3.y + v4.y);

  // Limit the velocity
  var v_mag = Math.sqrt((this.velocity.x * this.velocity.x) + (this.velocity.y * this.velocity.y));
  if(v_mag > this.parent.maxVelocity) {
    this.velocity.x = (this.velocity.x / v_mag) * this.parent.maxVelocity;
    this.velocity.y = (this.velocity.y / v_mag) * this.parent.maxVelocity;
  }

  this.position.x = this.position.x + this.velocity.x;
  this.position.y = this.position.y + this.velocity.y;
}

// BOIDS RULES
Boid.prototype.cohesion = function () {
  var center = { 'x': 0, 'y': 0};
  for(var i = 0; i < this.parent.boids.length; i++) {
    var diff_x = this.parent.boids[i].position.x - this.position.x;
    var diff_y = this.parent.boids[i].position.y - this.position.y;
    var diff = Math.sqrt((diff_x * diff_x) + (diff_y * diff_y));
    if(this != this.parent.boids[i] && diff < this.parent.visibleRadius) {
      center.x += this.parent.boids[i].position.x;
      center.y += this.parent.boids[i].position.y;
    }
  }
  center.x /= ((this.parent.boids.length - 1) * 100);
  center.y /= ((this.parent.boids.length - 1) * 100);
  return center;
}

Boid.prototype.separation = function () {
  var c = { 'x': 0, 'y': 0};
  for(var i = 0; i < this.parent.boids.length; i++) {
    var diff_x = this.parent.boids[i].position.x - this.position.x;
    var diff_y = this.parent.boids[i].position.y - this.position.y;
    var diff = Math.sqrt((diff_x * diff_x) + (diff_y * diff_y));
    if(this != this.parent.boids[i] && diff < this.parent.visibleRadius) {
      //if(diff < 50) {
        c.x -= diff_x;
        c.y -= diff_y;
      //}
    }
  }
  return c;
}

Boid.prototype.alignment = function () {
  var v = { 'x': 0, 'y': 0};
  for(var i = 0; i < this.parent.boids.length; i++) {
    var diff_x = this.parent.boids[i].position.x - this.position.x;
    var diff_y = this.parent.boids[i].position.y - this.position.y;
    var diff = Math.sqrt((diff_x * diff_x) + (diff_y * diff_y));
    if(this != this.parent.boids[i] && diff < this.parent.visibleRadius) {
      v.x += this.velocity.x;
      v.y += this.velocity.y;
    }
  }
  v.x /= ((this.parent.boids.length - 1) * 8);
  v.y /= ((this.parent.boids.length - 1) * 8);
  return v;
}

Boid.prototype.contain = function () {
  var v = {'x': 0, 'y': 0};
  var offset_speed = 100;
  if(this.position.x < 0) {
    v.x = offset_speed;
  } else if(this.position.x > this.parent.canvas.width) {
    v.x = -offset_speed;

  }
  if(this.position.y < 0) {
    v.y = offset_speed;
  } else if(this.position.y > this.parent.canvas.height) {
    v.y = -offset_speed;
  }
  return v;
}

var BoidsCanvas = function(canvas, options) {
  this.canvasDiv = canvas;
  this.canvasDiv.size = {
    'width': this.canvasDiv.offsetWidth,
    'height': this.canvasDiv.offsetHeight
  };

  // Set options
  options = options !== undefined ? options : {};
  this.options = {
    background: (options.background !== undefined) ? options.background : '#1a252f',
    density: this.setDensity(options.density)
  };

  this.maxVelocity = 3;
  this.visibleRadius = 50;

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

  //TODO: add resize listener to canvas

  // Initialise boids
  this.boids = [];
  for(var i = 0; i < this.canvas.width * this.canvas.height / this.options.density; i++) {
    var position = {};
    position.x = Math.floor(Math.random()*(this.canvas.width+1));
    position.y = Math.floor(Math.random()*(this.canvas.height+1));
    var velocity = {};
    var max_velocity = 5;
    var min_velocity = -5;
    velocity.x = Math.floor(Math.random()*(max_velocity-min_velocity+1)+min_velocity);
    velocity.y = Math.floor(Math.random()*(max_velocity-min_velocity+1)+min_velocity);
    this.boids.push(new Boid(this, position, velocity, "#ff3333"));
  }

  //TODO: add mouse event listeners

  // Update canvas
  requestAnimationFrame(this.update.bind(this));
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
