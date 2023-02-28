const colorPicker = document.getElementById("color-picker");
const marker = document.getElementById("color-picker-marker");

function getColor(x) {
	let r = 255;
	let g = 255 - (Math.floor(x / 10) * 3);
	let b = 0;
	return "rgb(" + r + "," + g + "," + b + ")";
}
function updateMarker(x) {
	marker.style.left = x + "px";
	marker.style.backgroundColor = getColor(x);
	console.log(getColor(x));
	document.getElementById("rgb").setAttribute("value", getColor(x));
}

function getPosition(element) {
	let xPosition = 0;

	while (element) {
		xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		element = element.offsetParent;
		}

		return xPosition;
}

colorPicker.addEventListener("click", function(event) {
	let x = event.pageX - getPosition(this);
	updateMarker(x);
});

updateMarker(Math.floor(Math.random() * 300));
// Get the image element
var image = document.getElementById("my-image");
var rectangle = document.getElementById("rectangle");

// Generate a random color using RGB values

var r = 255;
var g = 159 + Math.floor(Math.random() * 33);
var b = 0;
var color = "rgb(" + r + "," + g + "," + b + ")";

// Set the image's background color using the random color
image.style.fill = color;
rectangle.style.fill = color;

