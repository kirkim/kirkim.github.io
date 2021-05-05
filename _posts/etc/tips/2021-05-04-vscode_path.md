---
layout: post
title:  "[vscode]Mac(M1), include path문제(&lt;SDL2/SDL.h&gt;,homebrew)"
subtitle:   ""
date: 2021-05-04 02:45:51 +0900
categories: etc
tags: tips
comments: true
---

* * *
<h2>1️⃣ #include 오류문제</h2>

* 최근에 <b>M1기반 맥북</b>을 샀는데 아직도 환경설정문제는 적응이 안되는 것 같습니다.
* 이번엔 `<SDL2/SDL.h>`헤더파일을 이용하고 싶은데 다음과 같이 경로를 찾을 수 없는 오류가 발생했습니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath1.png" alt="includepath_error1" width="100%" style="margin-top:3%">

* 분명 <rd>SDL2</rd>파일을 <rd>homebrew</rd>를 이용해서 설치해 줬고 <rd>homebrew의 경로설정</rd>도 다했는데..
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath2.png" alt="includepath_error2" width="100%" style="margin-top:3%">

* 이처럼 `SDL.h`헤더를 가진 <re>SDL2</re>폴더도 있는데 vscode는 왜 못찾을까?
<br /><br />

* * *
<h2>2️⃣ includePath 오류 해결법</h2>

* 맥린이 입장에서는 <rd>homebrew로 파일을 설치</rd>하면 알아서 컴파일러에 헤더파일경로를 추가해준다고 착각한 것이 문제였습니다. (어쩌면 있을수도있지만 찾지는 못했습니다)
* 다음과 같이 <rd>.json파일</rd>의 include경로에 <rd>homebrew의 헤더파일 경로</rd>를 적어줬습니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath3.png" alt="soulution_error1" width="100%" style="margin-top:3%">

* `json`파일이 보이지 않는다면 다음과 같은 방법으로도 경로를 추가할 수 있습니다. (노란전구 클릭)
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath4.png" alt="soulution_error2" width="100%" style="margin-top:3%">
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath5.png" alt="soulution_error3" width="100%" style="margin-top:3%">

* 다음과 같이 정상적으로 헤더파일(SDL.h)을 읽어서 함수(SDL내장)의 설명이 정상적으로 출력됨을 볼 수 있습니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath6.png" alt="soulution_error4" width="100%" style="margin-top:3%">
<br /><br />

* * *
<h2>3️⃣ 컴파일하기</h2>

* 위의처럼 Vscode에 경로를 가르쳐줘도 <b>컴파일을 할때는<b> <rd>또다시 컴파일러에게 경로를 가르쳐줘야 합니다.</rd>
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath7.png" alt="soulution_error4" width="100%" style="margin-top:3%">

* 다음과 같은 컴파일 옵션을 추가해주어 경로를 가르쳐줘야 합니다.<b style="font-size:90%">(homebrew의 경우 위치는 /opt/homebrew폴더안에서 잘 찾아보면 됩니다.)</b>
    <img src="https://kirkim.github.io/assets/img/etc/tips/vspath8.png" alt="soulution_error4" width="100%" style="margin-top:3%">

    * `-I`: include할 헤더파일의 주소
    * `-L`: 라이브러리를 찾을 디렉토리
    * `-l`: 컴파일할때 링크할 라이브러리이름
