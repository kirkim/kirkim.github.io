---
layout: post
title: "[JavaScript] addEventListener 써보기(마우스 이벤트)"
subtitle: ""
date: 2021-08-12 02:45:51 +0900
categories: javascript
tags: study
comments: true
---

<h1>1️⃣ addEventListener()</h1>
<kline></kline>

- 자바스크립트에서 `document`오브젝트를 사용하여 `html`의 요소에 접근을 할 수 있습니다.

<kkr>
<b style="color:#10eeee">const</b> aa <rd>=</rd> document.<b style="color:#3afc28">querySelector</b>(<b style="color:#fdfa51">".hello"</b>);<br>
</kkr>

- 위처럼 `hello`라는 클래스를 찾아 `aa`에 저장해줬습니다.
- 이제 `aa`는 `addEventListener`메소드를 이용하여 **여러가지 동작(event)**들을 감지할 수 있습니다.

```javascript
console.dir(document);
```

- `document`의 요소들이 무엇이 있는지 콘솔출력으로 확인해 봤습니다.
  <img src="https://kirkim.github.io/assets/img/js/js10.png" alt="console_out_document">

- 위처럼 `document`의 요소들중 <b style="color:green">마우스관련 요소</b>가 여러가지 존재하였습니다.
- 그중 하나인 `mouseenter`의 동작(event)를 이용해보겠습니다.

```javascript
aa.addEventListener("mouseenter", mouseEnterFunc);
```

- 위의코드의 동작방식은 `mouseenter`(마우스가 안에 있으면) `mouseEnterFunc`을 호출합니다.

<h1 class="ksubject">2️⃣ 같은 클래스 동시에 작동시켜보기</h1>

- `quertSelector`메소드를 이용하여 **해당클래스**를 불러올 수 있었습니다. 하지만 같은 **클래스나 아이디**가 존재할 경우 <rd>가장 처음의 것</rd>만 불러올 수 있었습니다.
- 대신에 `quertSelectorAll`을 이용하면 **해당클래스**를 모두 불러와 배열형식으로 저장할 수 있습니다.
- 이것을 이용하여 **같은 클래스를 모두 다룰 수 있는 코드**를 구현해보도록 하겠습니다.

<kline></kline>

<h2 style="color:#0e435c;">(1) addEventlistener가 호출하는 함수에 매개변수?[실패]</h2>

- `addEventlistener`가 **동작(event)**을 감지하면 **두번째인자**로 넣어준 함수를 호출하도록 구현했습니다. 하지만 매 변수마다 호출되는 <rd>함수들이 중복</rd>되기 때문에 **매개변수**를 이용하여 재사용할 수 있도록 구현해봤습니다.

```javascript
function mouseLeaveFunc(a) {
  a.innerText = "Hello!";
}

function handleMouseLeave(a) {
  a.innerText = "Bye!";
}

for (let i = 0; i < aa.length; i++) {
  aa[i].addEventListener("mouseenter", handleMouse(aa[i]));
  aa[i].addEventListener("mouseleave", handleMouseLeave(aa[i]));
}
```

- 결론부터 말하자면 위와같은 코드는 <rd>동작하지않았습니다.</rd> 일단 제가 생각하는 방법과는 다른식으로 **매개변수**를 받아오는 것 같습니다.
- 인터넷에 검색해보면 적절하게 **매개변수**를 사용하는 방법이 있었습니다. 대표적으로 다음의 사이트에서 마지막 경우를 보면될 것같습니다.<br>
  <a href="https://opentutorials.org/course/1375/6761">생활코딩 - ddEventListener()</a>

<kline></kline>

<h2 style="color:#0e435c;">(2) 무식하게 반복문을 돌리기</h2>

```javascript
const aa = document.querySelectorAll(".hello");

for (let i = 0; i < aa.length; i++) {
  function mouseEnterFunc() {
    aa[i].innerText = "Hello!";
  }

  function mouseLeaveFunc() {
    aa[i].innerText = "Bye!";
  }

  aa[i].addEventListener("mouseenter", mouseEnterFunc);
  aa[i].addEventListener("mouseleave", mouseLeaveFunc);
}
```

- 위의 코드처럼 **함수**까지도 반복문에 넣었습니다.
- 이 방법이 올바른 방법인지는 아직 모르겠습니다. ~~<b style="font-size:85%">(**포스트**를 열고있는 동안 **반복문**이 계속돌고 있을 것 같은 느낌..)</b>~~
- 다행히 `for문`안에서 `console.log()`를 넣어 실험해본결과 <rd>반복문</rd>은 **포스트가 로딩된 최초 한번**만 실행되었고 <b style="color:gree">이벤트가 발생</b>하여도 <rd>반복문</rd>이 다시 돌지않았습니다. **C언어**에서 <rd>전처리기</rd>가 **매크로**나 **헤더파일**을 **전처리단계**에서 확장해주는 방식(?)과 같지않나 생각이듭니다.

<h1 class="ksubject">3️⃣ 결과물</h1>

- <b style="color:green">랜덤하게 색을 변하게하는 기능</b>도 추가하여 다음과 같은 **결과물**을 만들었습니다.
- ~~**아직도** **Javascript**에서 <b style="color:navy">위와 같은 코드가 어떤식으로 작동</b>하는지 **이해가 되지 않습니다.** <b style="font-size:75%">(반복문안의 함수들을 펼쳐놓는다면 함수이름이 모두 같을텐데 어떻게 적절한 변수가 들어있는 함수를 찾아서 호출할까..?)</b>~~
- 또한 javascript언어에서 <b style="color:navy">css의 요소들을 다루는 것</b>도 올바른 사용 방법인 것 같지 않습니다.
- 하지만 <b style="color:green">Javascript</b>가 <b style="color:orange">이러한 놀라운 기능</b>까지도 할 수 있다는 것을 알게되었습니다.

