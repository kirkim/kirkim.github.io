---
layout: post
title: "[NodeJs] express.json()과 express.urlencoded()의 차이점 알아보기"
subtitle: ""
date: 2021-10-17 02:45:51 +0900
categories: javascript
tags: nodejs
comments: true
---

<h1>1️⃣ 사용이유</h1>
<h2 class="ksubsubject">(1) .json()과 .urlencoded()를 사용하지 않을 때</h2>

- 다음과 같이 <b class="red">"test.html"</b>파일과 <b class="yellow">"backend.js"</b>파일을 만들어 예시를 보여드리겠습니다.
- 아래와 같이 만들어준 **form(폼)**에 **값**을 넣으면 **콘솔창**에 `undefined`를 출력합니다.
- 그렇기 때문에 <b class="blue">클라이언트</b>로 부터 받은 <b class="brown">http 요청 메시지 형식</b>에서 body데이터를 해석하기 위해서 `express.json()`와 `express.urlencoded()`로 처리가 필요합니다.
<h3 align="middle" class="red">&lt; test.html &gt;</h3>
<img src="/assets/img/nodeJs/body_parser/1.png" alt="test.html" width="100%">
<img src="/assets/img/nodeJs/body_parser/3.png" alt="web" width="80%">
<h3 align="middle" class="yellow">&lt; backend.js &gt;</h3>
<img src="/assets/img/nodeJs/body_parser/2.png" alt="backend.js" width="90%">

<kline></kline>

<h2 class="ksubsubject">(2) express.urlencoded()사용</h2>

- 다음과 같이 `express.urlencoded()`미들웨어를 사용하도록 합니다.
  <img src="/assets/img/nodeJs/body_parser/4.png" alt="use urlencoded" width="80%">

- 하지만 다음과 같이 오류가 출력됩니다.
  <img src="/assets/img/nodeJs/body_parser/5.png" alt="error use urlencoded" width="100%">

- 위의 에러를 해결하기 위해서 `extended`옵션을 정의해 줘야 합니다.

  - <b class="purple">extended: false</b>로 옵션을 주면 **NodeJs**에 기본으로 내장된 **querystring**모듈을 사용합니다.
  - <b class="purple">extended: true</b>를 하면 **추가로 설치**가 필요한 **qs모듈**을 사용합니다.
  - 다행히 **qs모듈**은 현재 `express`에 포함되어 자동으로 설치됩니다.
    <img src="/assets/img/nodeJs/body_parser/6.png" alt="qs in express" width="80%">

- **extended**옵션을 정의해주고 **form**을 이용하여 **값**을 제출했습니다.
<h3 align="middle" class="purple">&lt; extended:false 일때 &gt;</h3>
<img src="/assets/img/nodeJs/body_parser/7.png" alt="extended_false1" width="80%">
<img src="/assets/img/nodeJs/body_parser/8.png" alt="extended_false2" width="80%">

<h3 align="middle" class="purple">&lt; extended:true 일때 &gt;</h3>
<img src="/assets/img/nodeJs/body_parser/9.png" alt="extended_true1" width="80%">
<img src="/assets/img/nodeJs/body_parser/10.png" alt="extended_true2" width="80%">

- **qs**모듈을 사용유무에 따라 출력형태가 다르지만 <b class="green">정상적으로 출력</b>됨을 확인할 수 있습니다.

<kline></kline>

<h2 class="ksubsubject">(3) express.json()사용</h2>

- 이번엔 위의 **예시**를 그대로 이용하고 `express.json()`미들웨어를 사용해봤습니다.
- 하지만 **값을 읽어오지 못했습니다.**
  <img src="/assets/img/nodeJs/body_parser/11.png" alt="use express.json1" width="80%">
  <img src="/assets/img/nodeJs/body_parser/12.png" alt="use express.json2" height="50%">

- 원인을 찾기 위해 **form**으로 제출된 **응답(req)**의 `headers`를 확인해 봤습니다.
- **content-type**이 <b class="green">x-www-form-urlencoded</b>임을 확인할 수 있습니다.
  <img src="/assets/img/nodeJs/body_parser/13.png" alt="console out req.headers" width="80%">

- 즉 <b class="org">form(폼)</b>으로 제출되는 값은 <b class="green">x-www-form-urlencoded</b>형태이며 `express.json()`으로는 값을 해석할 수 없습니다.
- 이번엔 <b class="blue">"Postman"</b>프로그램을 이용하여 <rd>JSON</rd>형태로 **POST요청**을 보내봤습니다. <b style="font-size:85%">(Postman을 이용하면 다양한 요청을 쉽게 보낼 수 있음)</b>

<img src="/assets/img/nodeJs/body_parser/14.png" alt="console out req.headers" width="80%">
<img src="/assets/img/nodeJs/body_parser/10.png" alt="console out req.body" width="80%">

<kline></kline>

<h2 class="ksubsubject">(4) 결론</h2>

- `.urlencoded()`은 <b class="green">x-www-form-urlencoded</b>형태의 데이터를
- `.json()`은 <b class="green">JSON</b>형태의 데이터를 해석해줍니다.

<h1 class="ksubject">2️⃣ body-parser 미들웨어</h1>
<h2 class="ksubsubject">(1) 사실 express의 인코딩기능은 body-parser을 이용한 것??</h2>
- 사실 위에서 사용한 `express.urlencoded()`와 `express.json()` 모두 <b class="green">"body-parser"</b>미들웨어를 이용한 것 입니다.
- <b class="green">"body-parser"</b>미들웨어는 현재 <b class="blue">express</b>페키지 안에 포함되어 있음을 확인할 수 있습니다.

<img src="/assets/img/nodeJs/body_parser/15.png" alt="body-parser in express" width="80%">

- 즉, body-parsere을 이용하여 다음과 같이 사용이 가능합니다.

```javascript
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(extended: true);
```

<kline></kline>

<h2 class="ksubsubject">(2) 추가로 해석이 가능한 타입</h2>

- <b class="green">x-www-form-urlencoded</b>, <b class="green">JSON</b> 타입 뿐만아니라 <b class="blue">raw</b>와 <b class="blue">text</b>타입도 인코딩이 가능합니다.

<img src="/assets/img/nodeJs/body_parser/16.png" alt="type that body-parser can encoding" width="80%">
