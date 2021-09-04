---
layout: post
title: "[JavaScript] 개체지향으로 todo리스트 리펙토링하기"
subtitle: ""
date: 2021-09-03 02:45:51 +0900
categories: javascript
tags: study
comments: true
---

<h1>1️⃣ 목표</h1>
<kline></kline>

- 이전에 구현한 <b class="green">todo리스트</b>를 <b class="blue">class(클래스)</b>로 **리펙토링**할 예정입니다.
- 기존에 **자바스크립트**에서는 <b class="blue">function(함수)</b>를 선언해주는 방식으로 <b class="brown">개체지향</b>의 형식으로 만들어 줄 수 있습니다.
- 뿐만아니라 <b class="purple">Java</b>언어와 비슷하게 <b class="blue">class</b>를 이용해서 구현할 수 있습니다. 기능은 <b class="purple">Java</b>보다 못하지만 나름 유용하게 사용이 가능합니다. <b style="font-size:85%">(추상화, private캡슐화 등등..의 기능이 JS에서는 사용불가)</b>
- 아래의 영상을 참고하면 객체지향을 **function** vs **class**로 비교해서 알아볼 수 있습니다.

👉🏻👉🏻👉🏻<a href="https://www.youtube.com/watch?v=OpvtD7ELMQo" target="blank">자바스크립트 클래스(Class)강의 - <b style="font-size:90%">코딩앙마</b></a>

<kline></kline>

- 이렇게 <b class="brown">개체지향</b>의 형식으로 구현하고자 하는 이유는 <b class="green">다양한기능이 들어간 페이지</b>를 구현하는데 있어서 <b class="blue">각각의 기능끼리 코드를 분류</b>하고 싶었기 때문입니다.
- 또한 **객체지향 클래스**의 본래 기능대로 다음과 같이 여러개의 <b class="green">개체 인스턴스</b>를 만들어줄 수있도록 구현할 예정입니다.

<img src="/assets/img/js/todo_class/1.png" width="80%" alt="todo_instance" />

<h1 class="ksubject">2️⃣ constructor(생성자)</h1>
<h2 class="ksubsubject">(1) todo폼 html형식</h2>

- <b class="blue">todo폼</b>의 html형식은 **다음과 같이** <b class="green">"입력"</b>과 <b class="green">"출력"</b>부분의 노드도 포함하고 있어야합니다.

<img src="/assets/img/js/todo_class/2.png" width="100%" alt="todo_html1" />

- 하지만 <b class="brown">개체지향</b>의 <b class="blue">"캡슐화"</b>를 생각한다면 어떤식으로 **노드**가 구성되어 있는지 모르게 해야한다고 생각했습니다.
- 또한 반드시 저런 형식으로 <rd>노드를 설계</rd>해야하므로 조금이라도 다르게 작성하면 <rd>에러</rd>가 발생할 것입니다.
- 다음과 같이 <b class="red">&lt;form&gt;태그</b>만을 이용하여 만들어 주면 <b class="green">todo리스트</b>가 생성되도록 만들어 주고 싶었습니다.

<img src="/assets/img/js/todo_class/3.png" width="80%" alt="todo_html2" />

- 간단하게 <b class="red">innerHTML</b>을 이용하여 <b class="green">js파일에서 노드를 생성</b>하도록 만들어 줬습니다.

<img src="/assets/img/js/todo_class/4.png" width="100%" alt="todo_node_maker_code" />

<kline></kline>

<h2 class="ksubsubject">(2) 생성자 만들기</h2>

- <b class="brown">자바스크립트</b>에서는 <rd>constructor</rd>를 이용하여 생성자를 만들 수 있습니다.
- **생성자**밖에서 <b class="blue">변수선언</b>을 할 필요없이 위와같이 **생성자** 안에서 <rd>this.</rd>를 이용하여 변수를 지정해줄 수 있습니다.
- **생성자**내부에서는 `const` 형식으로 작성할 수 없기 때문에 **사용하는데 주의**할 필요가 있습니다.
- 매크로 혹은 상수화가 필요한 변수의 경우 class밖에 선언하는 식으로 선언이 가능합니다.<b style="font-size:85%">(또한 개체 인스턴스마다 <b class="green">구별할 요소</b>가 아니라면 생성자밖에 선언해주는게 나을 것 같습니다)</b>

<img src="/assets/img/js/todo_class/5.png" width="100%" alt="todo_constructor" />

- **생성자**의 변수로 <b class="green">todo폼의 노드</b>와 단순히 중복을 피하기 위한<b class="green">code</b>를 받습니다.
- <b class="green">code</b>를 이용해 만들어진 <kkr2><b class="orange">this</b>.TODO_KEY</kkr2>는 <b class="blue">"localstorage"</b>에 담길때 <rd>key값</rd>으로 이용할 예정입니다. <b style="font-size:85%">(todo리스트가 여러개 생길 것을 대비하여 key값이 다르게 배정될 수 있도록 만들어야 합니다.)</b>
- <b class="green">이벤트함수</b> 뿐만 아니라 <kkr2><b class="orange">this</b>.<b class="fgreen">makeHtml</b><b class="skyblue">()</b>;</kkr2>와 <kkr2><b class="orange">this</b>.<b class="fgreen">loadData</b><b class="skyblue">()</b>;</kkr2>와 같은 함수들도 **생성자**안에서 실행시켜줄 수 있습니다.

