# BoidsCanvas
[![NPM version](https://img.shields.io/npm/v/boids-canvas.svg)](https://www.npmjs.com/package/boids-canvas)
[![Bower version](https://img.shields.io/bower/v/boids-canvas.svg)](https://github.com/MikeC1995/BoidsCanvas)
[![NPM dependencies](https://david-dm.org/MikeC1995/BoidsCanvas.svg)](https://david-dm.org/MikeC1995/BoidsCanvas)
[![NPM devDependencies](https://david-dm.org/MikeC1995/BoidsCanvas/dev-status.svg)](https://david-dm.org/MikeC1995/BoidsCanvas#info=devDependencies)

## Overview

A sexy looking HTML5 and Javascript implementation of Craig Reynold's boids algorithm for flocking behaviour. Fully plug n' play, modular and customisable.

[See it live on CodePen](http://codepen.io/MikeC1995/pen/RWXoOe)

Go ahead and fork the repo and open `demo.html` to give it a go!

## Usage

This plugin is available as `boids-canvas` on NPM and Bower. Alternatively, you can clone this repository. Use this animation on your webpage simply by:

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

* `background`: specify a hexadecimal colour (as a string) or an image path
* `density`:  can take values `low`, `medium` or `high`. Defaults to `medium`.
* `speed`: can take values `slow`, `medium` or `fast`. Defaults to `medium`.
* `interactive`: can take values `true` or `false`. When true, boids will be attracted to the mouse pointer. Defaults to `true`.
* `mixedSizes`: can take values `true` or `false`. When true, boids will be of varying sizes - larger boids even have more inertia. Defaults to `true`.
* `boidColours`: an array of hexadecimal colours (as strings) specifying the colours boids can take (assigned randomly). Defaults to all boids `#ff3333`

## LICENSE
The MIT License (MIT)

Copyright (c) 2016 Mike Christensen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
