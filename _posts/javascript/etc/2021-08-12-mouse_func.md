---
layout: post
title:  "[JavaScript]addEventListener(마우스관련 기능) 써보기"
subtitle:   ""
date: 2021-08-12 02:45:51 +0900
categories: javascript
tags: etc
comments: true
---

* * *
<h1>1️⃣ addEventListener()</h1>

* 자바스크립트에서 `document`오브젝트를 사용하여 `html`의 요소에 접근을 할 수 있습니다.

<kkr>
<b style="color:#10eeee">const</b> aa <rd>=</rd> document.<b style="color:#3afc28">querySelector</b>(<b style="color:#fdfa51">".hello"</b>);<br>
</kkr>

* 위처럼 `hello`라는 클래스를 찾아 `aa`에 저장해줬습니다.
* 이제 `aa`는 `addEventListener`메소드를 이용하여 **여러가지 동작(event)**들을 감지할 수 있습니다.

```javascript
console.dir(document);
```

* `document`의 요소들이 무엇이 있는지 콘솔출력으로 확인해 봤습니다.
<img src="https://kirkim.github.io/assets/img/js/js10.png" alt="console_out_document">

* 위처럼 `document`의 요소들중 <b style="color:green">마우스관련 요소</b>가 여러가지 존재하였습니다.
* 그중 하나인 `mouseenter`의 동작(event)를 이용해보겠습니다.

```javascript
aa.addEventListener("mouseenter", mouseEnterFunc);
```

* 위의코드의 동작방식은 `mouseenter`(마우스가 안에 있으면) `mouseEnterFunc`을 호출합니다.
<br><br>

* * *
<h1>2️⃣ 같은 클래스 동시에 작동시켜보기</h1>

* `quertSelector`메소드를 이용하여 **해당클래스**를 불러올 수 있었습니다. 하지만 같은 **클래스나 아이디**가 존재할 경우 <rd>가장 처음의 것</rd>만 불러올 수 있었습니다.
* 대신에 `quertSelectorAll`을 이용하면 **해당클래스**를 모두 불러와 배열형식으로 저장할 수 있습니다.
* 이것을 이용하여 **같은 클래스를 모두 다룰 수 있는 코드**를 구현해보도록 하겠습니다.

* * *
<h2 style="color:#0e435c;">(1) addEventlistener가 호출하는 함수에 매개변수?[실패]</h2>

* `addEventlistener`가 **동작(event)**을 감지하면 **두번째인자**로 넣어준 함수를 호출하도록 구현했습니다. 하지만 매 변수마다 호출되는 <rd>함수들이 중복</rd>되기 때문에 **매개변수**를 이용하여 재사용할 수 있도록 구현해봤습니다.

```javascript
function mouseLeaveFunc(a) {
	a.innerText = "Hello!";
}

function handleMouseLeave(a) {
	a.innerText = "Bye!";
}

for(let i = 0; i < aa.length; i++)
{
    aa[i].addEventListener("mouseenter", handleMouse(aa[i]));
    aa[i].addEventListener("mouseleave", handleMouseLeave(aa[i]));
}
```

* 결론부터 말하자면 위와같은 코드는 <rd>동작하지않았습니다.</rd> 일단 제가 생각하는 방법과는 다른식으로 **매개변수**를 받아오는 것 같습니다.
* 인터넷에 검색해보면 적절하게 **매개변수**를 사용하는 방법이 있었습니다. 대표적으로 다음의 사이트에서 마지막 경우를 보면될 것같습니다.<br>
<a href="https://opentutorials.org/course/1375/6761">생활코딩 - ddEventListener()</a>

* * *
<h2 style="color:#0e435c;">(2) 무식하게 반복문을 돌리기</h2>

```javascript
const aa = document.querySelectorAll(".hello");

for(let i = 0; i < aa.length; i++)
{
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

* 위의 코드처럼 **함수**까지도 반복문에 넣었습니다.
* 이 방법이 올바른 방법인지는 의문이 들었습니다. <b style="font-size:85%">(**포스트**를 열고있는 동안 **반복문**이 계속돌고 있을 것 같은 느낌..)</b> 하지만 <b style="color:blue">정상적으로 동작</b>은 했습니다.
<br><br>

* * *
<h1>3️⃣ 결과물</h1>
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
