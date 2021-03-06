---
layout: post
title:  "[깃헙브로그]코드이쁘게 올리기"
subtitle:   ""
date: 2021-04-27 02:45:51 +0900
categories: etc
tags: tips
comments: true
---

* * *
<h1>1️⃣ ColorScripter 이용하기</h1>

* <a href="https://colorscripter.com" target="blank">ColorScripter사이트</a>에 들어갑니다.
* 다음과 같이 원하는 <rd>스타일</rd>과 <rd>언어</rd>로 작성하면 자동으로 <b>html언어</b>로 바꿔줍니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/codeblock1.png" alt="colorscipter1" width="100%" style="margin-top:3%">
<h3 align="middle" style="color:#0e435c;">&lt; html언어로 변경된 모습 &gt;</h3>
<img src="https://kirkim.github.io/assets/img/etc/tips/codeblock2.png" alt="colorscipter2" width="100%" style="margin-top:3%">
이 코드를 그대로 html파일에 <b>복붙</b>을 하면 됩니다.
<h3 align="middle" style="color:#0e435c;">&lt; 실제 출력된 모습 &gt;</h3>
<div class="colorscripter-code" style="color:#010101;font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important; position:relative !important;overflow:auto"><table class="colorscripter-code-table" style="margin:0;padding:0;border:none;background-color:#fafafa;border-radius:4px;" cellspacing="0" cellpadding="0"><tr><td style="padding:6px;border-right:2px solid #e5e5e5"><div style="margin:0;padding:0;word-break:normal;text-align:right;color:#666;font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;line-height:130%"><div style="line-height:130%">1</div><div style="line-height:130%">2</div><div style="line-height:130%">3</div><div style="line-height:130%">4</div><div style="line-height:130%">5</div><div style="line-height:130%">6</div></div></td><td style="padding:6px 0;text-align:left"><div style="margin:0;padding:0;color:#010101;font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;line-height:130%"><div style="padding:0 6px; white-space:pre; line-height:130%"><span style="color:#0086b3">#include</span>&nbsp;<span style="color:#ff3399"></span><span style="color:#a71d5d">&lt;</span>stdio.h<span style="color:#ff3399"></span><span style="color:#a71d5d">&gt;</span></div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;</div><div style="padding:0 6px; white-space:pre; line-height:130%"><span style="color:#066de2">int</span>&nbsp;main(<span style="color:#a71d5d">void</span>)</div><div style="padding:0 6px; white-space:pre; line-height:130%">{</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#066de2">printf</span>(<span style="color:#63a35c">"hello\n"</span>);</div><div style="padding:0 6px; white-space:pre; line-height:130%">}</div></div></td><td style="vertical-align:bottom;padding:0 2px 4px 0"><a href="http://colorscripter.com/info#e" target="_blank" style="text-decoration:none;color:white"><span style="font-size:9px;word-break:normal;background-color:#e5e5e5;color:white;border-radius:10px;padding:1px">cs</span></a></td></tr></table></div>
<br /><br />

* * *
<h1>2️⃣ code-prettify 이용하기</h1>

* <b>구글개발자</b>가 만든 꽤 유명한 <b>코드하이라트</b>입니다.
<a href="https://github.com/googlearchive/code-prettify" target="blank">googlearchive/code-prettify</a>

* 위의 깃헙주소로 들어가면 설명이 잘 되어있지만 그래도 간단하게 사용법을 설명하겠습니다.
<h2 style="color:#0e435c;">(1) head.html에 링크 추가</h2>

* `head.html`혹은 `<haed> </html>`안에 다음의 주소링크를 복붙해줍니다.

```html
<script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>
```

<h2 style="color:#0e435c;">(2) 사용할 언어설정</h2>

* 주소 끝에 `lang=` + `원하는 언어`를 하여 호환할 언어를 설정해줍니다.(&amp;를 이용하여 여러언어 등록가능)
> ex) src="https://.../run_prettify.js?lang=css&amp;lang=c&amp;lang=js"
<h4 align="middle" style="color:#0e435c;">&lt; 호환하는 언어 &gt;</h4>
<img src="https://kirkim.github.io/assets/img/etc/tips/codeblock3.png" alt="language_list" width="80%" style="margin-top:3%">
<h2 style="color:#0e435c;">(3) 코드블럭 스타일 고르기</h2>

