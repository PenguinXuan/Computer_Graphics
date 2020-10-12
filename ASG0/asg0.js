// asg0.js
const WIDTH = 400;
const HEIGHT = 400;
var canvas = document.getElementById('example');  // Retrieve <canvas> element
var ctx = canvas.getContext('2d');  // Get the rendering context for 2DCG
function main() {
	if (!canvas) {
	  console.log('Failed to retrieve the <canvas> element');
	  return;
	}

	if (!ctx) {
		console.log('Failed to get the rendering context for 2DCG');
		return;
	}

	// Draw a black rectangle
	ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';  // Set a black color
	ctx.fillRect(0, 0, WIDTH, HEIGHT);  // Fill a rectangle with the color
    
    // Instantiate a vector v1 using the Vector3 class from cuon-matrix.js library
    //let v1 = new Vector3([2.25, 2.25, 0]);
    //drawVector(v1, "red");

}

function drawVector(v, color) {
	ctx.beginPath();
	ctx.moveTo(WIDTH / 2, HEIGHT / 2);
	ctx.lineTo(WIDTH / 2 + 20 * v.elements[0],HEIGHT / 2 - 20 * v.elements[1]);
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.stroke();
}

function handleDrawEvent() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);  // clear the canvas
	ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';  // Set a black color
	ctx.fillRect(0, 0, WIDTH, HEIGHT);  // Fill a rectangle with the color

	// Read the values of the text boxes to create v1
	let x1 = document.getElementById("xCoordinate1").value;
	let y1 = document.getElementById("yCoordinate1").value;
	let v1 = new Vector3([x1, y1, 0]);
	drawVector(v1, "red");  //Call drawVector(v1, "red")

	// Read the values of the text boxes to create v2
	let x2 = document.getElementById("xCoordinate2").value;
	let y2 = document.getElementById("yCoordinate2").value;
	let v2 = new Vector3([x2, y2, 0]);
	drawVector(v2, "blue");  // Call drawVector(v2, "blue")
}


function handleDrawOperationEvent() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);  // Clear the canvas
	ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';  // Set a black color
	ctx.fillRect(0, 0, WIDTH, HEIGHT);  // Fill a rectangle with the color

	// Read the values of the text boxes to create v1 and call drawVector(v1, "red")
	let x1 = document.getElementById("xCoordinate1").value;
	let y1 = document.getElementById("yCoordinate1").value;
	let v1 = new Vector3([x1, y1, 0]);
	drawVector(v1, "red");

    // Read the values of the text boxes to create v2 and call drawVector(v2, "blue")
	let x2 = document.getElementById("xCoordinate2").value;
	let y2 = document.getElementById("yCoordinate2").value;
	let v2 = new Vector3([x2, y2, 0]);
	drawVector(v2, "blue")

	// Read the value of the selector and call the respective Vector3 function
	let operation = document.getElementById("operation").value;
	let scalar = document.getElementById("scalar").value;
	if (operation === "add") {
		let v3 = v1.add(v2);
		drawVector(v3, "green");
	} else if (operation === "sub") {
		let v3 = v1.sub(v2);
		drawVector(v3, "green");
	} else if (operation === "mul") {
		let v3 = v1.mul(scalar);
		let v4 = v2.mul(scalar)
		drawVector(v3, "green");
		drawVector(v4, "green");
	} else if (operation == "div") {
		let v3 = v1.div(scalar);
		let v4 = v2.div(scalar)
		drawVector(v3, "green");
		drawVector(v4, "green");
	} else if (operation == "ang") {
		let angle = angleBetween(v1, v2);
		console.log("Angle: " + angle);
	} else if (operation == "area") {
		let area = areaTriangle(v1, v2);
		console.log("Area of the triangle: " + area);
	} else if (operation === "mag") {
		console.log("Magnitude v1: " + v1.magnitude());
		console.log("Magnitude v2: " + v2.magnitude());
	} else if (operation === "norm") {
		v1.normalize();
		v2.normalize();
		drawVector(v1, "green");
		drawVector(v2, "green");
	}
}


function angleBetween(v1, v2) {
	let d = Vector3.dot(v1, v2);
	let m1 = v1.magnitude();
	let m2 = v2.magnitude();
	let rad = Math.acos(d / (m1 * m2));
	let angle = Math.round(rad * (180 / Math.PI));
	return angle;
}


function areaTriangle(v1, v2) {
	let v3 = Vector3.cross(v1, v2);
	let m = v3.magnitude();
	return m / 2;
}