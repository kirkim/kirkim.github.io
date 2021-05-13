---
layout: post
title:  "[Java]"
subtitle:   ""
date: 2021-05-13 02:45:51 +0900
categories: java
tags: basic
comments: true
---

* * *
<h1>1️⃣ java 컴파일(커맨드 이용)</h1>
<h2 align="middle" style="color:#0e435c;">(1) 파일 한개 컴파일</h2>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; main.java위치 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile1.png" width="70%"    alt="compile1">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; main.java코드내용 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile2.png" alt="compile2">
    </div>
</div>
<img src="https://kirkim.github.io/assets/img/java/compile/compile3.png" width="80%" alt="compile3">

* 패키지내부(first.second)에서 컴파일을 진행하였습니다.
* `java 파일(.java)`로 정상적으로 `hello!`가 출력되었습니다.
<h2 align="middle" style="color:#0e435c;">(2) 메인파일 두개 컴파일</h2>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; test.java위치 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile4.png" width="70%"    alt="compile1">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; main.java코드내용 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile2.png" width="90%" alt="compile2">
        <h4 align="middle" style="color:#0e435c;">&lt; test.java코드내용 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile5.png" width="90%" alt="compile5">
    </div>
</div>

* 기존의 `main.java`파일과 같은 위치에 `test.java`파일을 만들었습니다.
* 자바프로그램을 컴파일하기 위해서는 다음과 같은 `main메소드`가 필요합니다.(없을시에 컴파일 오류)

```java
public static void main(String[] argc) {
    /* 코드생략 */
}
```

* 그렇다면 `main메소드`를 각각 포함한 파일 두개를 동시에 컴파일하면 어떻게 될까요?
* 위처럼 `main메소드`를 포함한 test.java`파일을 만들었습니다.
<img src="https://kirkim.github.io/assets/img/java/compile/compile6.png" width="80%" alt="compile6">

* 결과적으로 먼저 작성된 `main메소드`만을 컴파일했으며 컴파일오류가 일어나지 않았습니다.