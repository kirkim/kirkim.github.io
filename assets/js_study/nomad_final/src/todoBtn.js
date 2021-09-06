import Todo from './todo.js';

const todoMaster = document.querySelector(".todo__form");
const todoNav = document.querySelector(".todo__nav");
const BtnZone = document.querySelector(".Btn_zone");
const PlusBtn = document.querySelector(".plus__Btn");
const MAX_BUTTON = 8;
const COLOR_COUNT = 23;
const HIDDEN_CLASS = "hide__page";
let page = [];
let savedPage = [];

const PAGE_KEY = "page";


function saveData() {
	localStorage.setItem(PAGE_KEY, JSON.stringify(savedPage));
}

function deletePage(event) {
	const target = todoMaster.querySelector(`form[id="${event.target.id}"]`);
	const targetBtn = todoNav.querySelector(`span[id="${event.target.id}"]`);
	PlusBtn.classList.remove(HIDDEN_CLASS);
	target.remove();
	targetBtn.remove();
	savedPage = savedPage.filter((toDos) => toDos.id !== target.id);
	localStorage.removeItem(`${event.target.id}`);
  	saveData();
}

function makePage(num) {
	setHide();
	const nb = `${num % COLOR_COUNT}`;
	const newForm = document.createElement("form");
	newForm.setAttribute('class', `todo__page color${nb}`);
	newForm.setAttribute('id', `todo${num}`);
	todoMaster.appendChild(newForm);
	const tempForm = document.querySelector(`form[id="todo${num}"]`);
	const newTodo = new Todo(tempForm, num, nb);
	const newPage = {
		fm: tempForm,
		nb: num,
	}
	page.push(newPage);
	makeBtn(num);
}

function makeBtn(num) {
	const newBtn = document.createElement("span");
	const nb = `${num % COLOR_COUNT}`;
	const colorClass = `color${nb}`;
	newBtn.setAttribute('id', `todo${num}`);
	newBtn.innerHTML = `
		<button class="todo__Btn ${colorClass}" id="todo${num}">
		</button>
		<button class="delete__page" id="todo${num}">
			X
		</button>
	`;
	BtnZone.append(newBtn);
}

function addPage() {
	if(savedPage.length > MAX_BUTTON) {
		return ;
	}
	checkPlusBtn();
	const num = Date.now();
	makePage(num);
	const todoNode = {
		id: `todo${num}`,
		nb: num,
	}
	savedPage.push(todoNode);
	saveData();
}

function setHide() {
	page.forEach((form) => {
		form.fm.classList.add(HIDDEN_CLASS);
	})
}

function checkPlusBtn() {
	if (savedPage.length >= MAX_BUTTON) {
		PlusBtn.classList.add(HIDDEN_CLASS);
	}
}

function viewPage(id) {
	const tempForm = todoMaster.querySelector(`form[id="${id}"]`);
	setHide();

	tempForm.classList.remove(HIDDEN_CLASS);
}

function eventMaster(event) {
	if (event.target.className === "plus__Btn") {
		addPage(event);
	} else if (event.target.className === "delete__page") {
		deletePage(event);
	} else if (event.target.classList.contains("todo__Btn")) {
		viewPage(event.target.id);
	}
}

todoNav.addEventListener("click", eventMaster);

function loadData() {
	const savedData = localStorage.getItem(PAGE_KEY);
	if (savedData !== null) {
		const parseData = JSON.parse(savedData);
		savedPage = parseData;
		parseData.forEach((obj) => makePage(obj.nb));
	}
}

loadData();
