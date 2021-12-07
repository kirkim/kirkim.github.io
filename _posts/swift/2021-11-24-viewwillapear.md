---
layout: post
title: '[swift] present, dismiss를 이용한 페이지 전환에서 viewWillAppear메서드가 호출이 안되는 문제 해결하기'
subtitle: ''
date: 2021-11-16 02:45:51 +0900
categories: swift
tags: etc
comments: true
---

<h1>1️⃣ 문제</h1>

- <details>
    <summary style="cursor:pointer;"><b>[펼치기]</b> 왜 viewWillAppear메서드를 썼을까</summary>
    <div style="padding-left:30px; background-color:gray; font-size:90%;">
      ✹ 먼저 <b class="blue">페이지1</b>에서 <b class="purple">페이지2</b>를 열 수있으며 <b class="purple">페이지2</b>에서 입력한 값을 <b class="blue">페이지1</b>에 전달하는 상황이라고 칩시다.<br>
      ✹ <b class="purple">페이지2</b>에서 <b>입력값</b>을 받고 <b class="blue">페이지1</b>에 전달해줄때, 입력 후 <b class="blue">페이지1</b>의 새로운 인스턴트를 생성해서 여는 것은 매우 비효율적입니다. 대신에 <b class="purple">페이지2</b>를 없애고(메모리 해제) <b class="blue">페이지1</b>를 다시 노출하는 방법을 이용합니다.<br>
      ✹ 이 때 <b class="purple">페이지2</b>에서 새로 입력해준 값으로 <b class="blue">페이지1</b>의 프로퍼티를 업데이트 시켜주고 싶지만 <b>viewdidload메서드</b>는 처음에 로드될 때만 호출이 되기 때문에 <b class="blue">페이지1</b>에 되돌아가는 상황에서는 호출이 되지않습니다.<br>
      ✹ 그 대신에 <b class="green">viewWillAppear메서드</b>는 <b>페이지가 노출</b>이 될때마다 호출이 되기 때문에 잘 이용하면 <b class="blue">페이지1</b>의 <b>프로퍼티</b>를 업데이트 시켜줄 수 있습니다.
    </div>
  </details>

- 하지만 present, dismiss를 이용한 페이지 전환에서 viewWillAppear메서드가 호출이 안되는 문제가 생겼습니다.
- 문제를 보기위해 다음과 같이 **2개**의 페이지로 이루어진 예시를 보겠습니다.
- 두개의 페이지는 각각 `present`와 `dismiss`를 이용하여 페이지를 열고 닫습니다.

<img src="/assets/img/swift/viewwillapear/1.png" width="90%" alt="viewController code">
<img src="/assets/img/swift/viewwillapear/2.png" width="90%" alt="secondviewController code">

- 두번째 페이지에서 <b class="blue">뒤로가기</b>버튼을 눌러 **첫번째 페이지**로 되돌아가는데, 만약 <b class="green">viewWillAppear메서드</b>가 호출된다면 **첫번째 페이지**의 제목이 <b class="brown">"두번째 페이지에서 입력한 값"</b>으로 바뀔 것 입니다.
- 아래 **움짤**을 보면 **첫번째 페이지**의 제목이 바뀌지 않습니다.
- 즉, <b class="green">viewWillAppear메서드</b>가 호출되지 않았습니다.

<img src="/assets/img/swift/viewwillapear/no_fullscreen.gif" width="30%" alt="no_fullscreen">

- **애플 공식문서**에서는 다음과 같이 말하고 있습니다. <span style="font-size:90%">(대충 `present`로 페이지를 팝업하고 `dismiss`로 헤제시 뷰컨트롤러에서 호출되지 않는다라는 내용)</span>

<h4 align="middle">&lt; <a href="https://developer.apple.com/documentation/uikit/uiviewcontroller/1621510-viewwillappear" target="blank">애플공식문서 - viewWillAppear</a> &gt;</h4>
<img src="/assets/img/swift/viewwillapear/3.png" alt="apple_document_viewwillapear">

<h1 class="ksubject">2️⃣ 해결방법</h1>
<h2 class="ksubsubject">(1) fullscreen 이용</h2>

- 21년 기준 `present`메소드는 기본적으로 **페이지**를 <b class="blue">팝업</b>의 형태로 열립니다.
- 다음과 같이 스타일을 바꿔주면 <b class="blue">풀스크린(fullscreen)</b>으로 페이지가 열립니다.

<img src="/assets/img/swift/viewwillapear/4.png" width="90%" alt="modify code for fullscreen">

- <b class="blue">풀스크린</b>상태에서는 <b class="green">viewWillAppear메서드</b>가 정상적으로 호출이 됨을 볼 수 있습니다.

<img src="/assets/img/swift/viewwillapear/fullscreen.gif" width="30%" alt="fullscreen">

- <b class="brown">노출 -&gt; 비노출 -&gt; 노출</b> 의 상태변화가 일어나는 순간 <b class="green">viewWillAppear메서드</b>가 호출됩니다.
- <b><rd>팝업형태</rd></b>로 **두번째페이지**를 열면 **첫번째 페이지**의 테두리 부분이 약간 노출되어 있는데, 이러한 작은노출도 페이지가 보여지고 있는 것으로 유지되기 때문에 **상태변화**가 일어나지 않고 <b class="green">viewWillAppear메서드</b>가 호출되지 않는 것 같습니다.
- 대신에 <b><rd>풀스크린</rd></b>으로 **첫번째 페이지**를 완전히 가려주면 **비노출**로 상태가 변하기 때문에 다시 **첫번째 페이지**를 보여줬을 때 <b class="green">viewWillAppear메서드</b>가 호출됨을 알 수 있습니다.

<kline></kline>

<h2 class="ksubsubject">(2) Segue 이용시 fullscreen 적용법</h2>

- **Storyboard**에서는 **Segue**를 이용하여 간단하게 페이지 이동을 구현할 수 있습니다.
- 이때는 다음과 같이 직접 설정을 바꿔주면 됩니다.

<img src="/assets/img/swift/viewwillapear/5.png" width="90%" alt="modify code for fullscreen using Segue">

- 여기까지 **풀스크린**으로 만드는 방법으로 viewWillAppear메서드 호출문제를 해결해 봤습니다.
- 언젠가 사용하는 날이 올지 모르겠지만 **팝업된 페이지**에서 입력값을 전달하는 방법도 연구해봐야 겠습니다.
