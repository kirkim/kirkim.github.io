const canvas = document.querySelector(".kcanvas");
const ctx = canvas.getContext("2d");
const color = document.querySelectorAll(".color3");
const paint = document.querySelector(".kpaint");
const pen = document.querySelector(".kpen");
const range = document.querySelector(".krange");
const displayColor = document.querySelector(".displayColor");
const bigColor = document.querySelector(".kcolor");
const body = document.querySelector("body");
const save = document.querySelector(".ksave");

let isDraw = false;
let isPaint = false;
let isCbC = false;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;


ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "black";
ctx.fillStyle = "black";
ctx.lineWidth = 2.5;

function mousemoveFunc(event) {
	const x = event.offsetX;
	const y = event.offsetY;

	if (isDraw === false) {
		ctx.beginPath();
		ctx.moveTo(x, y);
	} else {
		ctx.lineTo(x, y);
		ctx.stroke();
	}
}

function drawFunc() {
	isDraw = true;
}

function noDrawFunc() {
	isDraw = false;
}

function changeColorFunc(event) {
	const color = event.target.style.backgroundColor;
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	displayColor.style.backgroundColor = color;
}

function doPaintFunc() {
	if (isPaint === true) {
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
}

function setLineThickness(event) {
	ctx.lineWidth = event.target.value;
}

function saveImgFunc(event) {
	const image = canvas.toDateURL("image/png");
	const link = document.createElement("a");
}

if (canvas) {
	canvas.addEventListener("mousemove", mousemoveFunc);
	canvas.addEventListener("mousedown", drawFunc);
	canvas.addEventListener("mouseup", noDrawFunc);
	canvas.addEventListener("mouseleave", noDrawFunc);
	canvas.addEventListener("click", doPaintFunc);
}

color.forEach((event) => {
	event.addEventListener("click", changeColorFunc);
})

if (bigColor) {
	bigColor.addEventListener("input", (event) => {
		const color = event.target.value;
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		displayColor.style.backgroundColor = color;
	});
}

if (range) {
	range.addEventListener("input", setLineThickness);
}

if (paint) {
	paint.addEventListener("click", () => isPaint = true);
}

if (pen) {
	pen.addEventListener("click", () => isPaint = false);
}

if (save) {
	save.addEventListener("click", saveImgFunc);
}

window.addEventListener("resize", () => {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
});
