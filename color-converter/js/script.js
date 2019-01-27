var input;
var cursor;
var hiddenInput;
var content = [];
var lastContent = "",
	targetContent = "";
var inputLock = false;

var hex_check = false;
var hsl_check = false;
var rgb_check = false;

var hex_color;
var hsl_color;
var rgb_color;

var hex_color_processed;
var rgb_color_processed;
var hsl_color_processed;

hide_values();

function show_values() {
	document.getElementById("values").style.visibility = "visible";
}

function hide_values() {
	document.getElementById("values").style.visibility = "hidden";
}

function show_white() {
	document.getElementById("wrap").classList.remove("dark");
	document.getElementById("wrap").classList.add("white");
	document.getElementById("values").classList.remove("darkshade");
	document.getElementById("values").classList.add("whiteshade");
	document.getElementById("foot").classList.remove("dark");
	document.getElementById("foot").classList.remove("darkshade");
	document.getElementById("foot").classList.add("white");
	document.getElementById("foot").classList.add("whiteshade");
}

function show_dark() {
	document.getElementById("wrap").classList.remove("white");
	document.getElementById("wrap").classList.add("dark");
	document.getElementById("values").classList.remove("whiteshade");
	document.getElementById("values").classList.add("darkshade");
	document.getElementById("foot").classList.remove("white");
	document.getElementById("foot").classList.remove("whiteshade");
	document.getElementById("foot").classList.add("dark");
	document.getElementById("foot").classList.add("darkshade");
}

function check_color(code) {
	var code_temp;
	if (code.indexOf('#') > -1) {
		code = code.replace(/ /g, "");
		if (code.length == 4 || code.length == 7) {
			code_temp = code.substr(1, 6);

			if (/^\d+$/.test(code_temp) || /[a-z]/i.test(code_temp)) {
				if(code.length == 4) {
					hex_color = hex_whole(code);
				}
				
				else if(code.length == 7) {
					hex_color = code;
				}
				
				rgb_color = hexToRgb(hex_color);
				hsl_color = rgbToHsl(rgb_color.r, rgb_color.g, rgb_color.b);

				hex_color_processed = hex_color;
				rgb_color_processed = "rgb(" + rgb_color.r + ", " + rgb_color.g + ", " + rgb_color.b + ")";
				hsl_color_processed = "hsl(" + hsl_color[0] + ", " + hsl_color[1] + "%, " + hsl_color[2] + "%)";
				document.body.style.backgroundColor = hex_color_processed;
				
				if(rgb_color.r > 217 && rgb_color.g > 217 && rgb_color.b > 217) {
					show_dark();
				}

				show_values();

				elHEX.textContent = hex_color_processed;
				elRGB.textContent = rgb_color_processed;
				elHSL.textContent = hsl_color_processed;
			} else {
				document.body.style.backgroundColor = "#2F2F2F";
				show_white();
				hide_values();
			}
		} else {
			document.body.style.backgroundColor = "#2F2F2F";
			show_white();
			hide_values();
		}
	} else if (code.indexOf('HSL') > -1 || code.indexOf('hsl') > -1) {
		if (code.length >= 10 && code.replace(/[^,]/g, "").length == 2 && code.replace(/[^(]/g, "").length == 1 && code.replace(/[^)]/g, "").length == 1) {
			var h, s, l;
			code_temp = code.replace(/ /g, "");
			code_temp = code_temp.replace(/%/g, "");
			code_temp = code_temp.replace(/°/g, "");

			h = code_temp.substring(code_temp.indexOf("(") + 1, code_temp.indexOf(","));
			s = code_temp.substring(code_temp.indexOf(",") + 1, code_temp.lastIndexOf(","));
			l = code_temp.substring(code_temp.lastIndexOf(",") + 1, code_temp.lastIndexOf(")"));

			hsl_color_processed = "hsl(" + h + ", " + s + "%, " + l + "%)";
			hex_color_processed = hslToHex(h, s, l);
			rgb_color = hexToRgb(hex_color_processed);
			rgb_color_processed = "rgb(" + rgb_color.r + ", " + rgb_color.g + ", " + rgb_color.b + ")";

			document.body.style.backgroundColor = hex_color_processed;
			
			if(rgb_color.r > 217 && rgb_color.g > 217 && rgb_color.b > 217) {
				show_dark();
			}

			show_values();

			elHEX.textContent = hex_color_processed;
			elRGB.textContent = rgb_color_processed;
			elHSL.textContent = hsl_color_processed;
		} else {
			document.body.style.backgroundColor = "#2F2F2F";
			show_white();
			hide_values();
		}
	} else if (code.indexOf('RGB') > -1 || code.indexOf('rgb') > -1) {
		if (code.length >= 10 && code.replace(/[^,]/g, "").length == 2 && code.replace(/[^(]/g, "").length == 1 && code.replace(/[^)]/g, "").length == 1) {
			var r, g, b;
			code_temp = code.replace(/ /g, "");
			r = code_temp.substring(code_temp.indexOf("(") + 1, code_temp.indexOf(","));
			g = code_temp.substring(code_temp.indexOf(",") + 1, code_temp.lastIndexOf(","));
			b = code_temp.substring(code_temp.lastIndexOf(",") + 1, code_temp.lastIndexOf(")"));

			rgb_color_processed = "rgb(" + r + ", " + g + ", " + b + ")";
			hsl_color = rgbToHsl(r, g, b);
			hsl_color_processed = "hsl(" + hsl_color[0] + ", " + hsl_color[1] + "%, " + hsl_color[2] + "%)";
			hex_color_processed = hslToHex(hsl_color[0], hsl_color[1], hsl_color[2]);

			document.body.style.backgroundColor = hex_color_processed;
			
			if(r > 217 && g > 217 && b > 217) {
				show_dark();
			}

			show_values();

			elHEX.textContent = hex_color_processed;
			elRGB.textContent = rgb_color_processed;
			elHSL.textContent = hsl_color_processed;
		} else {
			document.body.style.backgroundColor = "#2F2F2F";
			show_white();
			hide_values();
		}
	} else {
		document.body.style.backgroundColor = "#2F2F2F";
		show_white();
		hide_values();
	}
}

