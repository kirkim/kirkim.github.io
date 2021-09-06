import Background from './background.js';
import Hide from './hide.js';

export const loginUI = Object.freeze({
	id: "1111",
	pw: "1111",
	user_key: "user",
});

export class Login extends Hide {
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
		const savedUser = localStorage.getItem(loginUI.user_key);
		if(savedUser !== null) {
			super.addHide(this.loginForm);
			super.deleteHide(this.mainForm);
		}
	}

	in(event) {
		event.preventDefault();
		if (this.inputId.value !== loginUI.id, this.inputPw.value !== loginUI.pw) {
			alert("login fail!");
			return ;
		}
		const user = {
			id: this.inputId.value,
			pw: this.inputPw.value,
		};
		localStorage.setItem(loginUI.user_key, JSON.stringify(user));
		this.inputId.value = "";
		this.inputPw.value = "";
		super.addHide(this.loginForm);
		this.bg.loadImg();
		super.deleteHide(this.mainForm);
	}

	out() {
		localStorage.removeItem(loginUI.user_key);
		super.addHide(this.mainForm);
		super.deleteHide(this.loginForm);
		this.inputId.focus();
		this.bg.loginImg();
	}
}
