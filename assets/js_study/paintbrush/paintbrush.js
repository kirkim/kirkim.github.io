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

const PEN = 1;
const PAINT = 2;
const CIRCLE = 3;
let tool;
let isDraw;

initFunc();
addEvent(tool);

function initFunc() {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "black";
	ctx.fillStyle = "black";
	ctx.lineWidth = 2.5;
	tool = PEN;
	isDraw = false;
}

function movePen(event) {
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

function drawPen() {
	isDraw = true;
}

function stopDrawPen() {
	isDraw = false;
}

function changeColorFunc(kcolor) {
	const color = kcolor;
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	displayColor.style.backgroundColor = color;
}

function doPaintFunc() {
	console.log(tool);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setLineThickness(event) {
	ctx.lineWidth = event.target.value;
}

function saveImgFunc() {
	const image = canvas.toDataURL("image/png");
	const link = document.createElement("a");
	link.href = image;
	link.download = "🏞paint!";
	link.click();
}

function deleteEvent(ktool) {
	switch (ktool) {
		case PEN:
			canvas.removeEventListener("mousemove", movePen);
			canvas.removeEventListener("mousedown", drawPen);
			canvas.removeEventListener("mouseup", stopDrawPen);
			canvas.removeEventListener("mouseleave", stopDrawPen);
			break;
		case PAINT:
			canvas.removeEventListener("click", doPaintFunc);
			break;
	}
}
function addEvent(ktool) {
	switch (ktool) {
		case PEN:
			canvas.addEventListener("mousemove", movePen);
			canvas.addEventListener("mousedown", drawPen);
			canvas.addEventListener("mouseup", stopDrawPen);
			canvas.addEventListener("mouseleave", stopDrawPen);
			break;
		case PAINT:
			canvas.addEventListener("click", doPaintFunc);
			break;
	}
}

function master(ktool) {
	deleteEvent(tool);
	tool = ktool;
	addEvent(ktool);
}

color.forEach((event) => {
	event.addEventListener("click", (event) =>
		changeColorFunc(event.target.style.backgroundColor));
})

if (bigColor) {
	bigColor.addEventListener("input", (event) =>
		changeColorFunc(event.target.value));
}

if (range) {
	range.addEventListener("input", setLineThickness);
}

if (paint) {
	paint.addEventListener("click", () => master(PAINT));
}

if (pen) {
	pen.addEventListener("click", () => master(PEN));
}

if (save) {
	save.addEventListener("click", saveImgFunc);
}

window.addEventListener("resize", () => {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
});
