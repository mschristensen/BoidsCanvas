var BoidsCanvas = function(canvas, options) {
  this.canvasDiv = canvas;
  this.canvasDiv.size = {
    'width': this.canvasDiv.offsetWidth,
    'height': this.canvasDiv.offsetHeight
  };

  //TODO: set options
  //      --background colour
  //      --number of boids
  //      --other boids options

  // Set options
  options = options !== undefined ? options : {};
  this.options = {
    background: (options.background !== undefined) ? options.background : '#1a252f'
  };

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

  //TODO: initialise boids

  //TODO: call initial requestAnimationFrame on update

}

BoidsCanvas.prototype.update = function() {
  //TODO: recalc boids

  //TODO: draw boids

  //TODO: recall requestAnimationFrame on update
}

// Helper method to set multiple styles
BoidsCanvas.prototype.setStyles = function (div, styles) {
  for (var property in styles) {
    div.style[property] = styles[property];
  }
}
