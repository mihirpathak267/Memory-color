const colorPicker = document.getElementById("color-picker");
const marker = document.getElementById("color-picker-marker");


function getColor(x) {
	let r = 255;
	let g = 255 - (Math.floor(x / 10) * 3);
	let b = 0;
	return "rgb(" + r + "," + g + "," + b + ")";
}
function updateMarker(x) {
	var sliderImage = document.getElementById("slider-image");
    var slider = document.getElementById("slider");
	
	marker.style.left = x + "px";
	marker.style.backgroundColor = getColor(x);
	sliderImage.style.fill = getColor(x);
	console.log(getColor(x));
	slider.setAttribute("value", getColor(x));
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