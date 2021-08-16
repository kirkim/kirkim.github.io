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
<h1>1️⃣ 폼(form)이란?</h1>

<div id="A15_slide">

</div>

<script>
	const address = document.querySelector("#A15_slide");
	const images = ["0.jpeg", "2.jpeg", "3.jpeg"];
	const chosenImage = images[Math.floor(Math.random() * images.length)];
	const adImage = document.createElement("img");
	adImage.src = `https://kirkim.github.io/assets/img/js/delay_application/${chosenImage}`;

	address.appendChild(adImage);
</script>
