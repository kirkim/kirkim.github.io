const Form = document.querySelector(".A-20_out");
const outForm = document.querySelector(".A-20_out #out");
const cornButton = Form.querySelector("#corn");
const potatoButton = Form.querySelector("#potato");
const appleButton = Form.querySelector("#apple");
const base = document.querySelector(".A-20_out #out #base");
const corn1 = document.querySelector(".A-20_out #out #c1");
const corn2 = document.querySelector(".A-20_out #out #c2");
const potato1 = document.querySelector(".A-20_out #out #p1");
const potato2 = document.querySelector(".A-20_out #out #p2");
const apple1 = document.querySelector(".A-20_out #out #a1");
let timer1;
let timer2;
function addHidden() {
	clearTimeout(timer1);
	clearTimeout(timer2);
	corn1.classList.add("hidden");
	corn2.classList.add("hidden");
	potato1.classList.add("hidden");
	potato2.classList.add("hidden");
	apple1.classList.add("hidden");
}
function inputCorn() {
	addHidden();
	base.classList.remove("hidden");
	timer1 = setTimeout(() => {
		corn1.classList.remove("hidden");
	}, 2000);
	timer2 = setTimeout(() => {
		corn2.classList.remove("hidden");
	}, 4000);
}
function inputPotato() {
	addHidden();
	base.classList.remove("hidden");
	timer1 = setTimeout(() => {
		potato1.classList.remove("hidden");
	}, 2000);
	timer2 = setTimeout(() => {
		potato2.classList.remove("hidden");
	}, 4000);
}
function inputApple() {
	addHidden();
	base.classList.remove("hidden");
	timer1 = setTimeout(() => {
		apple1.classList.remove("hidden");
	}, 2000);
}
if (Form) {
  cornButton.addEventListener("click", inputCorn);
  potatoButton.addEventListener("click", inputPotato);
  appleButton.addEventListener("click", inputApple);
}
