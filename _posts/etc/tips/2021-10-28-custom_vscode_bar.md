---
layout: post
title: "[vscode] vscode타이틀바 색깔 커스텀하기"
subtitle: ""
date: 2021-10-28 02:45:51 +0900
categories: etc
tags: tips
comments: true
---

- 여러개의 작업환경(vscode창)을 켜놓고 작업하다보면 어떤창이였는지 햇갈릴때가 있습니다.
- 다음과 같이 각각의 작업환경마다 <b class="green">타이틀바</b>의 색깔을 다르게 하면 좀 더 편하게 작업할 수 있을 것 입니다.

<img src="/assets/img/etc/tips/titlebar/1.png">

<kline></kline>

먼저 vscode의 옵션창을 들어갑니다.

- **macOs**: <kbd>cmd⌘</kbd> + <kbd>,</kbd><br>
- **Windows, Linux**: <kbd>Ctrl</kbd> + <kbd>,</kbd><br>

이 작업환경(workbench)에서만 적용할 것이기 때문에 <b class="green">작업 영역</b>슬롯을 눌러주고, <b class="brown">settings.jason에 편집</b>을 눌러줍니다.

<img src="/assets/img/etc/tips/titlebar/4.png">

<kline></kline>

다음과 같이 작성해주면 됩니다.

<img src="/assets/img/etc/tips/titlebar/5.png">

- <b class="org">titleBar.activeBackground</b>: 활성화 됐을시 타이틀바 색깔
- <b class="org">titleBar.inactiveBackground</b>: 비활성화 됐을시 타이틀바 색깔

<kline></kline>

다음과 같이 <b class="green">활성화</b>시 화면을 <b class="green">밝게</b>, <b class="brown">비활성화</b>시 <b class="brown">어두운</b>색깔로 지정하면 좀 더 효율적으로 사용할 수 있을 것 같습니다.

<h3 align="middle" style="color:#0e435c;">&lt; 오른쪽화면 활성화 &gt;</h3>
<img src="/assets/img/etc/tips/titlebar/2.png">

<h3 align="middle" style="color:#0e435c;">&lt; 왼쪽화면 활성화 &gt;</h3>
<img src="/assets/img/etc/tips/titlebar/3.png">
