---
layout: post
title:  "[Python]Jupyter Notebook"
subtitle:   ""
date: 2021-03-27 03:45:51 +0900
categories: python
tags: jupyternotebook
comments: true
---

이번 포스트는 **Jupyter notebook**에 관한 내용입니다.

* * *
<h2>1️⃣ Jupyter Notebook특징</h2>

* **주피터 노트북**에서 **파이썬 커널**을 생성하면 `.ipynb`의 확장자명으로 생성됩니다.
* `.ipynb`는 **ipython**의 약자로 2001년 '페르난도 페레즈'가 대화형 방식의 분석 및 개발을 목적으로 개발한 것 입니다.
* 코딩결과를 한칸한칸 실시간으로 확인이 가능하고 Web의 접근이 가능한 장점이 있습니다.

<h3 style="color:#0e435c;">(1) 동작방식</h3>

* 다른 콘솔프로그램들은 코드들이 위에서부터 순차적으로 실행이 되지만 **주피터 노트북**에서는 **각각의 칸(cells)**들이 독립적으로 동작합니다.
* 하지만 **각각의 독립된 코드**들은 `Ctrl + Enter`키로 실행시킴과 동시에 **코드의 순번**이 매겨지게 됩니다.<b style="font-size:90%"> (순번이 낮을 수록 먼저 실행된다는 뜻)</b>
* 독립적인 칸들은 왼쪽의 `In [ ]`의 괄호안의 숫자가 순번을 의미합니다.
<h4 align="middle" style="color:#0e435c;">&lt; 실행되지않은 cell은 무시 &gt;</h4>
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupy_char2.png" alt="jupyter_character" width="100%">
<h4 align="middle" style="color:#0e435c;">&lt; 줄의 순서와 관계없이 실행순서로 적용 &gt;</h4>
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupy_char3.png" alt="jupyter_character" width="100%">

* * *
<h3 style="color:#0e435c;">(2) 마크다운 기능</h3>

* 중간중간 **마크다운**기능을 이용할 수 있습니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupy_char0.png" alt="jupyter_character" width="100%">

* * *
<h3 style="color:#0e435c;">(3) 좀 더 가시적인 출력</h3>

* **데이터 사이언스**에 많이 사용되는 툴이다보니 좀 더 가시적으로 출력해줍니다.
* `print`함수의 이용없이 소스가담긴 **변수**명을 직접 입력해주면 **주피터 노트북**방식으로 출력해줍니다.
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupy_char1.png" alt="jupyter_character" width="100%">
