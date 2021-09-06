import Todo from './todo.js';

export const BtnUI = Object.freeze({
	color_count: 23,
	max_button: 8,
	page_key: "page",
	hidden_class: "hide__page",
});

export class TodoBtn {
	constructor() {
		this.todoMaster = document.querySelector(".todo__form");
		this.todoNav = document.querySelector(".todo__nav");
		this.BtnZone = document.querySelector(".Btn_zone");
		this.PlusBtn = document.querySelector(".plus__Btn");
		this.todoNav.addEventListener("click", this.eventMaster);
		this.page = [];
		this.savedPage = [];
	}

	saveData() {
		localStorage.setItem(BtnUI.page_key, JSON.stringify(this.savedPage));
	}

	deletePage(event) {
		const target = this.todoMaster.querySelector(`form[id="${event.target.id}"]`);
		const targetBtn = this.todoNav.querySelector(`span[id="${event.target.id}"]`);
		this.PlusBtn.classList.remove(BtnUI.hidden_class);
		target.remove();
		targetBtn.remove();
		this.savedPage = this.savedPage.filter((toDos) => toDos.id !== target.id);
		localStorage.removeItem(`${event.target.id}`);
		this.saveData();
	}

	makePage(num) {
		this.setHide();
		const nb = `${num % BtnUI.color_count}`;
		const newForm = document.createElement("form");
		newForm.setAttribute('class', `todo__page color${nb}`);
		newForm.setAttribute('id', `todo${num}`);
		this.todoMaster.appendChild(newForm);
		const tempForm = document.querySelector(`form[id="todo${num}"]`);
		const newTodo = new Todo(tempForm, num, nb);
		const newPage = {
			fm: tempForm,
			nb: num,
		}
		this.page.push(newPage);
		this.makeBtn(num);
		this.checkPlusBtn();
}

	makeBtn(num) {
		const newBtn = document.createElement("span");
		const nb = `${num % BtnUI.color_count}`;
		const colorClass = `color${nb}`;
		newBtn.setAttribute('id', `todo${num}`);
		newBtn.innerHTML = `
			<button class="todo__Btn ${colorClass}" id="todo${num}">
			</button>
			<button class="delete__page" id="todo${num}">
				X
			</button>
		`;
		this.BtnZone.append(newBtn);
	}

	checkPlusBtn() {
		if (this.savedPage.length >= BtnUI.max_button) {
			this.PlusBtn.classList.add(BtnUI.hidden_class);
		} else {
			this.PlusBtn.classList.remove(BtnUI.hidden_class);
		}
	}

	addPage() {
		this.checkPlusBtn();
		if(this.savedPage.length > BtnUI.max_button) {
			return ;
		}
		const num = Date.now();
		const todoNode = {
			id: `todo${num}`,
			nb: num,
		}
		this.makePage(num);
		this.savedPage.push(todoNode);
		this.saveData();
	}

	setHide() {
		this.page.forEach((form) => {
			form.fm.classList.add(BtnUI.hidden_class);
		})
	}

	viewPage(id) {
		const tempForm = this.todoMaster.querySelector(`form[id="${id}"]`);
		this.setHide();

		tempForm.classList.remove(BtnUI.hidden_class);
	}

	eventMaster = (event) => {
		if (event.target.className === "plus__Btn") {
			this.addPage(event);
		} else if (event.target.className === "delete__page") {
			this.deletePage(event);
		} else if (event.target.classList.contains("todo__Btn")) {
			this.viewPage(event.target.id);
		}
	}

	loadData() {
		const savedData = localStorage.getItem(BtnUI.page_key);
		if (savedData !== null) {
			const parseData = JSON.parse(savedData);
			this.savedPage = parseData;
			parseData.forEach((obj) => this.makePage(obj.nb));
		}
	}
}
