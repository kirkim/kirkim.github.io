---
layout: post
title:  "[JavaScript]블로그(jekyll)에 나만의 JavaScript 추가해보기"
subtitle:   ""
date: 2021-08-11 02:45:51 +0900
categories: javascript
tags: etc
comments: true
---

* * *
<h1>1️⃣ JavaScript코드 위치?</h1>

* **html, css, javascript** 모두 절차지향언어이다. 그렇다면 <b style="color:blue">동작(Javascript)</b>을 정의하는 것이 먼저일까 <b style="color:#dd1144">틀(html)</b>을 잡는 것이 먼저일까 의문이 들었습니다.
* **Javascript**를 사용하는 대표적인 방법으로 특정`id`나 `class`를 이용하는 방법이 있습니다.
* **Javascript**는 `document`오브젝트에 접근하여 `html, css`의 요소에 접근할 수 있습니다. 이를 이용하여 특정 `id`와 `class`에 접근할 수 있습니다.
* 먼저 다음과 같이 적용할 내용보다 <rd>먼저 js코드가 오도록</rd>하였습니다.

<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; js코드가 먼저 오도록 작성&gt;</h4>
        <img src="https://kirkim.github.io/assets/img/js/js1.png" alt="front_script" width="85%">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; console 출력값&gt;</h4>
        <img src="https://kirkim.github.io/assets/img/js/js2.png" alt="result_console" width="85%">
    </div>
</div>
<br>

* **js코드**가 `id="hi"`를 찾기 못했습니다.
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; js코드가 나중에 오도록 작성&gt;</h4>
        <img src="https://kirkim.github.io/assets/img/js/js3.png" alt="front_script" width="85%">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; console 출력값&gt;</h4>
        <img src="https://kirkim.github.io/assets/img/js/js4.png" alt="result_console" width="85%">
    </div>
</div>
<br>

* 이번에는 **js코드**가 정상적으로 `id="hi"`를 찾았습니다.
* 즉, <b style="color:green">블로그 포스트</b>에 적용할 <b style="color:blue">js파일</b>의 위치는 `<body>`태그안에서 <rd>후 순위</rd>에 배치시켜야 합니다.
<br><br>

* * *
<h1>2️⃣ js파일 위치시키기</h1>

* **Jekyll**블로그도 종류가 여러가지가 있습니다. 그렇기 때문에 **각각의 파일의 설계**가 다를 수도 있습니다.
* 우선 **제가 사용하는 Jekyll**블로그의 경우 `body`부분만 **따로**구성된 파일이 있습니다.
<img src="https://kirkim.github.io/assets/img/js/js5.png" alt="body.html" width="85%">

* 위처럼 `body.html`파일이 처음보는 사람들도 어떤식으로 구성되어 있는지 알 수 있도록 **잘 정리되어** 있었습니다.
* `body.html`파일안에서도 **세부적인 부분**으로 나눠서 분류해준 모습입니다.
* <b><rd>제일 하단</rd></b>의 코드를 보면 `scripts.html`파일에 **body**부분에 필요한 `js파일 링크`들을 모아뒀음을 알 수 있습니다.
<img src="https://kirkim.github.io/assets/img/js/js6.png" alt="scripts.html" width="85%">

* `scripts.html`파일 제일 하단에 **나만의 js파일**의 **링크**를 적어주었습니다.
<br><br>

* * *
<h1>3️⃣ 적용 확인하기</h1>

* 이제 잘 적용되는지 확인할 차례입니다.
* **나만의 자바스크립트파일**인 `my.js`를 다음과 같이 작성해 주었습니다.
<img src="https://kirkim.github.io/assets/img/js/js7.png" alt="my_js_file" width="85%">

* **포스트**에 다음과 같이 실험용 코드를 작성해 주었습니다.

```html
<h2 class="kk">클릭</h2>
```
<img src="https://kirkim.github.io/assets/img/js/js8.png" alt="click" width="85%">

* 위처럼 정상적으로 **JavaScript코드**가 적용됐음을 확인할 수 있습니다.
<h2 class="kk" align="middle" style="background-color:yellow;">클릭</h2>

<script>
	const aaa = document.querySelector("h2.kk");

	function handleTitleClick() {
		alert("Don't touch me!");
	}
	aaa.addEventListener("click", handleTitleClick);
</script>