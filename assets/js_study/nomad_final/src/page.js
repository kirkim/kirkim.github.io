import Clock from './clock.js';
import Login from './login.js';
import './todoBtn.js';
import './weather.js';
import Background from './background.js';

const mainForm = document.querySelector(".main");
const loginForm = document.querySelector(".login");
const logoutForm = document.querySelector(".logout");

const clockBtn = document.querySelector("#toggle");
const clock = new Clock(".clock", ".clock__text");
const login = new Login(loginForm, mainForm);
const bgg = new Background();

loginForm.addEventListener("submit", (event) => {
	login.in(event);
});

logoutForm.addEventListener("click", () => {
	login.out();
})

clockBtn.addEventListener("click", (event) => {
	clock.handle(event.target.checked);
});

if (!localStorage.getItem("user")) {
	bgg.loginImg();
} else {
	bgg.loadImg();
}
