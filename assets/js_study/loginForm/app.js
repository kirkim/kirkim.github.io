const loginForm = document.querySelector("#loginTool");
const idForm = document.querySelector("#id");
const pwForm = document.querySelector("#pw");
const loginBtn = document.querySelector("#login");
const logoutBtn = document.querySelector("#logout");
const dataBtn = document.querySelector("#data");
const dataOut = document.querySelector("#out");
const main = document.querySelector(".mainSite");
let data;
let btn = false;

function login(id, password) {
	return new Promise((resolve, reject) => {
		if (id === "kirkim" && password === "111") {
			main.classList.remove("hidden");
			loginForm.classList.add("hidden");
			setTimeout(() => {
					resolve(`<사용자 정보>\n아이디: ${id}\n이름: 김기림\n국적: 대한민국`);
					dataBtn.classList.remove("hidden");
					logoutBtn.classList.remove("hidden");
			}, 4000);
		} else {
			reject(new Error(`login fail!`));
		}
	});
}

function loginFunc() {
	data = login(idForm.value, pwForm.value)
		.catch(alert);
	idForm.value = "";
	pwForm.value = "";
}

function logoutFunc() {
	dataBtn.classList.add("hidden");
	logoutBtn.classList.add("hidden");
	dataOut.innerText = "";
	main.classList.add("hidden");
	loginForm.classList.remove("hidden");
}

function layOutData() {
	if (btn === false) {
		data.then((data) => {
			dataOut.innerText = data;
		});
		btn = true;
	} else {
		dataOut.innerText = "";
		btn = false;
	}
}

loginBtn.addEventListener("click", loginFunc);
logoutBtn.addEventListener("click", logoutFunc);
dataBtn.addEventListener("click", layOutData);
