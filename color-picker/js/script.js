console.clear();

const WIDTH = 10;
const HEIGHT = 10;

elCanvas.width = WIDTH;
elCanvas.height = HEIGHT;

const ctx = elCanvas.getContext("2d");
let hue = 0;
let animTimer = null;

var satcopy;
var ligcopy;

var rcopy;
var gcopy;
var bcopy;

var hexcopy;

var locked = 0;

var color;
var color_check = 0;

document.body.addEventListener("click", checkColor);

function checkColor() {
	color_check = !color_check;
	if (color_check == 0) {
		document.getElementById("wrap").style.visibility = "visible";
		document.getElementById("foot").style.visibility = "visible";
		document.body.style.backgroundColor = color;
	}
	if (color_check == 1) {
		document.getElementById("wrap").style.visibility = "hidden";
		document.getElementById("foot").style.visibility = "hidden";
		document.body.style.backgroundColor = color;
	}
}

generate({
	WIDTH,
	HEIGHT,
	ctx,
	hue
});

function generate({
	WIDTH,
	HEIGHT,
	ctx,
	hue = 0
}) {
	const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
	for (const y of Array(HEIGHT).keys()) {
		for (const x of Array(WIDTH).keys()) {
			const yRatio = y / (HEIGHT - 1);
			const xRatio = x / (WIDTH - 1);
			const sat = getSaturation(xRatio, yRatio);
			const lig = getLightness(xRatio, yRatio);
			const [r, g, b] = hsl2rgb(hue, sat, lig);
			const i = 4 * (y * WIDTH + x);
			imageData.data[i] = r;
			imageData.data[i + 1] = g;
			imageData.data[i + 2] = b;
			imageData.data[i + 3] = 255;
		}
	}
	ctx.putImageData(imageData, 0, 0);
}

document.body.onmousemove = e => {
	updateLabel({
		hue,
		e
	});
};

document.body.onwheel = e => {
	e.preventDefault();
	const speed = e.shiftKey ? 1 / 360 : 5 / 360;
	const normHue = Math.sign(e.deltaY) * speed;
	hue += normHue;
	hue = hue - Math.floor(hue);
	generate({
		WIDTH,
		HEIGHT,
		ctx,
		hue
	});
	updateLabel({
		hue,
		e
	});
	clearTimeout(animTimer);
};

document.body.onmouseenter = e => {
	clearTimeout(animTimer);
};

document.onkeydown = function (event) {
	var keyCode = event.which || event.keyCode;
	var textcopy;
	if (keyCode == 72) {
		textcopy = "hsl(" + (hue * 360).toFixed(0) + ", " + satcopy + "%, " + ligcopy + "%)";
	}
	if (keyCode == 82) {
		textcopy = "rgb(" + rcopy + ", " + gcopy + ", " + bcopy + ")";
	}
	if (keyCode == 88) {
		textcopy = hexcopy;
	}

	var temp = document.createElement("input");
	document.body.appendChild(temp);
	temp.setAttribute("id", "temp_id");
	document.getElementById("temp_id").value = textcopy;
	temp.select();
	document.execCommand("copy");
	document.body.removeChild(temp);
}

function updateLabel({
	hue,
	e
}) {

	const {
		left,
		top,
		width,
		height
	} = e.target.getBoundingClientRect();
	const xRatio = (e.clientX - left) / width;
	const yRatio = (e.clientY - top) / height;
	const h = (hue * 360).toFixed(0);
	const s = (getSaturation(xRatio, yRatio) * 100).toFixed(0);
	const l = (getLightness(xRatio, yRatio) * 100).toFixed(0);
	elHue.textContent = h;
	elSat.textContent = s;
	elLig.textContent = l;

	satcopy = s;
	ligcopy = l;

	const [r, g, b] = hsl2rgb(hue, getSaturation(xRatio, yRatio), getLightness(xRatio, yRatio));
	elred.textContent = r;
	elgreen.textContent = g;
	elblue.textContent = b;

	rcopy = r;
	gcopy = g;
	bcopy = b;

	const hex_color = rgbToHex(r, g, b);
	elhex.textContent = hex_color;

	hexcopy = hex_color;
	color = hex_color;
}

(function tick() {
	animTimer = setTimeout(tick, 1000 / 24);
	hue += 2 / 360;
	if (hue > 1) {
		hue = 0
	}
	generate({
		WIDTH,
		HEIGHT,
		ctx,
		hue
	});
	elHue.textContent = `${(hue*360).toFixed(0)}`
}());

function mix(a, b, x) {
	return (b - a) * x + a;
}

function getSaturation(xRatio, yRatio) {
	return xRatio;
}

function getLightness(xRatio, yRatio) {
	const maxLig = 0.5 + 0.5 * (1 - xRatio);
	return mix(maxLig, 0, yRatio);
}

//https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

function hsl2rgb(h, s, l) {
	var r, g, b;

	if (s == 0) {
		r = g = b = l;
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}