window.onload = function () {

	input = document.getElementById('input');

	hiddenInput = document.getElementById('hiddenInput');
	hiddenInput.focus();

	cursor = document.createElement('cursor');
	cursor.setAttribute('class', 'blink');
	cursor.innerHTML = "|";

	input.appendChild(cursor);

	function refresh() {

		inputLock = true;

		if (targetContent.length - lastContent.length == 0) return;

		var v = targetContent.substring(0, lastContent.length + 1);

		content = [];

		var blinkPadding = false;

		for (var i = 0; i < v.length; i++) {
			var l = v.charAt(i);

			var d = document.createElement('div');
			d.setAttribute('class', 'letterContainer');

			var d2 = document.createElement('div');

			var animClass = (i % 2 == 0) ? 'letterAnimTop' : 'letterAnimBottom';

			var letterClass = (lastContent.charAt(i) == l) ? 'letterStatic' : animClass;

			if (letterClass != 'letterStatic') blinkPadding = true;

			d2.setAttribute('class', letterClass);

			d.appendChild(d2);

			d2.innerHTML = l;
			content.push(d);
		}

		input.innerHTML = '';

		for (var i = 0; i < content.length; i++) {
			input.appendChild(content[i]);
		}

		cursor.style.paddingLeft = (blinkPadding) ? '22px' : '0';

		input.appendChild(cursor);

		if (targetContent.length - lastContent.length > 1) setTimeout(refresh, 150);
		else inputLock = false;

		lastContent = v;
	}

	if (document.addEventListener) {

		document.addEventListener('touchstart', function (e) {

			targetContent = lastContent;
		}, false);

		document.addEventListener('click', function (e) {

			targetContent = lastContent;
			hiddenInput.focus();
		}, false);

		hiddenInput.addEventListener('input', function (e) {
			e.preventDefault();
			targetContent = hiddenInput.value;
			if (!inputLock) refresh();

			check_color(targetContent);

		}, false);
	}

	hiddenInput.value = "";
}

function hexToRgb(hex) {
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function rgbToHsl(r, g, b) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	h = Math.round(h * 360);
	s = Math.round(s * 100);
	l = Math.round(l * 100);
	return [h, s, l];
}

function hslToHex(h, s, l) {
	h = h / 360;
	s = s / 100;
	l = l / 100;
	let r, g, b;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = x => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hex_whole(hex) {
	var hex_whole;
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		hex_whole = "#" + r + r + g + g + b + b;
	});
	return hex_whole;
}

document.onkeydown = function (event) {
	var keyCode = event.which || event.keyCode;
	var textcopy;
	if (keyCode == 90) { /* Z */
		textcopy = hsl_color_processed;
	}
	if (keyCode == 88) { /* X */
		textcopy = rgb_color_processed;
	}
	if (keyCode == 86) { /* V */
		textcopy = hex_color_processed;
	}

	if (keyCode == 90 || keyCode == 88 || keyCode == 86) {
		var temp = document.createElement("input");
		document.body.appendChild(temp);
		temp.setAttribute("id", "temp_id");
		document.getElementById("temp_id").value = textcopy;
		temp.select();
		document.execCommand("copy");
		document.body.removeChild(temp);
		setTimeout(function () {
			hiddenInput = document.getElementById('hiddenInput');
			hiddenInput.focus();
		}, 1000);
	}
}