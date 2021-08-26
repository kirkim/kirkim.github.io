---
layout: post
title: "[JavaScript] 그림판만들기(Camvas이용)"
subtitle: ""
date: 2021-08-24 02:45:51 +0900
categories: javascript
tags: study
comments: true
---

<h1>1️⃣ 목표</h1>
<kline></kline>

- <b class="orange">Canvas API</b>를 이용해 <b class="blue">그림판</b>을 만들어볼 계획인데 **기본 베이스**는 <b class="purple">노마드코더</b> 강의를 보고 만들었습니다.<br>
  👉🏻👉🏻👉🏻<a href="https://nomadcoders.co/javascript-for-beginners-2" target="blank">바닐라 JS로 그림판 만들기 - <b style="font-size:90%">노마드코더(니콜라스)</b></a>

- 이렇게 만들어진 **기본 그림판**에 <b class="purple">추가적인 기능</b>을 구현할 예정입니다.
  <kline></kline>

- 이전에 <b class="red">&lt;p5.js&gt;</b>를 이용하여 <b class="blue">"raycasting"</b>을 구현하는 법을 배운적이 있습니다. <b class="red">&lt;p5.js&gt;</b>는 <b class="orange">Canvas API</b>를 **포함**하고 있는 <rd>라이브러리</rd>입니다. 여기서 **Canvas**의 강력한 기능을 경험한적이 있습니다.
- 이처럼 <b class="orange">Canvas API</b>관련 **라이브러리**가 많기 때문에 **강력하지만 다소 어려울 수 있는 Canvas**사용을 쉽게 다룰 수 있게 해줍니다.
- 하지만 이번에는 **라이브러리** 사용없이 기본적인 **Canvas**를 이용할 것입니다.
<kline></kline>
<h3>🎨 <b>Canvas API</b> 설명사이트</h3>
👉🏻 <a href="https://developer.mozilla.org/ko/docs/Web/API/Canvas_API" target="blank">Canvas API - MDN</a>
<h3>🎨 <b>p5.js</b> 공식사이트</h3>
👉🏻 <a href="https://p5js.org/ko/" target="blank">https://p5js.org/ko</a>
<h3>🍌 <b>p5.js</b>를 이용하여 raycasting을 구현한 내용의 포스트</h3>
👉🏻 <a href="https://kirkim.github.io/42seoul/2021/04/23/cub3d3.html" target="blank">자바스크립트로 raycasting 구현하기</a><br>

<h1 class="ksubject">2️⃣ 도구선택 유연하게 만들기</h1>
<h2 style="color:#0e435c;">(1) 기존의 도구선택방식</h2>

- **기본적**으로 구현한 <b class="purple">그림판</b>의 경우 도구가 <b class="blue">팬</b>과 <b class="brown">채우기</b> **두가지** 였습니다.
  <kkr>
  <b class="skyblue">let</b> filling = <b class="purple">false</b>;<br>
  </kkr>

- **도구**가 <rd>두가지</rd>이기 때문에 `filling`변수가 <b class="purple">false</b>이면 **팬**으로 그리기, <b class="purple">true</b>이면 **채우기**동작을 하도록 구현해도 문제가 없었습니다.

<kline></kline>

<h2 style="color:#0e435c;">(2) 도구를 세가지이상 늘어난다면?</h2>

- **만약 도구가 세가지 이상**으로 늘어난다면, `filling`과 같이 <rd>boolean</rd>형으로 사용할 변수가 한개로는 부족해 집니다.
- 만약 <b class="blue">원을 그리는 도구</b>를 추가한다고 하면 다음과 같이 **독립적**으로 **참, 거짓**을 판별하는 변수들을 선언할 수 있습니다.
  <kkr>
  <b class="skyblue">let</b> isPaint = <b class="purple">false</b>;<br>
  <b class="skyblue">let</b> isPen = <b class="purple">false</b>;<br>
  <b class="skyblue">let</b> isCircle = <b class="purple">false</b>;<br>
  </kkr>

- 하지만 **화면에 그리기**위해서는 모두 <rd>마우스를 클릭</rd>하는 동작이벤트가 겹치기 때문에 <b class="green">사용하는 동구가 아니라면 모두</b><b class="purple">false</b>로 바꿔주어야합니다.
- 이런식으로 처리하려면 **따로 처리하는 함수**를 구현해야하고 **추후에** <b class="orange">새로운 도구</b>가 추가되면 **수정**하는데도 불편할 것같습니다. <b style="font-size:85%">(유연하지 못한 코드)</b>

<kline></kline>

<h2 style="color:#0e435c;">(3) 최종 도구 선택방식</h2>

- 위에서 처럼 <b class="purple">boolean</b>형으로 **각각의 도구들**을 구분하여 사용하는 것은 여러모로 <rd>비효율</b>적인 것 같습니다.
- 대신에 다음과 같이 새로운 **방식**이 좋을 것같습니다.

  <kkr>
  <b class="skyblue">const</b> PEN = <b class="purple">1</b>;<br>
  <b class="skyblue">const</b> PAINT = <b class="purple">2</b>;<br>
  <b class="skyblue">const</b> CIRCLE = <b class="purple">3</b>;<br>
  <br>
  <b class="skyblue">let</b> tool = PEN;<br>
  </kkr>

- 위와 같이 <b class="orange">매크로 형식</b>으로 <b class="blue">도구</b>를 지정해놓고 `tool`이라는 변수에 **선택적**으로 지정해서 사용하는 방식입니다.
- 이제 **도구를 설정해주는 함수**도 따로 구현할 필요가 없어졌습니다.

