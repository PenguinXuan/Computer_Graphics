// asg2.js
// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
let VSHADER_SOURCE = `
	attribute vec4 a_Position;
	uniform mat4 u_ModelMatrix;
	uniform mat4 u_GlobalRotateMatrix;
    void main() {
   	gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
}`

// Fragment shader program
let FSHADER_SOURCE = `
	precision mediump float;
	uniform vec4 u_FragColor;
 	void main() {
 		gl_FragColor = u_FragColor;
 	}`

// Global letiables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
	// Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectletiablesToGLSL() {
	// Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
    
  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related UI elements
let g_yellowAnimation = false;
let g_tailAnimation = false;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_tailAngle = 0;

function addActionsForHtmlUI() {
  document.getElementById('animationTailOnButton').onclick = function() { g_tailAnimation = true; };
  document.getElementById('animationTailOffButton').onclick = function() { g_tailAnimation = false; };
	document.getElementById('animationYellowOnButton').onclick = function() { g_yellowAnimation = true; };
 	document.getElementById('animationYellowOffButton').onclick = function() { g_yellowAnimation = false; };
 	
  document.getElementById('tailSlide').addEventListener('mouseup', function() { g_tailAngle = this.value; renderAllShapes(); });
 	document.getElementById('yellowSlide').addEventListener('mouseup', function() { g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById('angleSlide').addEventListener('mouseup', function() { g_globalAngle = this.value; renderAllShapes(); });
}

function main() {
	// Set up canvas and gl letiables
  setupWebGL();
	// Set up GLSL shader programs and connect GLSL letiables
	connectletiablesToGLSL();
	// Set up actions for the HTML UI elements
	addActionsForHtmlUI();
	// Register function (event handler) to be called on a mouse press
	canvas.onmousedown = click;
	canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	//renderAllShapes();
  requestAnimationFrame(tick);
}

let g_shapesList = [];

function click(ev) {
	// Extract the event click and return it in WebGL coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);
	
	point.position = [x, y];
	g_shapesList.push(point);	
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
	let x = ev.clientX; // x coordinate of a mouse pointer
	let y = ev.clientY; // y coordinate of a mouse pointer
	let rect = ev.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

	return([x, y]);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

// Called by browser repeatedly whenever its time
function tick() {
  // Save the current time
	g_seconds = performance.now() / 1000.0 - g_startTime;

	updateAnimationAngles();

	// Draw everything
	renderAllShapes();

	// Tell the browser to update again when it has time
	requestAnimationFrame(tick);
}

function updateAnimationAngles() {
	if (g_yellowAnimation) {
		g_yellowAngle = (30 * Math.sin(g_seconds));
	}
  if (g_tailAnimation) {
    g_tailAngle = (30 * Math.sin(g_seconds));
  }
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
	// Pass the matrix to u_GlobalRotateMatrix attribute
	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clear(gl.COLOR_BUFFER_BIT);
 
  body = new Cube();
  body.color = [1,1,0,1];
  body.matrix.translate(0, -.5, 0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  var bodyCoordinateMat = new Matrix4(body.matrix);
  body.matrix.scale(.8, .5, 1);
  body.matrix.translate(-.5, 0, 0);
  body.render();

  var leftFoot1 = new Cube();
  leftFoot1.color = [0.9, 0.7, 0, 1];
  leftFoot1.matrix = bodyCoordinateMat;
  leftFoot1.matrix.translate(-.3, -.2, .2);
  leftFoot1.matrix.scale(.2, .2, .2);
  leftFoot1.render();

  var rightFoot1 = new Cube();
  rightFoot1.color = [0.9, 0.7, 0, 1];
  rightFoot1.matrix = bodyCoordinateMat;
  rightFoot1.matrix.translate(2, 0, 0);
  rightFoot1.render();

  var rightFoot2 = new Cube();
  rightFoot2.color = [0.9, 0.7, 0, 1];
  rightFoot2.matrix = bodyCoordinateMat;
  rightFoot2.matrix.translate(0, 0, 2);
  rightFoot2.render();
  
  var leftFoot2 = new Cube();
  leftFoot2.color = [0.9, 0.7, 0, 1];
  leftFoot2.matrix = bodyCoordinateMat;
  leftFoot2.matrix.translate(-2, 0, 0);
  leftFoot2.render();

  var leftEar = new Cube();
  leftEar.color = [1, 1, 0, 1];
  leftEar.matrix = bodyCoordinateMat;
  leftEar.matrix.translate(0, 3, -2);
  leftEar.matrix.scale(1, 2.5, .5);
  leftEar.render();
  
  var rightEar = new Cube();
  rightEar.color = [1, 1, 0, 1];
  rightEar.matrix = bodyCoordinateMat;
  rightEar.matrix.translate(2, 0, 0);
  rightEar.render();

  var leftEye = new Cube();
  leftEye.color = [0, 0, 0, 1];
  leftEye.matrix = bodyCoordinateMat;
  leftEye.matrix.translate(-1.8, -.15, -2.2);
  leftEye.matrix.scale(.7, .25, .2);
  leftEye.render();

  var rightEye = new Cube();
  rightEye.color = [0, 0, 0, 1];
  rightEye.matrix = bodyCoordinateMat;
  rightEye.matrix.translate(2.8, 0, 0);
  rightEye.render();

  var eye1 = new Cube();
  eye1.color = [1, 1, 1, 1];
  eye1.matrix = bodyCoordinateMat;
  eye1.matrix.translate(-2.5, .4, -.05);
  eye1.matrix.scale(.5, .5, .5);
  eye1.render();

  var eye2 = new Cube();
  eye2.color = [1, 1, 1, 1];
  eye2.matrix = bodyCoordinateMat;
  eye2.matrix.translate(5.4, 0, 0);
  eye2.render();

  var nose = new Cube();
  nose.color = [0, 0, 0, 1];
  nose.matrix = bodyCoordinateMat;
  nose.matrix.translate(-2.7, -1.5, 0);
  nose.render();
  
  var mouth = new Cube();
  mouth.color = [1, 0, 0, 1];
  mouth.matrix = bodyCoordinateMat;
  mouth.matrix.translate(-1, -2, .1);
  mouth.matrix.scale(3, 1.5, .5);
  mouth.render();

  var cheek1 = new Cube();
  cheek1.color = [0.9, 0.4, 0.6, 1];
  cheek1.matrix = bodyCoordinateMat;
  cheek1.matrix.translate(-1, .1, .1);
  cheek1.matrix.scale(.5, 1.2, .5);
  cheek1.render();

  var cheek2 = new Cube();
  cheek2.color = [0.9, 0.4, 0.6, 1];
  cheek2.matrix = bodyCoordinateMat;
  cheek2.matrix.translate(5.2, 0, 0);
  cheek2.render();

  var tail1 = new Cube();
  tail1.color = [0.9, 0.7, 0, 1];
  tail1.matrix = bodyCoordinateMat;
  tail1.matrix.translate(-3, 0, 410);
  tail1.matrix.rotate(g_tailAngle, 0, 0, 1);
  tail1.matrix.rotate(30, 0, 0, 1);
  tail1.matrix.scale(2.5, 1.5, 10);
  tail1.render();

  var tail2 = new Cube();
  tail2.color = [0.9, 0.7, 0, 1];
  tail2.matrix = bodyCoordinateMat;
  tail2.matrix.translate(0.5, 1, 0);
  tail2.matrix.scale(1.2, 1.2, 3);
  tail2.render();

  var tail3 = new Cube();
  tail3.color = [0.9, 0.7, 0, 1];
  tail3.matrix = bodyCoordinateMat;
  tail3.matrix.translate(0.5, 1, 0);
  tail3.matrix.scale(1.1, 1, 1);
  tail3.render();
}