---
layout: post
title:  "[JavaScript]자바스크립트 기초문법5 - [(지수,n진법)표기법, 숫자형 메소드, Math객체]"
subtitle:   ""
date: 2021-03-30 03:45:51 +0900
categories: javascript
tags: basic
comments: true
---

이번 포스트는 **[(지수,n진법)표기법, 숫자형 메소드, Math객체]**에 관한 내용입니다.

* * *
<h2>1️⃣ 숫자 표기법</h2>
<h3 style="color:#0e435c;">(1) 지수표기법</h3>

* `e`를 이용하면 **10의 거듭제곱**꼴로 나타낼 수 있습니다.

```javascript
let bigNumber = 3e9;
let floatNumber = 3e-5;

console.log(typeof bigNumber);
console.log(bigNumber);
console.log(floatNumber);
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
number<br />
3000000000<br />
0.00003<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(2) n진법</h3>

```javascript
/* 16진법 */
let Hexadecimal1 = 0xff;
let Hexadecimal2 = 0xFF;

/* 8진법 */
let octal = 0o377;

/* 2진법 */
let binary = 0b11111111;

console.log(Hexadecimal1);
console.log(Hexadecimal2);
console.log(octal);
console.log(binary);
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
255<br />
255<br />
255<br />
255<br />
</kkr>
<br /><br />

* * *
<h2>2️⃣ 숫자형 메소드</h2>
<h3 style="color:#0e435c;">(1) toFixed 메소드</h3>

* `toFixed`메소드를 사용하면 소수점자리를 지정해줄 수 있습니다.
* 하지만 `toFixed`메소드를 사용하면 **문자형(string)**이 됩니다. 

```javascript
let Number1 = 3.14;

console.log(Number1.toFixed(6));
console.log(typeof Number1.toFixed(6));
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
3.14<br />
3.140000<br />
string<br />
</kkr>
<h4 align="middle" style="color:#0e435c;">&lt; (문자형 -&gt; 숫자형) 변환방법 2가지 &gt;</h4>

```javascript
let Number1 = 3.14;

console.log(typeof Number1.toFixed(6));
console.log(typeof Number(Number1.toFixed(6)));  // Number()이용
console.log(typeof +Number1.toFixed(6));        // '+' 이용
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
string<br />
number<br />
number<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(2) toString 메소드</h3>

* `toString`메소드를 이용하면 2 ~ 36 범위내의 진수로 바꿔줍니다.
* 결과값은 **문자형**입니다.

```javascript
let Number1 = 255;

console.log(Number1.toString(8));
console.log(Number1.toString(16));
console.log(Number1.toString(2));
console.log(typeof Number1.toString(2));
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
377<br />
ff<br />
11111111<br />
string<br />
</kkr>
<br /><br />

* * *
<h2>3️⃣ Math객체</h2>
<h3 style="color:#0e435c;">(1) 절대값[abs]</h3>

```javascript
console.log(Math.abs(-23));
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
23<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(2) 최대값[max], 최소값[min]</h3>

```javascript
/* 최대값 */
console.log(Math.max(3, 1, -3, 7));

/* 최소값 */
console.log(Math.min(3, 1, -3, 7));
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
7<br />
-3<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(3) 거듭제곱[pow]</h3>

```javascript
console.log(Math.pow(3, 4));
console.log(3**4);
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
81<br />
81<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(4) 제곱근[sqrt]</h3>

```javascript
console.log(Math.sqrt(16));
console.log(Math.sqrt(36));
console.log(Math.sqrt(21));
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
4<br />
6<br />
4.58257569495584<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(5) 반올림[round], 올림[ceil], 내림[floor]</h3>

```javascript
/* 반올림 */
console.log(`--반올림--`)
console.log(Math.round(3.49));
console.log(Math.round(3.5));

/* 올림 */
console.log(`--올림--`)
console.log(Math.ceil(3.39));
console.log(Math.ceil(3.8));

/* 내림 */
console.log(`--내림--`)
console.log(Math.floor(3.39));
console.log(Math.floor(3.8));
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
--반올림--<br />
3<br />
4<br />
--올림--<br />
4<br />
4<br />
--내림--<br />
3<br />
3<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(5) 그 밖의 Math객체 메소드</h3>
<b><span style="color:#084B8A;">그 밖의 메소드 🖛🖛 </span><a href="https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math" target="blank">Mozilla사이트 - Math객체</a></b><br />
<br /><br />

* * *
<h2>4️⃣ 문자형 메소드</h2>

* 몇가지 **배열 메소드(length, indexOf, slice)**는 **문자형**에 사용할 수 있습니다.

```javascript
let tempString = "Hello!";

/* 문자열 길이 */
console.log(`--문자열 길이--`)
console.log(tempString.length);

/* 요소 탐색 */
console.log(`--요소 탐색--`)
console.log(tempString.indexOf('l'));
console.log(tempString.lastIndexOf('l'));

/* 대소문자 변환 */
console.log(`--대소문자 변환--`)
console.log(tempString.toUpperCase());
console.log(tempString.toLowerCase());

/* 양 끝 공백 제거 */
let temptrim2 = "    Hi    ";
console.log(`--양 끝 공백 제거--`)
console.log(temptrim2.trim());

/* 부분 문자열 접근 slice(start, end) */
console.log(`--부분 문자열 접근--`)
console.log(tempString.slice(3));  // index3부터 출력
console.log(tempString.slice(0, 2));  // 2개 출력
console.log(tempString.slice());     // 전부 출력
```
<kkr>
<span style="color: #999988; font-style: italic;">&#47;&#42;-------출력-------&#42;&#47;</span><br />
--문자열 길이--<br />
6<br />
--요소 탐색--<br />
2<br />
3<br />
--대소문자 변환--<br />
HELLO!<br />
hello!<br />
--양 끝 공백 제거--<br />
Hi<br />
--부분 문자열 접근--<br />
lo!<br />
He<br />
Hello!<br />
</kkr>
<br /><br />

