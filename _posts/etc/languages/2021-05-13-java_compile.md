---
layout: post
title: '[Java] 커맨드로 컴파일하기(cannot find symbol문제 해결하기)'
subtitle: ''
date: 2021-05-13 02:45:51 +0900
categories: etc
tags: languages
comments: true
---

---

<h1>1️⃣ java 컴파일(커맨드 이용)</h1>
<h2 style="color:#0e435c;">(1) 파일 한개 컴파일</h2>
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

- 패키지내부(first.second)에서 컴파일을 진행하였습니다.
- `java 파일(.java)`로 정상적으로 `hello!`가 출력되었습니다.

---

<h2 style="color:#0e435c;">(2) 메인파일 두개 컴파일</h2>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:10%">
        <h4 align="middle" style="color:#0e435c;">&lt; main.java와 test.java위치 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile4.png" width="70%"    alt="compile1">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; main.java코드내용 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile2.png" width="90%" alt="compile2">
        <h4 align="middle" style="color:#0e435c;">&lt; test.java코드내용 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile5.png" width="90%" alt="compile5">
    </div>
</div>

- 기존의 `main.java`파일과 같은 위치에 `test.java`파일을 만들었습니다.
- 자바프로그램을 컴파일하기 위해서는 다음과 같은 `main메소드`가 필요합니다.(없을시에 컴파일 오류)

  ```java
  public static void main(String[] argc) {
      /* 코드생략 */
  }
  ```

- 그렇다면 `main메소드`를 각각 포함한 파일 두개를 동시에 컴파일하면 어떻게 될까요?
- 위처럼 `main메소드`를 포함한 `test.java`파일을 만들었습니다.
  <img src="https://kirkim.github.io/assets/img/java/compile/compile6.png" width="80%" alt="compile6">

- 결과적으로 먼저 작성된 파일의 `main메소드`만을 컴파일했으며 컴파일오류가 일어나지 않았습니다.
  <br /><br />

---

<h1>2️⃣ 서로연관된 파일 컴파일하는 법(커맨드 사용)</h1>
<h2 style="color:#0e435c;">(1) 테스트용 파일 세팅</h2>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; main.java코드내용 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile7.png" alt="compile7">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; test.java코드내용 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile8.png" alt="compile8">
    </div>
</div>

- `main.java`파일과 `test.java`파일은 `first.second`페키지에 위치하고 있습니다.
- `main.java`파일에서 `test.java`파일에 위치한 **메소드**를 사용하기 위해서는 `import first.second.test`를 이용해서 어디서 가져온 **메소드**인지 가르쳐줘야 합니다.
- 하지만 <rd>같은 페키지에 위치한 파일일 경우</rd> 자동으로 `import`를 해주기 때문에 작성할 필요가 없습니다.

---

<h2 style="color:#0e435c;">(2) 테스트용 파일 컴파일</h2>

- <b>C언어</b>에서는 `헤더파일(.h)`안에 파일간에 공유한 함수를 선언해주었습니다.
- 자바는 `import`가 그런역할을 할 것으로 기대하고 단순한 방식으로 컴파일을 진행해보았습니다.
<h3 style="color:#0e435c;">[1] 오류케이스1</h3>

- `main.java`파일과 `test.java`파일 두개를 `java`명령어를 이용하여 동시에 컴파일해보았습니다.
- 하지만 심볼을 찾지못해서 컴파일이 되지않았습니다.
<img src="https://kirkim.github.io/assets/img/java/compile/compile9.png" width="90%" alt="compile9">
<h3 style="color:#0e435c;">[2] 오류케이스2</h3>

- `import`는 페키지명을 포함하여 되어있는데 페키지안에서 컴파일 했기때문에 위치를 못찾은 것이 원인이지 않을까하고 생각이 들었습니다.
- 최상위페키지폴더 `first`가 위치한 곳에서 다시 컴파일을 진행하였습니다.
- 하지만 여전히 심볼을 찾지 못하였습니다.
  <img src="https://kirkim.github.io/assets/img/java/compile/compile10.png" alt="compile10">

---

<h2 style="color:#0e435c;">(3) 올바르게 컴파일하기</h2>

- 파일이 한개를 단독으로 컴파일할때는 `java`명령어 하나로도 가능했습니다. 하지만 **패키지를 연동하여 사용하는 여러파일**을 컴파일할때는 오류가 났습니다.
- 사실 `java`는 실행 명령어입니다. **C언어**의 **gcc**와 같은 컴파일러를 사용하는 <rd>자바컴파일러 명령어</rd>는 `javac`명령어 입니다.
- `javac`명령어를 사용하여 컴파일을 성공하면 `.class파일`(바이트코드)을 생성해 줍니다.<b style="font-size:90%">(C언어의 object파일(.o)와 비슷하지만 **class파일**은 **기계어**가아닌 <rd>바이트코드</rd>로 이루어져 있습니다.)</b>
- `-d`옵션을 사용하여 생성위치의 **디렉토리**를 설정할 수 있고 생략할경우 `.java`파일과 동일한 위치에 생성이 됩니다.
- 그렇다면 위의 테스트파일을 올바르게 컴파일 해보겠습니다.
<img src="https://kirkim.github.io/assets/img/java/compile/compile11.png" alt="compile11">
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 생성된 .class파일 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile12.png" alt="compile12">
    </div>
    <div class="explain-right" style="padding-top:20%">
        * .java파일이 위치한 곳에 정상적으로 .class파일들이 각각 생성되었습니다.
    </div>
</div>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 클래스폴더에서 컴파일진행 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile13.png" alt="compile13">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 외부에서 컴파일진행 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile14.png" alt="compile14">
    </div>
</div>

- `-classpath 클래스파일위치`를 지정해주어야하지만 **클래스폴더**에서 컴파일을 진행하면 생략할 수 있습니다.(`-cp`로도 사용가능)
- class파일의 확장명 `.class`는 생략하여 작성해야 합니다.
- 하지만 <rd>패키지 내부에서 컴파일을 할경우</rd>에도 다음과 같이 `-classpath`로 위치를 정확히 지정해주어야합니다. <b style="font-size:90%">(패키지개념을 처음접한입장에서 경로를 설정하는 것이 익숙하지 않았습니다)
  <img src="https://kirkim.github.io/assets/img/java/compile/compile15.png" alt="compile15">

- `import`는 `.java`파일을 참고하지않습니다. 그렇기 때문에 참고할 `test.class`파일이 없다면 `test.java`파일이 있더라도 다음과 같이 실행이 안됩니다.
  <img src="https://kirkim.github.io/assets/img/java/compile/compile16.png" alt="compile16">
  <br /><br />

---

<h1>3️⃣ 깔끔하게 파일 정리하기</h1>

- <b><rd>클래스파일</rd></b>은 클래스파일끼리 <rd>소스파일</rd>은 소스파일끼리 묶어두는 것이 깔끔합니다.
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 클래스폴더에서 컴파일진행 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/java/compile/compile17.png" alt="compile17">
        <b><rd>'-d'</rd></b>옵션을 사용하여 class폴더를 지정해주면 <b>패키지까지</b> 자동으로 생성하여 클래스파일을 생성해 줍니다.
    </div>
    <div class="explain-right" style="padding-top:1%">
        <img src="https://kirkim.github.io/assets/img/java/compile/compile18.png" alt="compile18">
    </div>
</div>