```javascript
if (paint) {
  paint.addEventListener("click", () => (tool = PAINT));
}

if (pen) {
  pen.addEventListener("click", () => (tool = PEN));
}
```

- 위와같이 **각각의 도구선택 이벤트**들도 <b class="blue">깔끔하게 구현</b>할 수 있으며 <b class="orange">새로운 도구</b>가 추가되어도 <b class="green">유연하게 추가하고 제거</b>할 수 있을 것 같습니다.

<h1 class="ksubject">3️⃣ 도구에 맞는 이벤트 맞춤설정하기</h1>
<h2 style="color:#0e435c;">(1) 이벤트 중복문제</h2>

- 이제 `tool`이라는 변수로 <b class="orange">어떤 도구</b>를 쓰는지 쉽게알 수 있습니다.
- 하지만 <b class="orange">각각의 도구들</b>은 모두 <b class="blue">마우스관련 이벤트</b>이고 모두 <b class="green">같은 화면(종이)</b>에서 동작합니다. 결국 <rd>"이벤트가 겹칠 수 밖에 없습니다.</b>
- 물론 **마우스 이벤트마다** <b class="orange">각각의 도구들</b>을 `if, else`로 처리하여 **동작을 다르게**하도록 구현할 수 있습니다. **마우스 이벤트**는 종류는 한정적이기 때문에 **새로운 도구**가 생겨도 수정하는데 큰어려움이 없을 것같습니다.

<kline></kline>

<h2 style="color:#0e435c;">(2) 유연성? 성능?</h2>

- <b class="orange">새로운 도구들</b>이 추가될때마다 **마우스 이벤트함수**들을 수정해주면 <b class="red">유연성(재사용)</b>면에서 좋을 것 같습니다.
- 하지만 **도구들**의 종류가 많아지게되면 <b class="green">"마우스 이벤트가 일어날때마다"</b> `if, else`로 <b class="orange">도구들</b>을 판별하는 과정도 부담스럽게 될 것입니다. <b style="font-size:90%">(단순히 <b class="blue">마우스를 움직이기만</b>해도 `if, else`로 도구를 탐색...)</b>
- 이렇게 <b class="green">성능</b>적으로 생각한다면 <b class="orange">도구</b>를 **선택**함과 동시에 <b class="orange">그 도구</b>**전용 이벤트**를 설정하는 것이 더 좋을 것 같습니다.

<kline></kline>

<h2 style="color:#0e435c;">(3) 이벤트 통제함수 구현</h2>

- 아직 <b class="green">이벤트함수</b>에 관해 잘 모릅니다. <b style="font-size:90%">(이벤트 위임, 버블 등등 들어봤지만 앞으로 배워야할 부분)</b>
- 그래도 <b class="blue">이벤트</b> <b class="purple">추가(add), 제거(remove)</b>함수에 대해서는 알기 때문에 이것들을 이용하여 다음과 같이 <b class="orange">이벤트를 통제하는 함수</b>(master)를 만들었습니다.

<img src="/assets/img/js/paint_brush/1.png" alt="event_func" />

- `master`함수가 호출되면 <rd>이전 이벤트 삭제</rd>를 하고 <b class="blue">도구에 맞는 새로운 이벤트를 생성</b>하는 과정이 일어납니다.
- **추가, 제거**함수들에 <b class="orange">각각의 도구</b>에 맞는 **이벤트 함수**들을 적용해야되기 때문에 처음에 **함수를 만들고 추가**하는 과정이 번거로울 수 있지만 <b class="blue">도구 추가,제거</b>가 편해질 것 같습니다.
- 무엇보다 **마우스 이벤트**마다 <rd>도구를 판별</rd>할 필요가 없어집니다.

```javascript
if (paint) {
  paint.addEventListener("click", () => master(PAINT));
}

if (pen) {
  pen.addEventListener("click", () => master(PEN));
}
```

- 위의 코드처럼 <b class="blue">도구를 선택</b>하면 `master`함수가 호출되어 <b class="green">알맞는 이벤트</b>로 적용됩니다.

<kline></kline>

<h2 style="color:#0e435c;">(4) 보완해야될 점</h2>

- 각 **도구**마다 겹치는 기능들이 있을 것같은데 그것에 대한 처리가 아쉬운 것 같습니다.
- **OOP**적인 관점으로 접근한다면 **각 도구**들마다 클레스를 구현하고 <b class="red">겹치는 기능</b>들은 <b class="blue">상속</b>을 이용하여 구현하면 좀 더 깔끔하지 않을까 하는 생각이 들었습니다.
- **자바스크립트**에서 <b class="orange">클레스(class)</b>를 이용하는 방법도 공부해 봐야할 것 같습니다.

<h1 class="ksubject">4️⃣ 새로운 기능 추가</h1>
<h2 class="ksubsubject">(1) 디테일 색상툴 이용하기</h2>

- <b class="red">html</b>의 `input`태그중에 다음과 같이 디테일하게 <b class="orange">색상</b>을 설정할 수 있는 기능이 있었습니다.
  <kkr>
  &lt;<rd>input</rd>&nbsp;&nbsp;<b class="yellowgreen">type</b>=<b class="yellow">"color"</b> /&gt;<br>
  </kkr>
  <img src="/assets/img/js/paint_brush/2.png" alt="event_func" />

<style>
	iframe {
		display: block;
		width:100%;
		height:80vh;
	}
</style>

<iframe src="/assets/js_study/paintbrush/paintbrush.html" scrolling="no"></iframe>