* 주소 끝에 `skin=` + `원하는 스타일`를 하여 코드하이라이트의 스타일을 지정할 수 있습니다.
> ex) src="https://.../run_prettify.js?lang=css&amp;lang=c&amp;lang=js&amp;skin=doxy"
<a href="https://raw.githack.com/google/code-prettify/master/styles/index.html" target="blank">SkinGallery</a>에서 적용할 수 있는 코드스타일을 볼 수 있습니다.
<h2 style="color:#0e435c;">(4) 연속되게 번호출력하도록 바꾸기</h2>
* 지원하는 Skin(코드스타일)중에 왼쪽에 표시되는 숫자가 5단위로 출력되는 스타일이 있는데, 번호를 모두 출력하고 싶으면 `head.html`파일에 다음과 같이 코드를 추가해주면 됩니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/codeblock4.png" alt="language_list" width="60%" style="margin-top:3%">
<div class="explain-cover">
    <div class="explain-left">
        <h4 align="middle" style="color:#0e435c;">&lt; 변경 전 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/etc/tips/codeblock5.png" alt="language_list" width="100%" style="margin-top:3%">
    </div>
    <div class="explain-right">
        <h4 align="middle" style="color:#0e435c;">&lt; 변경 후 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/etc/tips/codeblock6.png" alt="language_list" width="100%" style="margin-top:3%">
    </div>
</div>
<h2 style="color:#0e435c;">(5) 사용법</h2>

```html
<pre class="prettyprint linenums lung-c">
/* 코드생략 */
</pre>
```

* `<pre class="prettyprint"></pre>`사이에 출력할 코드를 작성해 주면 됩니다.
* `linenums`는 코드블럭옆에 순번을 출력해줍니다.
* `lung-` + `사용할 언어`로 사용언어를 지정할 수 있습니다.
<h2 style="color:#0e435c;">(6) 사용시 주의사항</h2>

* 다음의 특수문자들은 HTML문자표현방식으로 작성해 줘야 정상적으로 출력됩니다.
    1. <b><rd>&lt;</rd></b>: `&lt;`
    2. <b><rd>&gt;</rd></b>: `&gt;`
    3. <b><rd>&amp;</rd></b>: `&amp;`

* * *
<h1>3️⃣ code-prettify 로딩오류..<b style="font-size:65%">(작성일기준 7일 뒤 추가된 내용)</b></h1>
<h2 style="color:#0e435c;">(1) 사건발생</h2>

* 이글을 작성한 이후의 포스트들에 <b>구글 code-prettify</b>를 적용시켜서 사용했습니다.
* 작성된 포스트를 검토하는 중 다음과 같은 현상을 발견했습니다.
<img src="https://kirkim.github.io/assets/img/etc/tips/codeblock7.png" alt="prettify-code error" width="100%" style="margin-top:3%">

* 다시 <rd>새로고침 버튼</rd>을 누르자 정상적으로 코드블럭이 출력되었습니다.
* 하지만 매번 코드블럭이 들어간 포스트에 <b>새로고침 버튼</b>을 눌러달라고 할 수는 없습니다..
<h2 style="color:#0e435c;">(2) 이유</h2>

* 웹 프로그램에서 자바 스크립트는 굉장히 유용한 도구이지만 <rd>사이트 속도와 로딩을 지연</rd> 시킨다고 합니다.
* 그래서 속도 최적화를 위해서는 <rd>자바 스크립트 사용을 자제</rd>하는게 좋다고 합니다.
<h2 style="color:#0e435c;">(3) 결론</h2>

* 제가 사용하는 <b>지킬 블로그</b>에서는 위와같이 <rd>자바스크립트형태의 코드블럭의 로딩지연</rd>이 나타났기 때문에 기존의 <rd>'Syntax-highlighting Code Block'</rd>사용하기로 했습니다.
* <b><rd>'Syntax-highlighting Code Block'</rd></b>는 프론트 엔드에서 자바 스크립트를 이용해 구현하는 대신 백엔드에서 <rd>php</rd>를 이용하기 때문에 속도가 빠르다고 합니다.
* 하지만 아직도 <b>code-prettify</b>를 사용하는 곳이 많고 자신의 사이트에서 잘 동작한다면 사용해도 무방할 것 같습니다. (일단 제 블로그는 pass..)