import Background from './background.js';
import Hide from './hide.js';

const ID = "1111";
const PW = "1111";
const USER_KEY = "user";

export default class Login extends Hide {
	constructor(loginForm, mainForm) {
		super();
		this.loginForm = loginForm;
		this.inputId = this.loginForm.querySelector(".login__id");
		this.inputPw = this.loginForm.querySelector(".login__pw");
		this.mainForm = mainForm;
		this.bg = new Background();
		this.loadUser();
	}

	loadUser() {
		const savedUser = localStorage.getItem(USER_KEY);
		if(savedUser !== null) {
			super.addHide(this.loginForm);
			super.deleteHide(this.mainForm);
		}
	}

	in(event) {
		event.preventDefault();
		if (this.inputId.value !== ID, this.inputPw.value !== PW) {
			alert("login fail!");
			return ;
		}
		const user = {
			id: this.inputId.value,
			pw: this.inputPw.value,
		};
		localStorage.setItem(USER_KEY, JSON.stringify(user));
		this.inputId.value = "";
		this.inputPw.value = "";
		super.addHide(this.loginForm);
		this.bg.loadImg();
		super.deleteHide(this.mainForm);
	}

	out() {
		localStorage.removeItem(USER_KEY);
		super.addHide(this.mainForm);
		super.deleteHide(this.loginForm);
		this.inputId.focus();
		this.bg.loginImg();
	}
}
