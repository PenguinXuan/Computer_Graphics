// asg3.js
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  varying vec2 v_UV;
    void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
}`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  // uniform vec4 u_FragColor;
  varying vec2 v_UV;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); 
    } else if (u_whichTexture == 1) {  
      gl_FragColor = texture2D(u_Sampler1, v_UV); 
    } else if (u_whichTexture == 2) {  
      gl_FragColor = texture2D(u_Sampler2, v_UV); 
    } else {
      gl_FragColor = vec4(v_UV,1.0,1.0);
    }
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_whichTexture;

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

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
  }

  // Set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


// Globals related UI elements
let g_globalAngle = 0;

function addActionsForHtmlUI() {
  document.getElementById('angleSlide').addEventListener('mouseup', function() { g_globalAngle = this.value; renderAllShapes(); });
}

function initTextures() {
  // Create a texture object
  var texture0 = gl.createTexture(); 
  var texture1 = gl.createTexture();
  var texture2 = gl.createTexture();
  if (!texture0 || !texture1 || !texture2) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Get the storage location of u_Sampler0 and u_Sampler1
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  var u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler0 || !u_Sampler1 || !u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  // Create the image object
  var image0 = new Image();
  var image1 = new Image();
  var image2 = new Image();
  if (!image0 || !image1 || !image2) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image0.onload = function(){ loadTexture(texture0, u_Sampler0, image0, 0); };
  image1.onload = function(){ loadTexture(texture1, u_Sampler1, image1, 1); };
  image2.onload = function(){ loadTexture(texture2, u_Sampler2, image2, 2); };
  // Tell the browser to load an Image
  image0.src = 'sand.jpg';
  image1.src = 'sky.jpg';
  image2.src = 'block.jpg';

  return true;
}

function loadTexture(texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis

  // Make the texture unit active
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
  } else if (texUnit == 1) {
    gl.activeTexture(gl.TEXTURE1);
  } else if (texUnit == 2) {
    gl.activeTexture(gl.TEXTURE2);
  }

  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);   

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  gl.uniform1i(u_Sampler, texUnit);   // Pass the texure unit to u_Sampler
  
  console.log('finished loadTexture');
}

function main() {
  // Set up canvas and gl letiables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL letiables
  connectletiablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

// Called by browser repeatedly whenever its time
function tick() {
  // Save the current time
  g_seconds = performance.now() / 1000.0 - g_startTime;

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function keydown(ev) {
  switch (ev.keyCode) {
    case 87:
        g_camera.moveForward();
        break;
      case 83:
        g_camera.moveBackwards();
        break;
      case 68: 
        g_camera.moveRight();
        break;
      case 65: 
        g_camera.moveLeft();
        break;
      case 81: 
        g_camera.panLeft();
        break;
      case 69: 
        g_camera.panRight();
        break;
      default: return; // Skip drawing at no effective action
  }
  renderAllShapes();
}

var g_camera = new Camera();

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 0, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawMap() {
  for (x = 0; x < 10; x++) {
    for (z = 0; z < 10; z++) {
      if (g_map[x][z] == 1) {
        var body = new Cube();
        body.textureNum = 2;
        body.matrix.translate(-5+z, -.75, -5+x);
        body.render();
      }
    }
  }
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); // (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the matrix to u_GlobalRotateMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawMap();
  
  // Draw the floor
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum = 0;
  floor.matrix.translate(0, -.75, 0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-.5, 0, -.5);
  floor.render();

  // Draw the sky
  var sky = new Cube();
  sky.color = [0.0, 0.0, 1.0, 1.0];
  sky.textureNum = 1;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5,-.5,-.5);
  sky.render();
}