import Clock from './clock.js';
import { Login,loginUI } from './login.js';
import { BtnUI, TodoBtn } from './todoBtn.js';
import Weather from './weather.js';
import Background from './background.js';

const mainForm = document.querySelector(".main");
const loginForm = document.querySelector(".login");
const logoutForm = document.querySelector(".logout");

const clockBtn = document.querySelector("#toggle");
const clock = new Clock(".clock", ".clock__text");
const login = new Login(loginForm, mainForm);
const bgg = new Background();
const todoBtn = new TodoBtn();
const weather = new Weather();

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

todoBtn.loadData();
