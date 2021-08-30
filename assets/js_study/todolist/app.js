const toDoForm = document.querySelector("#A17-todo");
const toDoInput = document.querySelector("#A17-todo input");
const toDoList = document.querySelector("#A17-todo-list");
const TODO_KEY = "todos";
let toDos = [];

function saveToDos() {
  localStorage.setItem(TODO_KEY, JSON.stringify(toDos));
}

function deleteToDo(event) {
  const target = event.target.parentElement;
  target.remove();
  toDos = toDos.filter((toDos) => toDos.id !== parseInt(target.id));
  saveToDos();
}

function doneFunc(event) {
  const tar = event.target.parentElement;
  for (const i in toDos) {
    if (toDos[i].id === parseInt(tar.id)) {
      if (toDos[i].is_done === true) {
        event.target.classList.remove("A17-del");
        toDos[i].is_done = false;
      } else {
        event.target.classList.add("A17-del");
        toDos[i].is_done = true;
      }
    }
  }
  saveToDos();
}

function checkDone(newObj, newToDo) {
  if (newObj.is_done === true) {
    newToDo.classList.add("A17-del");
    newToDo.innerText = newObj.text;
  } else {
    newToDo.classList.remove("A17-del");
    newToDo.innerText = newObj.text;
  }
}

function paintToDo(newObj) {
  const newToDoSet = document.createElement("li");
  newToDoSet.id = newObj.id;
  const newToDo = document.createElement("span");
  checkDone(newObj, newToDo);
  newToDo.addEventListener("click", doneFunc);
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "X";
  deleteButton.addEventListener("click", deleteToDo);
  newToDoSet.append(newToDo, " ", deleteButton);
  toDoList.appendChild(newToDoSet);
}

function submitFunc(event) {
  event.preventDefault();
  const newInput = toDoInput.value;
  const newObj = {
    text: newInput,
    id: Date.now(),
    is_done: false,
  }
  toDoInput.value = "";
  toDos.push(newObj);
  saveToDos();
  paintToDo(newObj);
}

toDoForm.addEventListener("submit", submitFunc);

const savedToDos = localStorage.getItem(TODO_KEY);

if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(paintToDo);
}
