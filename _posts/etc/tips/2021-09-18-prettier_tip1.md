---
layout: post
title: "[vscode]자바스크립트에 Prettier 자동포멧이 적용안될때 해결방법"
subtitle: ""
date: 2021-09-18 02:45:51 +0900
categories: etc
tags: tips
comments: true
---

최근에 <b class="purple">prettier</b>을 사용하는데 **자동저장**기능이 작동하지않았습니다.

- macOs: <kbd>cmd⌘</kbd> + <kbd>,</kbd>
- Windows, Linux: <kbd>Ctrl</kbd> + <kbd>,</kbd>
  키를 눌러 설정창을 들어간 뒤 <span class="green">Editor:<b>Format On Save</b></span>를 **체크**해주시면 됩니다.
  <img src="/assets/img/etc/tips/prettier/1.png" width="100%" alt="solution1">
  <br>
  <kline></kline>
  저같은 경우 위와같이 설정했는데도 <b class="blue">css</b>에만 **자동포멧**이 적용되고 <b class="green">html</b>, <b class="green">javascript</b>에는 **적용이 안되는 현상**을 겪었습니다.

<img src="/assets/img/etc/tips/prettier/2.png" width="100%" alt="solution2">

위처럼 <span class="green">Editor:<b>Default Formatter</b></span>를 <b class="purple">Prettier</b>로 적용하여 **기본 포메터**로 설정해 주시면 됩니다.
