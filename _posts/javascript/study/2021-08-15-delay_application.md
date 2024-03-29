---
layout: post
title: "[JavaScript] 이미지로딩 및 시계만들기"
subtitle: ""
date: 2021-08-15 02:45:51 +0900
categories: javascript
tags: study
comments: true
---

<h1>1️⃣ 자바스크립트로 이미지 로딩하기</h1>
<kline></kline>

- 이전에 **html의 요소들**을 **자바스크립트**에서 불러온 것을 배운적이 있습니다.
- 이번에는 반대로 **자바스크립트**에서 **html**에 **노드**를 만드는 **기능**을 써보겠습니다.
- `append()`메소드를 이용하면 <rd>부모노드</rd>에 <b style="color:red">자식노드</b>혹은 **문자**들을 추가해줄 수 있습니다. `appendChild()`메소드를 이용하면 오직 <b style="color:red">자식노드 한개</b>만을 추가해줄 수 있습니다.

```javascript
document.body.appendChild(sampleNode); //body에 생성
```

<kline></kline>

<h2 style="color:#0e435c;">(1) 이미지(img)태그 노드 생성</h2>

```javascript
const adImage = document.createElement("img");
adImage.src = `이미지 주소`;
```

- `document`개체의 `createElement()`메소드로 <b style="color:blue">img(이미지)</b>노드를 생성 합니다.
- <b style="color:blue">생성한 img태그</b>에 `.src`요소를 지정해줄 수 있습니다.

<kline></kline>

<h2 style="color:#0e435c;">(2) 링크(a)태그 노드 생성</h2>

```javascript
const adlink = document.createElement("a");
adlink.href = "웹 주소";
adlink.innerText = "표시해줄 링크문자";
```

- 당연히 `createElement()`를 이용하여 <b style="color:blue">링크(a)</b>노드를 생성할 수 있습니다.
- `.innerText`요소에 **유효한 문자**를 넣으면 정상적으로 링크가 표시됩니다.

<kline></kline>

<h2 style="color:#0e435c;">(3) 최종 결과물(이미지)</h2>
<div id="A15_slide3"></div>

<h1 class="ksubject">2️⃣ 시계만들기</h1>
<h2 style="color:#0e435c;">(1) 기본 함수</h2>

- 이전에 배웠던 **delay(타이머?)**함수인 `setInterval()`를 이용하여 시계를 만들어보겠습니다.
  <kfunc>
  <b style="color:#affc58">setInterval(<b style="color:blue">func</b>, <b style="color:red">delay</b>)</b><br>
  </kfunc>

- <b style="color:red">delay</b>마다 <b style="color:blue">func</b>을 호출해줍니다.
- <b style="color:red">delay</b>는 **ms**단위로 **1000**일경우 **1초**를 뜻합니다.
  <br>
  <kfunc>
  <b style="color:#58fcf4">const</b> date = <rd>new</rd> <b style="color:#58fcf4">Date</b>();<br>
  date.<b style="color:#affc58">getHours</b>()<br>
  date.<b style="color:#affc58">getMinutes</b>()<br>
  date.<b style="color:#affc58">getSeconds</b>()<br>
  </kfunc>

- `date`개체를 이용하여 **위와같이** 현재 프로그램의 `시, 분, 초`을 얻어올 수 있습니다.

<kline></kline>

<h2 style="color:#0e435c;">(2) 임시 결과물(시계)</h2>

```javascript
const clock = document.querySelector("span#clock");

function getClock() {
  const date = new Date();
  clock.innerText = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
setInterval(getClock, 1000);
```

<span id="clock2">00:00:00</span><br>

- 하지만 `시, 분, 초`의 **각 요소**가 <rd>한 자리수</rd>일 때 **부자연스럽게 출력**됩니다.
  <br><b style="font-size:90%">([ex] <b style="color:green">12시 6분 1초</b>가 <b style="color:green">12:6:1</b> 과 같이 출력)</b>

<kline></kline>

<h2 style="color:#0e435c;">(3) 최종 결과물(시계)</h2>

- 그래서 `padStart()`함수를 이용하여 <b style="color:blue">최소자리수(첫번째인자)</b>와 <b style="color:purple">채워줄 문자(두번째 인자)</b>를 적절히 적용하여 사용해 주었습니다.

```javascript
function getClock1() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  clock1.innerText = `${hours}:${minutes}:${seconds}`;
}
```

<span id="clock1">00:00:00</span><br>

- 이제 `시, 분, 초`의 **각 요소**가 자연스럽게 출력됨을 볼 수 있습니다.

<h1 class="ksubject">3️⃣ 응용 결과물</h1>

- <b style="color:green">이미지 로딩 기능(append())</b>과 <b style="color:blue">타이머 기능(setInterval())</b>함수를 **조합**하여 다음과 같이 <b style="color:#2597da">움직이는 이미지</b>를 만들 수 있습니다.
<div id="A15_slide1">
<b>&lt;이미지 출처: <a href="https://www.mon-arte.com/event/online/online_view?cri_group_idx=5">모나르떼(mon-arte.com)</a> &gt;</b>
</div>
<div id="A15_slide2"></div>

<script>
	const clock2 = document.querySelector("span#clock2");

	function getClock2() {
		const date = new Date();
		clock2.innerText = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}
	setInterval(getClock2, 1000);
</script>

<script>
	const clock1 = document.querySelector("span#clock1");

	function getClock1() {
		const date = new Date();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");
		clock1.innerText = `${hours}:${minutes}:${seconds}`;
	}
	setInterval(getClock1, 1000);
</script>

<script>
	const address = document.querySelector("#A15_slide1");
	const images = ["3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg"];
	const adImage = document.createElement("img");
	let cnt = 0;

	function randomImg() {
		cnt++;
		if (cnt === images.length) {
			cnt = 0;
		}
		const chosenImage = images[cnt];
		adImage.src = `https://kirkim.github.io/assets/img/js/delay_application/${chosenImage}`;
	}
	setInterval(randomImg, 100);
	address.appendChild(adImage);
</script>

<script>
	const addressT = document.querySelector("#A15_slide2");
	const imagesT = ["0.jpeg", "1.jpeg", "2.jpeg"];
	const adImageT = document.createElement("img");
	let cntT = 0;

	function randomImgT() {
		cntT++;
		if (cntT === imagesT.length) {
			cntT = 0;
		}
		const chosenImageT = imagesT[cntT];
		adImageT.src = `https://kirkim.github.io/assets/img/js/delay_application/${chosenImageT}`;
	}
	setInterval(randomImgT, 1000);
	addressT.appendChild(adImageT);
</script>

<script>
	const addressR = document.querySelector("#A15_slide3");
	const adImageR = document.createElement("img");

	adImageR.src = `https://kirkim.github.io/assets/img/js/delay_application/0.jpeg`;
	addressR.appendChild(adImageR);
</script>

<style>
	#clock1 {
		color:#b87100;
		font-size:300%;
		background-color:#2e271c;
		margin:10px;
		border-radius: 20px;
		border-style: double;
		border-color: #695028;
		border-width: thick;
	}
	#clock2 {
		font-size:300%;
		color:#ffffff;
		margin:10px;
		border-radius: 20px;
		background-color:#000000;
	}
	#A15_slide1 {
		width:50%;
	}
	#A15_slide2 {
		width:70%;
		height:100%;
		border:thick solid brown;
		padding:5px;
		background-color:#5e4000;
	}
	#A15_slide2 img {
		margin:0px;
	}
	#A15_slide3 {
		width:80%;
	}
</style>
