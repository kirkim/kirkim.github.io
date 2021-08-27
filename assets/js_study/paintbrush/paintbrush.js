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

const penEvent = {
	move: function (event) {
		const x = event.offsetX;
		const y = event.offsetY;

		if (isDraw === false) {
			ctx.beginPath();
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
			ctx.stroke();
		}
	},
	draw: function () {
		isDraw = true;
	},
	stopDraw: function () {
		isDraw = false;
	},
};

const paintEvent = {
	draw: function () {
		console.log(tool);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
};

function initFunc() {
	canvas.width = 300;
	canvas.height = 300;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "black";
	ctx.fillStyle = "black";
	ctx.lineWidth = 2.5;
	tool = PEN;
	isDraw = false;
	addToolEvent(tool);
}

function deleteToolEvent(ktool) {
	switch (ktool) {
		case PEN:
			canvas.removeEventListener("mousemove", penEvent.move);
			canvas.removeEventListener("mousedown", penEvent.draw);
			canvas.removeEventListener("mouseup", penEvent.stopDraw);
			canvas.removeEventListener("mouseleave", penEvent.stopDraw);
			break;
		case PAINT:
			canvas.removeEventListener("click", paintEvent.draw);
			break;
	}
}

function addToolEvent(ktool) {
	switch (ktool) {
		case PEN:
			canvas.addEventListener("mousemove", penEvent.move);
			canvas.addEventListener("mousedown", penEvent.draw);
			canvas.addEventListener("mouseup", penEvent.stopDraw);
			canvas.addEventListener("mouseleave", penEvent.stopDraw);
			break;
		case PAINT:
			canvas.addEventListener("click", paintEvent.draw);
			break;
	}
}

function master(ktool) {
	deleteToolEvent(tool);
	tool = ktool;
	addToolEvent(ktool);
}

function changeColorFunc(kcolor) {
	const color = kcolor;
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	displayColor.style.backgroundColor = color;
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
/*
window.addEventListener("resize", () => {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
});*/

initFunc();
