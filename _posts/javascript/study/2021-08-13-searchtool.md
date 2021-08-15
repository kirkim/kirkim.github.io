---
layout: post
title:  "[JavaScript] form태그, Local Storage 사용 해보기"
subtitle:   ""
date: 2021-08-13 02:45:51 +0900
categories: javascript
tags: study
comments: true
---

* * *
<h1>1️⃣ 폼(form)이란?</h1>

* `form`태그를 이용하면 <rd>서버</rd>에 <rd>입력한 데이터</rd>를 전송할 수 있습니다. 한가지 사용예로는 <b style="color:green">로그인창</b>에서 **아이디**와 **비밀번호**를 입력받는 경우를 들 수 있습니다.
* 다음은 간단한 사용 예시입니다.

```html
<form action="xxx.php">
    <input type="text" name="id" />
    <input type="text" name="email" />
    <input type="submit" />
</form>
```

* 위의 간단한 예시를 살펴보면 `form`태그 안의 입력값들을 `xxx.php`서버로 보내줍니다.
* `<input type="text">`를 이용하면 **아래와 같이 사용자**가 입력할 수 있는 텍스트가 생깁니다.

<div>
	<input type="text" />
</div>
<br>

* `<input type="submit" />`을 사용하면 **아래와 같이** 서버에 입력값을 전송할 수 있는 <b style="color:green">버튼</b>이 생깁니다.
<div>
	<input type="text" />
	<input type="submit" />
</div>
<br>

* 만약 `type`이 겹치게 되면 **서버**에서 구분할 수 있도록 적절한 `name`을 지어주는 것이 좋습니다.
* `type`의 **옵션**은 여러가지가 있는데 **아래의 사이트**에 자세히 설명되어 있습니다.
<br>
👉🏻 👉🏻 👉🏻 <a href="https://www.w3schools.com/htmL/html_form_input_types.asp" target="blank">w3schools.com - HTML Input Types</a>
<br><br>

* * *
<h1>2️⃣ 제출(submit)되는 데이터 읽어보기</h1>

* * *
<h2 style="color:#0e435c;">(1) submit데이터 출력해보기</h2>

* 아래는 **입력받아 서버에 submit(제출)** 하는 예제입니다.

```html
<form id="login">
    <input type="text" />
    <input type="submit" />
</form>
```

* **javascript**에서 **form 요소**에 접근하여 <b style="color:blue">서버에 보낼 데이터</b>가 무엇인지 알 수 있습니다.
* **이 데이터**를 `console.log()`를 이용하여 출력해보도록 하겠습니다.

```javascript
const login = document.querySelector("#login");
const loginInput = document.querySelector("#login input");

function onLogin() {
    const text = loginInput.value;
    console.log(text);
}

login.addEventListener("submit", onLogin);
```

* 하지만 `0.5초`정도 잠깐 **console창**에 출력되고 사라졌습니다.
* 그 이유는 `<form>`태그에서 `submit`을 하게되면 **브라우저**가 감지하여 자동으로 **서버로 입력 데이터**를 보내줍니다. 이 과정에서 자동으로 <b style="color:green">창이 새로고침</b> 되기 때문입니다.

* * *
<h2 style="color:#0e435c;">(2) form 동작 멈추게 하기</h2>

* 제대로 **출력값**을 보기 위해서는 <rd>form</rd>의 동작을 멈추게 해야됩니다.
* 위의 예시에서 `form요소`를 직접다루는 함수인 `onLogin()`함수에 다음과 같이 코드를 추가해 주면됩니다.

```javascript
function onLogin(event) {
	event.preventDefault();
	const text = loginInput.value;
	console.log(text);
}
```

* **javascript**만의 방법으로 `event`라는 인자를 받아올 수 있습니다. 이 `event`는 `addEventListener("submit", onLogin);`을 하면서 발생한 **이벤트에 대한 정보**를 담고 있습니다.

```javascript
function onLoginSubmit(event) {
	event.preventDefault();
	const text = loginInput.value;
	console.log(text);
}
```

* 이제 **새로고침**(서버로 데이터 전송)이 멈추고 정상적으로 **console출력**이 되었습니다.
* `.value`를 이용하여 **입력 데이터**를 얻어올 수 있습니다.
* `event`요소를 출력해보면 다음과 같이 출력 됩니다.

```javascript
/* 코드 생략 */
console.dir(event);
```

<img src="https://kirkim.github.io/assets/img/js/js11.png" alt="front_script">
<br><br>

* * *
<h1>3️⃣  Local Storage 사용해보기</h1>

