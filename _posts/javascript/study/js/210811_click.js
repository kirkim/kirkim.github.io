const aaa = document.querySelector("h2.kk");

function handleTitleClick() {
	alert("Don't touch me!");
}

function handleMouse() {
	aaa.style.color = "orange";
}

function handleMouseLeave() {
	aaa.style.color = "black";
}

aaa.addEventListener("click", handleTitleClick);
aaa.addEventListener("mouseenter", handleMouse);
aaa.addEventListener("mouseleave", handleMouseLeave);
