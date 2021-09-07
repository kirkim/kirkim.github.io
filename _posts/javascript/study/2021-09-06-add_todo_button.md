---
layout: post
title: "[JavaScript] "
subtitle: ""
date: 2021-09-06 02:45:51 +0900
categories: javascript
tags: study
comments: true
---

<h1>1️⃣ 목표</h1>
<kline></kline>

- 이전에 <b class="brown">todo리스트</b>를 <b class="purple">class(클래스)</b>로 **리펙토링**하였습니다.
- 이제 이 <b class="purple">todo리스트 클래스</b>가 정상적으로 동작하는지 확인할겸 <b class="button">todo리스트</b>를 <b class="green">생성하고 지울 수 있는 버튼</b>을 만들어볼 계획입니다.

<h1 class="ksubject">2️⃣ 상수 선언</h1>
<h2 class="ksubsubject">(1) 기본적인 방법으로 상수 선언</h2>

- <b class="purple">클래스</b>로 **리펙토링**을 하면서 <b class="blue">공통된 상수</b>를 어떻게 선언해야될지 고민이 되었고 다음과 같이 **두가지**방법을 고려했습니다.
  1.  <b class="green">constructor(생성자)</b>안에서 선언하기
  2.  **클래스밖**에서 <b class="green">전역적</b>으로 선언하기
- <b class="blue">첫번째</b>방법은 <b class="brown">새로운 개체 인스턴스</b>가 생성될 때마다 **고정된 상수를 초기화 해줄 필요가 있을까?** 라는 생각이 들었습니다.
- <b class="blue">두번째</b>방법은 **class**밖에 **전역변수**로 선언하는 것이 <b class="blue">모듈화</b>에 있어서 **맞는방법인가?** 라는 생각이 들었고, 결정적으로 **모듈**내에서 이런식으로 선언된 **다른 변수**들과 <b class="purple">변수명 충돌</b>실수를 할 수도 있다는 생각도 들었습니다.

<kline></kline>

<h2 class="ksubsubject">(2) Object.freeze 사용하기</h2>

- <b class="blue">Object.freeze</b>를 사용하면 위의 **문제점**들을 해결할 수 있습니다.

<img src="/assets/img/js/todobtn_class/2.png" alt="use object.freeze" width="80%" />

- 위와같이 <b class="green">TodoBtn클래스</b>위에 선언해주었습니다.
- <b class="green">TodoBtn클래스</b>를 <b class="red">export default</b>대신에 <b class="red">export</b>로 굳이 바꿔줬는데 그 이유는 **다음의 사이트**가 설명을 잘해주기 때문에 넘기겠습니다.

👉🏻👉🏻👉🏻 <a href="https://ko.javascript.info/import-export#ref-4122" target="blank"> 모듈 내보내고 가져오기 <b style="font-size:85%">- JAVASCRIPT.INFO</b></a> 🍄<br>

- <b class="blue">Object.freeze</b>의 기능 또한 **다음의 사이트**에서 설명이 잘되어 있습니다.

👉🏻👉🏻👉🏻 <a href="https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze" target="blank"> Object.freeze() <b style="font-size:85%">- mozillaMDN</b></a> 🍄<br>

- 위의 **MDN**의 내용대로라면 **상수**로써 역할을 하기에 충분할 것같습니다. 추가적으로 **개체**형태이기 때문에 <b class="green">사용할 때</b>도 편리해집니다.

<img src="/assets/img/js/todobtn_class/1.png" alt="use object.freeze" width="80%" />

- **개체**명만 입력하면 <b class="blue">VScode</b>에서 알아서 **목록**들을 보여줍니다.
- **이런식**으로 만들어준 <b class="brown">상수 개체</b>들을 **한 파일**에 따로 모아서 사용해도 괜찮을 것(?) 같다는 생각이 들었습니다.

<h1 class="ksubject">3️⃣ todoBtn클래스 만들기</h1>
<h2 class="ksubsubject">(1) 이벤트 구성</h2>

```javascript
eventMaster = (event) => {
  if (event.target.className === "plus__Btn") {
    this.addPage(event);
  } else if (event.target.className === "delete__page") {
    this.deletePage(event);
  } else if (event.target.classList.contains("todo__Btn")) {
    this.viewPage(event.target.id);
  }
};
```

- <b class="brown">todoBtn클래스</b>의 **이벤트**는 다음과 같습니다.
  1.  <b class="green">plus 버튼</b>: <b class="brown">todo리스트</b>를 생성해주는 버튼
  2.  <b class="green">delete 버튼</b>: <b class="brown">todo리스트</b>를 삭제해주는 버튼
  3.  <b class="green">개별todo리스트 버튼</b>: 버튼에 맞는 <b class="brown">todo리스트</b>를 **보여주는** 버튼

<kline></kline>

<h2 class="ksubsubject">(2) 데이터 저장</h2>

- <b class="brown">todoBtn클래스</b>는 <b class="red">생성한 todo리스트의 id</b>만 저장하면 됩니다. <b style="font-size:85%">(각각의 <b>todo</b> 내용은 <b class="bronw">todo리스트</b>클래스가 저장하고 있기 때문에)</b>
- 아직 **백엔드**지식이 없기 때문에 <b class="brown">todo리스트</b>를 만들었을 때처럼 <b class="blue">local storage</b>를 이용했습니다.

