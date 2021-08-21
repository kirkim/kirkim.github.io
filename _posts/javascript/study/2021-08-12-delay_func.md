---
layout: post
title: "[JavaScript]자동으로 색이 바뀌는 전광판 만들기"
subtitle: ""
date: 2021-08-12 03:45:51 +0900
categories: javascript
tags: study
comments: true
---

<h1>1️⃣ 목표</h1>
<kline></kline>

- <b style="color:cornflowerblue">특정글자</b>를 <b style="color:cornflowerblue">마우스</b>로 클릭하면 <b style="color:cornflowerblue">일정시간 마다 랜덤하게 색</b>이 변하는 **기능**구현하기

<h1 class="ksubject">2️⃣ 이용할 메소드</h1>

1. `addEventListener()`: **이벤트**를 받아오는 메소드
2. `setInterval()`: <b style="color:green">일정시간(두번째 인자)</b>마다 <b style="color:blue">함수(첫번째 인자)</b>를 호출하는 함수
3. `clearInterval()`: <rd>setInterval()</rd>의 **반환값**을 받아 해당 기능을 정지시킴

<h1 class="ksubject">3️⃣ 사용1</h1>
<h2 style="color:#0e435c;">(1) 코드구현</h2>

```javascript
const aa = document.querySelector(".hello");
let key = null;

function randomColor() {
  aa.style.color = "#" + parseInt(Math.random() * 0xffffff).toString(16);
}

function clickMouseFunc() {
  if (key === null) {
    key = setInterval(randomColor, 300);
  } else {
    clearInterval(key);
    key = null;
  }
}
aa.addEventListener("click", clickMouseFunc);
```

- **특정 글자**를 <b style="color:blue">클릭</b>을 하면 **일정시간동안 글자색이 바뀌는 기능**을 키고 끌 수 있습니다.
- `setInterval()`의 **두번째 인자**는 `1000`당 **약 1초**의 딜레이가 생깁니다.

<kline></kline>

<h2 style="color:#0e435c;">(2) 결과</h2>

&#91; **전광판** <b style="color:blue">클릭시 "작동"</b> <rd>다시 클릭시 "정지"</rd> &#93;
<br>
<b> &lt; delay = 1000 &gt;</b><br>
<b class="random_A12">RANDOM WORD!</b><br>
<b> &lt; delay = 400 &gt;</b><br>
<b class="random_A12">RANDOM WORD!</b><br>
<b> &lt; delay = 50 &gt;</b><br>
<b class="random_A12">RANDOM WORD!</b><br>

<h1 class="ksubject">3️⃣ 사용2</h1>
<h2 style="color:#0e435c;">(1) 자연스럽게 색변환시키기(css)</h2>

- 색을 바뀔 때 <b style="color:cornflowerblue">좀 더 자연스럽게</b> 색을 바뀌는 **기능**을 추가해보겠습니다.
- <b style="color:blue">css</b>에 그러한 역할을 해주는 `transition`이라는 요소가 있습니다.
- 다음의 사이트에서 `transition`의 **놀라운 기능들**을 확인해볼 수 있습니다.

&gt;&gt;&gt;&gt;&gt;<a href="https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions">MDN Web Docs - mozilla</a>

```css
.sample {
  transition: color 0.2s ease-in-out;
}
```

- `transition`은 위와같이 `.2s`와 같이 **애니매이션**의 자동 시간을 조절할 수 있습니다.

<kline></kline>

<h2 style="color:#0e435c;">(2) 최종 결과물</h2>

- <b style="color:green">delay</b>와 <b style="color:green">transition의 작동시간</b>의 벨런스를 잘 맞추지 못하면 **색이 바뀌기 전에 다른색으로 변합**니다.
- 그렇기 때문에 <rd>두 값의 벨런스를 잘 맞추는 것이 중요합니다.</rd>
  <br><br>
  &#91; **전광판** <b style="color:blue">클릭시 "작동"</b> <rd>다시 클릭시 "정지"</rd> &#93;
  <br>
  <b> &lt; delay = 400 &gt;</b><br>
  <b class="random_A12">RANDOM WORD!</b><br>
  <b> &lt; delay = 400, transition: .2s&gt;</b><br>
  <b class="random_A12 action">RANDOM WORD!</b><br>
  <b> &lt; delay = 1500, transition: .9s &gt;</b><br>
  <b class="random_A12 action2">RANDOM WORD!</b><br>
  <b> &lt; delay = 100, transition: .1s &gt;</b><br>
  <b class="random_A12 action3">RANDOM WORD!</b><br>
  <b> &lt; delay = 100 &gt;</b><br>
  <b class="random_A12">RANDOM WORD!</b><br>

<script>
	const A12 = document.querySelectorAll(".random_A12");
	const delay_A12 = [1000, 400, 50, 400, 400, 1500, 100, 100];

	for (let i = 0; i < A12.length; i++) {
		let key = null;

		function randomColor() {
			A12[i].style.color = "#"+(parseInt(Math.random()*0xffffff)).toString(16);
		}

		function clickMouseFunc() {
			if (key === null) {
				key = setInterval(randomColor, delay_A12[i]);
			} else {
				clearInterval(key);
				key = null;
			}
		}
		A12[i].addEventListener("click", clickMouseFunc);
	}
</script>
<style>
	.random_A12 {
		font-size:200%;
		background-color:black;
	}
	.action {
		transition:color .2s ease-in-out;
	}
	.action2 {
		transition:color .9s ease-in-out;
	}
	.action3 {
		transition:color .1s ease-in-out;
	}
</style>