* * *
<h2>5️⃣ 참조형 복사하기</h2>

* **배열**그자체를 변수에 선언해주면 **참조형**으로 복사됩니다.

* * *
<h3 style="color:#0e435c;">(1) 참조형으로 복사된 경우</h3>

* 참조형으로 복사된 경우 같은 **배열**혹은 **객체**의 주소를 공유하게 됩니다.
<h4 align="middle" style="color:#0e435c;">&lt; 배열의 경우 &gt;</h4>

```javascript
let array1 = ['a', 'b', 'c', 'd'];
let array2 = array1;

array2[1] = 'z';
console.log(array2);  // [ 'a', 'z', 'c', 'd' ]
console.log(array1);  // [ 'a', 'z', 'c', 'd' ]
```

<h4 align="middle" style="color:#0e435c;">&lt; 객체의 경우 &gt;</h4>

```javascript
let object1 = {
  first: '커피 마시기',
  second: '운동하기'
};

let object2 = object1;
object2.first = '토스트 먹기';
console.log(object2);  // { first: '토스트 먹기', second: '운동하기' }
console.log(object1);  // { first: '토스트 먹기', second: '운동하기' }
```

* * *
<h3 style="color:#0e435c;">(2) for문 이용하여 복사하기(참조형x)</h3>
<h4 align="middle" style="color:#0e435c;">&lt; 배열 복사(단순 for문) &gt;</h4>

```javascript
let array1 = ['a', 'b', 'c', 'd'];
let array2 = [];

for (let i = 0; i < array1.length; i++)
{
  array2[i] = array1[i];
}
array2[1] = 'z';

console.log(array2);  // [ 'a', 'z', 'c', 'd' ]
console.log(array1);  // [ 'a', 'b', 'c', 'd' ]
```

<h4 align="middle" style="color:#0e435c;">&lt; 객체 복사(for in문) &gt;</h4>

```javascript
let object1 = {
  first: '커피 마시기',
  second: '운동하기'
};
let object2 = {};

for (let i in object1)
{
  object2[i] = object1[i];
}
object2.first = '토스트 먹기';

console.log(object2);  // { first: '토스트 먹기', second: '운동하기' }
console.log(object1);  // { first: '커피 마시기', second: '운동하기' }
```

* * *
<h3 style="color:#0e435c;">(3) Object.assign메소드 이용하여 복사하기</h3>

* `Object.assign`메소드를 사용하면 새로운 주소값에 값을 복사해줍니다.
* 첫번째 요소로 **배열**은 `[]`를 **객체**는 `{}`을 사용합니다.
<h4 align="middle" style="color:#0e435c;">&lt; 배열에서 사용 &gt;</h4>

```javascript
let array1 = ['a', 'b', 'c', 'd'];
let array2 = Object.assign([], array1);

array2[1] = 'z';
console.log(array2);  // [ 'a', 'z', 'c', 'd' ]
console.log(array1);  // [ 'a', 'b', 'c', 'd' ]
```

<h4 align="middle" style="color:#0e435c;">&lt; 객체에서 사용 &gt;</h4>

```javascript
let object1 = {
  first: '커피 마시기',
  second: '운동하기'
};

let object2 = Object.assign({}, object1);
object2.first = '토스트 먹기';

console.log(object2);  // { first: '토스트 먹기', second: '운동하기' }
console.log(object1);  // { first: '커피 마시기', second: '운동하기' }
```
<br /><br />

* * *
<h3 align="middle" style="color:#0e435c;">&lt; 자바스크립트[JavaScript] 기초문법 포스트 목차 &gt;</h3>
><b><span style="color:#084B8A;">1.&nbsp;&nbsp;</span><a href="https://kirkim.github.io/javascript/2021/03/24/basic1.html" target="blank">자바스크립트 기초문법1 [변수선언, 기본출력, 기본 규칙]</a></b><br />
><b><span style="color:#084B8A;">2.&nbsp;&nbsp;</span><a href="https://kirkim.github.io/javascript/2021/03/25/basic2.html" target="blank">자바스크립트 기초문법2 [자료형, 연산자, 함수선언, 반복문, 조건문]</a></b><br />
><b><span style="color:#084B8A;">3.&nbsp;&nbsp;</span><a href="https://kirkim.github.io/javascript/2021/03/28/object.html" target="blank">자바스크립트 기초문법3 [객체(objact)]</a></b><br />
><b><span style="color:#084B8A;">4.&nbsp;&nbsp;</span><a href="https://kirkim.github.io/javascript/2021/03/29/array.html" target="blank">자바스크립트 기초문법4 [배열(array)]</a></b><br />
><b><span style="color:#dd1144;">&gt;&gt;&nbsp;</span><a href="https://kirkim.github.io/javascript/2021/03/29/dataTypeAd.html" target="blank">자바스크립트 기초문법5 [(지수,n진법)표기법, 숫자형 메소드, Math객체]</a></b><br />