👉🏻👉🏻👉🏻 <a href="https://kirkim.github.io/javascript/2021/08/16/todo_list.html" target="blank"> todo리스트 만들기포스트 </a> 🍄

<kline></kline>

<h2 class="ksubsubject">(3) todoBtn 주요기능함수 구현</h2>

- <b class="purple">plus 버튼</b>을 누르면 다음의 **순서**로 함수가 호출됩니다. 1. <b class="green">addPage()</b>: **todo리스트**의 `id`생성 밑 <b class="blue">local storage</b>에 데이터를 저장하는 역할 2. <b class="green">makePage()</b>: 새로운 **todo리스트**인스턴스 생성 및 <b class="borwn">page배열</b>에 각todo리스트정보 저장 <b style="font-size:85%">(<b class="brown">page배열</b>은 **특정todo리스트를 노출**시키고자 할때 이용할 배열)</b> 3. <b class="green">makeBtn()</b>: **각 todo리스트**와 매칭되는 버튼을 생성해주는 역할

<h3 class="ksubsubject">&#91;1&#93; addPage()</h3>

```javascript
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
```

<h3 class="ksubsubject">&#91;2&#93; makePage()</h3>

```javascript
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
```

<h3 class="ksubsubject">&#91;3&#93; makeBtn()</h3>

```javascript
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
```

<kline></kline>

<h2 class="ksubsubject">(4) 데이터 불러오기</h2>

- 각각의 <b class="bronw">todo리스트</b>내용들은 <b class="blue">todo리스트클래스</b>가 <b class="blue">local storage</b>에 저장해두었습니다.
- <b class="blue">todoBtn클래스</b>가 <b class="blue">local storage</b>에 저장한 **todo리스트**의 `id`를 불러와서 <b class="green">addPage()</b>호출을 건너 뛰고 <b class="green">makePage()</b>함수부터 호출하여 생성해 주었습니다.

```javascript
loadData() {
	const savedData = localStorage.getItem(BtnUI.page_key);
	if (savedData !== null) {
		const parseData = JSON.parse(savedData);
		this.savedPage = parseData;
		parseData.forEach((obj) => this.makePage(obj.nb));
	}
}
```

<kline></kline>

<h2 class="ksubsubject">(5) 타이틀입력(prompt이용)</h2>
<img src="/assets/img/js/todobtn_class/3.png" alt="todo title" width="70%" />

- <b class="brown">todo클래스</b>에 <b class="green">title</b>을 입력받는 기능이 있는데 **위의 이미지**와 같이 단순히 숫자만 나오게 구현을 했었습니다. <b style="font-size:85%">(**이 숫자**는 단순히 랜덤한 버튼색에 배정된 숫자)</b>

<img src="/assets/img/js/todobtn_class/4.png" alt="handle title value" width="80%" />

- <b class="brown">todo클래스</b>에서는 받아온 <b class="blue">title</b>인자를 위와 같이 처리하기 때문에 `innerHTML`사용으로 생길 수 있는 <b class="red">보안문제</b>로 부터 안전합니다.
- 그렇기 때문에 <b class="blue">title</b>를 <b class="green">prompt()</b>를 이용하여 **유저로 부터 직접 입력**을 받아도 될 것 같습니다.

<img src="/assets/img/js/todobtn_class/5.png" alt="handle title value2" width="70%" />

- <b class="blue">plus버튼</b>을 누르면 호출되는 <b class="green">addPage()</b>에 위와 같이 **유저입력**을 받는 코드를 넣었습니다. 이 데이터는 **새로고침**할 때 필요하기 때문에 <b class="blue">"local storage"</b>에도 저장해 주었습니다.

<img src="/assets/img/js/todobtn_class/6.png" alt="input title" width="50%" />
<img src="/assets/img/js/todobtn_class/7.png" alt="result title" width="80%" />

<h1 class="ksubject">4️⃣ 보안해야할 점</h1>
<h2 class="ksubsubject">(1) 로딩 매커니즘</h2>

- <b class="red">새로고침</b>을 할때마다 <b class="green">todo리스트 폼</b>을 생성해주고 <b class="green">todo리스트 내용을 입력</b>해주고, <b class="green">각 todo리스트 버튼</b>을 생성해줍니다.
- 아직 <b class="blue">생성할 노드</b>가 **적기** 때문에 **느껴지지 않지만** <b class="blue">생성할 노드</b>가 <b class="red">무수히 많아진다면</b> 매우 비효율적이라는 생각이 들었습니다.
- 곧 **백엔드**에 대한 공부도 시작할 계획인데 **좀 더 지식과 경험**을 쌓고 **다시한번 고민**해야봐야할 것 같습니다.

<h1 class="ksubject">5️⃣ 최종 출력물</h1>

<style>
iframe.todoBtn123 {
  width: 650px;
  height: 340px;
}
</style>

<iframe class="todoBtn123" src="/assets/js_study/todoBtn/todoBtn.html"></iframe>
