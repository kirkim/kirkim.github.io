const body = document.querySelector("body");


function aaa(event) {
	event.target.style.backgroundColor = "#" + parseInt(Math.random() * 0xffffff).toString(16);
}

body.addEventListener("mouseover", aaa);

