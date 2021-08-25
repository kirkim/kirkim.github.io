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

<h1 class="ksubject">2️⃣ </h1>
<h2 style="color:#0e435c;">(1) split()</h2>

<style>
	iframe {
		display: block;
		width:100%;
		height:80vh;
	}
</style>

<iframe src="/assets/js_study/paintbrush/paintbrush.html" scrolling="no"></iframe>