<h1 class="ksubject">3️⃣ 클래스안에 함수만들기</h1>
<h2 class="ksubsubject">(1) 클래스안에서 함수 선언</h2>

- <b class="grren">class(클래스)</b>안에서 함수는 <rd>function</rd>을 붙여줄 필요 없이 다음과 같이 만들어줄 수 있습니다.

<img src="/assets/img/js/todo_class/6.png" width="70%" alt="class_func" />

<kline></kline>

<h2 class="ksubsubject">(2) 클래스정보를 못 읽는 문제발생</h2>
<img src="/assets/img/js/todo_class/9.png" width="100%" alt="error1" />

- <b class="green">handle함수</b>를 사용하려고 했지만 위와 같이 <rd>"정의가 되어있지 않다"</rd>는 에러가 발생했습니다.
- 위와 같은 에러가 나는 부분은 <b class="org">this.</b>가 붙은 **클래스 변수**와 **클래스 함수**들이 였습니다.

<img src="/assets/img/js/todo_class/7.png" width="70%" alt="terror2" />

- <b class="blue">console출력</b>을 해보았을 때 역시 **undefined**가 출력되었습니다.

<img src="/assets/img/js/todo_class/8.png" width="100%" alt="error3" />

<kline></kline>

<h2 class="ksubsubject">(3) 문제해결</h2>

- 다음과 같이 <b class="green">이벤트함수 내부</b>에서 호출할 때 함수를 호출해주도록 작성했습니다.

<img src="/assets/img/js/todo_class/10.png" width="90%" alt="correct1" />

- 위의 `(2)`에서 **출력**값을 보면 알듯이 <b class="blue">event</b>에 대한 정보는 전달 되었지만 <rd>class</rd>에 대한 정보는 전달이 되지 않았습니다. <b style="font-size:85%">(이벤트함수내부에서 함수호출시 파라미터가 겹칠때 단순히 함수명만 적는 방식에서 문제가 생김)</b>
<h3>&lt;해결방법1&gt;</h3>

- 이것은 다음과 같이 <b class="green">callback함수</b>형식으로 작성해주면 **해결할 수 있습니다.**

<img src="/assets/img/js/todo_class/11.png" width="100%" alt="correct2" />
<h3>&lt;해결방법2&gt;</h3>

- **또다른 방법**도 있는데 <b class="green">이벤트함수</b>는 기존과 같이 작성하고 함수 선언부분만 다음과 같이 바꾸는 것 입니다.

<img src="/assets/img/js/todo_class/12.png" width="70%" alt="correct3" />

- 위와같은 방법은 **유튜버** <b class="purple">엘리(드림코딩)</b>님께서 **현업에서 만든 방법**으로 유용하게 사용했다고 합니다.

🍄 <a href="https://www.youtube.com/channel/UC_4u-bXaba7yrRz_6x6kb_w" target="blank"> 드림코딩 by 엘리 <b style="font-size:85%">유튜브 채널</b></a> 🍄<br>
🍄 <a href="https://academy.dream-coding.com/" target="blank"> 드림코딩 사이트</a> 🍄<br>

<h1 class="ksubject">4️⃣ javascript파일 분류하기</h1>

<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 파일분류 &gt;</h4>
        <img src="/assets/img/js/todo_class/18.png" width="100%" alt="file" />
    </div>
    <div class="explain-right" style="padding-top:1%">
		<h4 align="middle" style="color:#0e435c;">&lt; todo.js &gt;</h4>
        <img src="/assets/img/js/todo_class/20.png" width="100%" alt="todo.js" />
        <h4 align="middle" style="color:#0e435c;">&lt; page.js &gt;</h4>
        <img src="/assets/img/js/todo_class/19.png" width="100%" alt="page.js" />
    </div>
</div>

- <b class="blue">class</b>앞에 <rd>"export default"</rd>를 붙이면 다른 **js파일**에서 <rd>"import"</rd>로 **파일**을 불러올 수 있습니다.

<h1 class="ksubject">5️⃣ 최종 결과물</h1>
<h2 class="ksubsubject">(1) 결과물</h2>

<h3 align="middle" class="red">&lt;html&gt;</h3>
<img src="/assets/img/js/todo_class/13.png" width="70%" alt="use todoClass html" />

<h3 align="middle" class="yellow">&lt;javascript&gt;</h3>
<img src="/assets/img/js/todo_class/14.png" width="70%" alt="use todoClass js" />

<h3 align="middle" class="green">&lt;결과물&gt;</h3>
<img src="/assets/img/js/todo_class/15.png" width="70%" alt="use todoClass js" />

- 위와같이 <b class="green">간단한 방법</b>으로 <b class="blue">todo폼</b>을 **여러개** 만들어줄 수 있습니다.

<kline></kline>

<h2 class="ksubsubject">(2) localstorage값 확인</h2>

- <b class="green">각각의 폼</b>들이 **독립적**으로 <b class="blue">"local storage"</b>에 저장되는지 확인해봤습니다.

<h3 align="middle" class="ksubsubject">&lt;다음과 같이 입력&gt;</h3>
<img src="/assets/img/js/todo_class/16.png" width="70%" alt="use todoClass js" />

<h3 align="middle" class="ksubsubject">&lt;localstorage값&gt;</h3>
<img src="/assets/img/js/todo_class/17.png" width="90%" alt="use todoClass js" />

- **각각의 todo리스트**별로 <b class="green">독릭적</b>으로 잘 저장됨을 확인할 수 있습니다.