* **브라우저**에서 지원하는 일종의 **미니DB**와 같은 기능을 합니다. 동일 **컴퓨터** 동일 **브라우저**를 이용하면 **Local Storage**에 저장된 값이 그대로 유지됩니다.
* 자세한 설명은 **아래의 사이트**에 잘되어 있습니다.
<br>
👉🏻 👉🏻 👉🏻 <a href="https://www.zerocho.com/category/HTML&DOM/post/5918515b1ed39f00182d3048" target="blank">zerocho.com - 로컬스토리지, 세션스토리지</a>

* `localStorage`오브젝트를 이용하면 **손쉽게** <b style="color:green">Local Storage</b>에 **key, value**값으로 저장을할 수 있습니다.

```javascript
/* 코드 생략 */

const text = loginInput.value;
localStorage.setItem("username", text);
```

* 위와같은 코드 구성으로 <rd>입력 데이터값</rd>을 **저장**할 수 있습니다. 위에서 말했듯이 **Local Storage**에 저장된 값이 유지됩니다. 그렇기 때문에 굳이 `preventDefault();`을 사용하여 **전송**을 정지시킬 필요가 없이도 값을 저장할 수 있습니다.

<h4 align="middle" style="color:#0e435c;">&lt; "apple"을 입력&gt;</h4>
<img src="https://kirkim.github.io/assets/img/js/js12.png" width="85%" alt="local storage in">
<h4 align="middle" style="color:#0e435c;">&lt; Local Storage에 저장된 모습&gt;</h4>
<img src="https://kirkim.github.io/assets/img/js/js13.png" width="85%" alt="local storage out">
<br><br>

* * *
<h1>4️⃣  응용 결과물</h1>

1. <b style="color:orange">Log IN(로그인)</b>시 `localStorage.setItem`으로 <b style="color:green">입력 데이터</b>를 <b style="color:blue">Local Storage에 저장</b>과 동시에 <b style="color:red">출력</b>
2. <b style="color:orange">Log Out(로그아웃)</b>시 `localStorage.removeItem`으로 <b style="color:blue">Local Storage에 저장</b>된 <b style="color:green">입력 데이터</b>를 제거함과 동시에 <b style="color:red">출력</b>문을 제거

* 이처럼 <rd>저장과 제거</rd>가 독립적으로 이뤄지기 때문에 중간에 `preventDefault();`을 사용하여 동작을 멈춘 상태에서 제거동작을 하면 **에상치못한 결과**가 발생하였습니다.
* 그렇기 때문에 `preventDefault();`을 사용하지 않고 사용하며 `Log in`시 <b style="blue">새로고침</b>이 한번 발생하여 **서버 전송**과정이 일어납니다.
<div class="A13_block">
	<span>KIRKIM</span>
	<form id="A13_form" class="hidden">
		<span  >
			<input
				required
				maxlength="15"
				type="text"
				placeholder="what is your name?"
			/>
			<input type="submit" value="Log In" />
		</span>
	</form>
	<button id="A13_logout">Log out</button>
</div>
<div class="A13_block2">
	<b id="A13_out" class="hidden"></b><br>
</div>

<style>
	.A13_block {
		background-color: green;
		color: white;
		border-radius: 5px;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		width: 80%;
		padding: 1% 2%;
	}
	.A13_block2 {
		background-color: #79a575;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		width: 80%;
		padding: 1% 2%;
		font-size:40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.hidden {
		display: none;
	}
	.aaa {
		display: inline;
	}
</style>

<script>
	const outA = document.querySelector("#A13_out");
	const loginForm = document.querySelector("#A13_form")
	const loginInput = document.querySelector(".A13_block input");
	const logOut = document.querySelector("#A13_logout");
	const usrName = localStorage.getItem("username");

	function onLoginSubmit(event) {
		loginForm.classList.add("hidden");
		loginForm.classList.remove("aaa");
		const username = loginInput.value;
		localStorage.setItem("username", username);
		paintHello(username);
	}

	function paintHello(username) {
		outA.innerText = `Hello ${username}!`;
		outA.classList.remove("hidden");
		logOut.classList.remove("hidden");
	}

	function logOutFunc() {
		if  (usrName !== null) {
			localStorage.removeItem("username");
			logOut.classList.add("hidden");
			outA.classList.add("hidden");
			loginForm.classList.remove("hidden");
			loginForm.classList.add("aaa");
		}
	}

	if  (usrName === null) {
		loginForm.classList.remove("hidden");
		loginForm.classList.add("aaa");
		logOut.classList.add("hidden");
		loginForm.addEventListener("submit", onLoginSubmit);
	} else {
		paintHello usrName);
		logOut.addEventListener("click", logOutFunc);
	}
</script>
