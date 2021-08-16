---
layout: post
title:  "[JavaScript] "
subtitle:   ""
date: 2021-08-15 02:45:51 +0900
categories: javascript
tags: study
comments: true
---

* * *
<h1>1️⃣ 자바스크립트로 이미지 로딩하기</h1>

* 이전에 **html의 요소들**을 **자바스크립트**에서 불러온 것을 배운적이 있습니다.
* 이번에는 반대로 **자바스크립트**에서 **html**에 **노드**를 만드는 **기능**을 써보겠습니다.
* `append()`메소드를 이용하면 <rd>부모노드</rd>에 <b style="color:red">자식노드</b>혹은 **문자**들을 추가해줄 수 있습니다. `appendChild()`메소드를 이용하면 오직 <b style="color:red">자식노드 한개</b>만을 추가해줄 수 있습니다.

```javascript
document.body.appendChild(sampleNode); //body에 생성
```

* * *
<h2 style="color:#0e435c;">(1) 이미지(img)태그 노드 생성</h2>

```javascript
const adImage = document.createElement("img");
adImage.src = `이미지 주소`;
```

* `document`개체의 `createElement()`메소드로 <b style="color:blue">img(이미지)</b>노드를 생성 합니다.
* <b style="color:blue">생성한 img태그</b>에 `.src`요소를 지정해줄 수 있습니다.

* * *
<h2 style="color:#0e435c;">(2) 링크(a)태그 노드 생성</h2>

```javascript
const adlink = document.createElement("a");
adlink.href = "웹 주소";
adlink.innerText = "표시해줄 링크문자"
```
<br><br>

* * *
<h1>2️⃣ 시계만들기</h1>

<span id="clock">00:00:00</span><br>

<script>
	const clock = document.querySelector("span#clock");

	function getClock() {
		const date = new Date();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");
		clock.innerText = `${hours}:${minutes}:${seconds}`;
	}
	setInterval(getClock, 1000);
</script>
<style>
	#clock {
		color:#b87100;
		font-size:300%;
		background-color:#2e271c;;
		margin:10px;
		border-radius: 20px;
		border-style: double;
		border-color: #695028;
		border-width: thick;
	}
</style>

<div id="A15_slide1">
</div>

<script>
	const address = document.querySelector("#A15_slide1");
	const images = ["0.jpeg", "1.jpeg", "2.jpeg"];
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
	setInterval(randomImg, 3000);
	address.appendChild(adImage);
</script>