<b class="hello">put your mouse here!</b><br>
<b class="hello">put your mouse here!</b><br>
<b class="hello">put your mouse here!</b><br>
<b class="hello">put your mouse here!</b><br>
<b class="hello">put your mouse here!</b><br>
<b class="hello">put your mouse here!</b><br>
<b class="hello">put your mouse here!</b><br>

<script>
	const aa = document.querySelectorAll(".hello");
	for(let i = 0; i < aa.length; i++)
	{
		function mouseEnterFunc() {
			aa[i].style.color = "#"+(parseInt(Math.random()*0xffffff)).toString(16);
			aa[i].style.fontSize = "300%";
			aa[i].innerText = "Hello Mouse!";
		}
		function mouseLeaveFunc() {
			aa[i].style.color = "#"+(parseInt(Math.random()*0xffffff)).toString(16);
			aa[i].style.fontSize = "200%";
			aa[i].innerText = "@@@@@@@@@@@";
		}
		aa[i].addEventListener("mouseenter", mouseEnterFunc);
		aa[i].addEventListener("mouseleave", mouseLeaveFunc);
}
</script>
<style>
	.hello {
		font-size:200%;
		line-height: 60px;
	}
</style>

<h1 class="ksubject">4️⃣ JS방식으로 깔끔하게 작성하기<b style="font-size:85%">(21.08.24추가내용)</b></h1>

- <b class="orange">자바스크립트</b>를 공부하다 문득 **for문**으로 무식하게 작성했던때가 생각 났습니다. <b style="font-size:85%">(위의 2번)</b>
- 그나마 제대로 공부했던 **언어**는 <b class="blue">C언어</b>였기 때문에 <b class="orange">자바스크립트</b>의 함수의 **매개변수**의 개념이 익숙하지가 않은 것이 원인이였습니다.
- 그 중하나로 **이벤트함수**는 **event**요소를 받을 수 있으며 `.target`을 이용하여 이벤트가 일어난곳의 **부모노드**에 접근할 수 있습니다.
- 아직도 **이벤트 위임** 등과 같은 **이벤트**와 관련된 것들을 더 공부해야겠지만, 일단은 위의 `(2)`의 <b class="red">for문</b>안에 위치한 <b class="green">이벤트 함수들을</b> 다음과 같이 밖으로 끄집어낼 수 있습니다.

```javascript
const aa = document.querySelectorAll(".hello");

function mouseEnterFunc(event) {
  event.target.innerText = "Hello!";
}

function mouseLeaveFunc(event) {
  event.target.innerText = "Bye!";
}

for (let i = 0; i < aa.length; i++) {
  aa[i].addEventListener("mouseenter", mouseEnterFunc);
  aa[i].addEventListener("mouseleave", mouseLeaveFunc);
}
```

- 더 나아가 `foreach()`메소드를 이용하면 <b class="green">이벤트함수</b>들도 <b class="orange">자바스크립트</b>스럽게(?) 작성할 수 있습니다.

```javascript
aa.forEach((a) => {
  a.addEventListener("mouseenter", mouseEnterFunc);
  a.addEventListener("mouseleave", mouseLeaveFunc);
});
```

- 하지만 <b class="red">주의</b>해야될 부분이 있는데 `aa`변수는 <b class="green">"querySelectorAll()"</b>로 생성한 <b class="yellow">노드배열</b>입니다.
- <b class="yellow">유사배열</b>이라고도 할 수 있는데, 이처럼 **유사배열**의 경우 <b class="red">배열</b>의 **메소드**를 이용할 수 없을 수도 있습니다.
- **다행히** `foreach()`메소드는 <b class="yellow">노드배열</b>프로퍼티에도 존재했기때문에 사용이 가능했습니다.
  <img src="https://kirkim.io/assets/img/js/arrayfunc/4.png" alt="nodelist_func_list">

- **배열과 유사배열**에 관해 자세히 알고 싶으면 다음사이트를 참고하면 될 것 같습니다.
  👉🏻 👉🏻 👉🏻 <a href="https://www.zerocho.com/category/JavaScript/post/5af6f9e707d77a001bb579d2">배열과 유사배열 - ZeroCho Tv</a>
- 이러한 **유사배열**도 `Array.from()`을 이용하면 **배열**처럼 만들 수 있습니다.

```javascript
const aa = document.querySelectorAll(".hello");
console.log(aa); // NodeList(7)
console.log(Array.from(aa)); // Array(7)
```

- 위의 **콘솔**출력결과를 보면 정상적으로 **배열**로 바뀐모습을 알 수 있습니다.
- `Array.from()`은 단순히 **배열**로 바꿔주는 함수가 아니라 **기존의 배열을 커스텀하여 복사된 배열**을 반환하는 기능을 가지고 있습니다.
- 어찌됐든 `Array.from()`기능을 사용하면 <b class="red">배열을 복사</b>하는 과정이 일어납니다. **노드배열**에도 `forEach()`메소드가 있다는 것을 안 이상 굳이 사용할 필요가 없습니다. <b style="font>
