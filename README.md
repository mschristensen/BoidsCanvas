# BoidsCanvas

## Overview

A sexy looking HTML5 and Javascript implementation of Craig Reynold's boids algorithm for flocking behaviour. Fully plug n' play, modular and customisable.

[See it live on CodePen](http://codepen.io/MikeC1995/pen/RWXoOe)

Go ahead and fork the repo and open `demo.html` to give it a go!

## Usage

Clone the repository to get started. Use this animation on your webpage simply by:

```html
<body>
  <div id="boids-canvas"></div>
  <script type="text/javascript" src="boids-canvas.js"></script>
  <script type="text/javascript">
    var boidsCanvas = new BoidsCanvas(canvasDiv, options);
  </script>
</body>
```

A number of options are supported:

```js
var options = {
  background: '#ecf0f1',
  density: 'medium',
  speed: 'medium',
  interactive: true,
  mixedSizes: true,
  boidColours: ["#34495e", "#e74c3c", '#2ecc71', '#9b59b6', '#f1c40f', '#1abc9c']
};
var canvasDiv = document.getElementById('boids-canvas');
```

## Options

TODO: describe options
