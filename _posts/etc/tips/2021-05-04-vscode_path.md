---
layout: post
title:  "[vscode]Mac(M1), include path문제[<SDL2/SDL.h>,homebrew]"
subtitle:   ""
date: 2021-05-04 02:45:51 +0900
categories: etc
tags: tips
comments: true
---

* * *
<h2>1️⃣ #include 오류문제</h2>

* 최근에 <b>M1기반 맥북</b>을 샀는데 아직도 환경설정문제는 적응이 안됩니다..
* `<SDL2/SDL.h>`헤더파일을 이용하고 싶은데 다음과 같이 경로를 찾을 수 없는 오류가 발생했습니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath1.png" alt="includepath_error1" width="100%" style="margin-top:3%">

* 분명 <rd>SDL2</rd>파일을 <rd>homebrew</rd>를 이용해서 설치해 줬고 <b>homebrew의 경로설정</rd>도 다했는데..
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath2.png" alt="includepath_error2" width="100%" style="margin-top:3%">

* 이처럼 `SDL.h`헤더를 가진 <re>SDL2</re>폴더도 있는 것도 확인했습니다..

* * *
<h2>2️⃣ 해결법</h2>

* 다음과 같이 include경로에 <rd>homebrew의 헤더파일 경로</rd>를 적어줬습니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath3.png" alt="soulution_error1" width="100%" style="margin-top:3%">

* `json`파일이 보이지 않는다면 다음과 같은 방법으로도 추가할 수 있습니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath4.png" alt="soulution_error2" width="100%" style="margin-top:3%">
<img src="https://kirkim.github.io/assets/img/etc/tips/vspath5.png" alt="soulution_error2" width="100%" style="margin-top:3%">

* 다른 좋은 방법도 있겠지만 저처럼 삽질을 하는사람이 있을까봐 포스트를 작성하게 됐습니다.