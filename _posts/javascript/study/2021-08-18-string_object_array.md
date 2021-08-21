---
layout: post
title: "[JavaScript] string, Array 관련함수 연습"
subtitle: ""
date: 2021-08-20 02:45:51 +0900
categories: javascript
tags: study
comments: true
---

<h1>1️⃣ 목표</h1>
<kline></kline>

- <b class="green">string자료형</b>과 <b class="blue">array(배열)</b>관련 함수에 대해 복습

<h1 class="ksubject">2️⃣ String 다루기</h1>
<h2 style="color:#0e435c;">(1) split()</h2>

- <b class="orange">구분자</b>를 인자로 받아 <b class="green">문자</b>를 구분한 것을 <b class="blue">배열</b>로 만들어 **반환**합니다.

```javascript
const animals = "monkey, hen, dog";
const result1 = fruits.split();
const result2 = fruits.split(", ");
```

<kkr>
	<rmk>/* console 출력 */</rmk><br>
	["monkey, hen, dog"] <rmk>// result1</rmk><br>
	(3) ["monkey", "hen", "dog"] <rmk>// result2</rmk><br>
</kkr>

<h1 class="ksubject">3️⃣ Array 다루기</h1>
<h2 style="color:#0e435c;">(1) join()</h2>

- <b class="blue">(array)배열</b>의 모든 요소를 연결해 하나의 <b class="red">문자열</b>로 만들어 **반환**합니다.
- 기본적으로 `,`을 <b class="orange">구분자</b>로 사용하며 <b class="orange">문자열</b>을 인자로 받아 <b class="orange">구분자</b>로 사용이 가능합니다.

```javascript
const animals = ["monkey", "hen", "dog"];
const result1 = animals.join();
const result2 = animals.join(" & ");
```

<kkr>
	<rmk>/* console 출력 */</rmk><br>
	monkey,hen,dog <rmk>// result1</rmk><br>
	monkey & hen & dog <rmk>// result2</rmk><br>
</kkr>

<kline></kline>

<h2 style="color:#0e435c;">(2) reverse()</h2>

- <b class="blue">(array)배열</b>의 요소를 <b class="red">역순</rd>으로 바꿔줍니다.

```javascript
const array = [1, 2, 3, 4, 5];
array.reverse();
```

<kkr>
	<rmk>/* console 출력 */</rmk><br>
	(5) [5, 4, 3, 2, 1] <rmk>// array</rmk><br>
</kkr>

<kline></kline>

<h2 style="color:#0e435c;">(3) Object.assign()</h2>

- <b class="blue">첫번째 인자(배열)</b>에 <b class="green">두번째 인자(배열)</b>의 요소를 복사해서 넣어줍니다.

```javascript
const array = [1, 2, 3, 4, 5];
const array2 = [];
Object.assign(array2, array);
```

<kkr>
	<rmk>/* console 출력 */</rmk><br>
	(5) [5, 4, 3, 2, 1] <rmk>// array</rmk><br>
	(5) [5, 4, 3, 2, 1] <rmk>// array2</rmk><br>
</kkr>

<kline></kline>

<h2 style="color:#0e435c;">(4) 배열자르기</h2>

```javascript
const array = [1, 2, 3, 4, 5];
```

- 위와같은 배열에서 앞의 <rd>2개원소를 제거</rd>하는 방법을 **다음과 같이** <b class="green">3가지 방법</b>로 해결해 보겠습니다.

```javascript
{
  /* shift() */
  function solution1() {
    const array = [1, 2, 3, 4, 5];
    array.shift();
    array.shift();
    console.log(array); // [3, 4, 5]
  }
  /* slice() */
  function solution2() {
    const array = [1, 2, 3, 4, 5];
    const result = array.slice(2);
    console.log(array); // [1, 2, 3, 4, 5]
    console.log(result); // [3, 4, 5]
  }
  /* splice() */
  function solution3() {
    const array = [1, 2, 3, 4, 5];
    const result = array.splice(2, 3, "a");
    console.log(array); // [1, 2, a]
    console.log(result); // [3, 4, 5]
  }
  solution1();
  solution2();
  solution3();
}
```

1. <b class="green">solution1</b>: `shift()`를 이용하면 **배열**의 요소를 앞부분부터 한개씩 빼줍니다. <b style="font-size:85">(원본배열을 변경)</b>
2. <b class="green">solution2</b>: `slice()`를 이용하면 **인자**수만큼 요소를 제거한 **배열**을 반환합니다. <b style="font-size:85">(원본배열은 보존)</b>
3. <b class="green">solution3</b>: `splice()`를 이용하면 **첫번째, 두번째**인자를 이용하여 <b class="red">제거할 요소의 범위</b>를 잡을 수 있고 <b class="blue">그 이후 순번의 인자</b>를 **제거된 요소위치에 순차적으로 채워줍니다.**

<h1 class="ksubject">3️⃣ Object요소 다루기</h1>

- 이번에는 다음과 같이 <b class="blue">class(개체)</b>를 만들어서 다뤄보도록하겠습니다.
- `animals`라는 배열에 **각각의 인스턴스**들을 요소로 사용하기 때문에 결론적으로 <b class="red">배열관련 메소드</b>를 이용하여 다뤄볼 계획입니다.

```javascript
class Animal {
  constructor(species, name, age, canSwim) {
    this.species = species;
    this.name = name;
    this.age = age;
    this.canSwim = canSwim;
  }
}
const animals = [
  new Animal("🐒", "kiki", 3, false),
  new Animal("🐬", "allie", 4, true),
  new Animal("🐓", "kkokko", 1, false),
  new Animal("🦭", "ping", 7, true),
  new Animal("🐠", "lala", 1, true),
];
```

<h2 style="color:#0e435c;">(1) find(), filter()</h2>

- `find()`를 사용하면 **true**를 반환 하는 <b class="red">첫 번재</b>요소를 찾아 반환합니다.

```javascript
const result = animals.find((animal) => animal.age === 1);
```

<img src="https://kirkim.github.io/assets/img/js/arrayfunc/1.png" width="85%" alt="out1">
- 하지만 위의 `animals`배열을 보면 `age === 1`인 요소는 **2개**입니다. `filter()`를 이용하면 <b class="green">조건에 맞는(true를 반환)</b>하는 **모든 요소**를 포함하는 **배열**을 만들어 반환합니다. <b style="font-size:85%">(원본배열을 보존)</b>

```javascript
const result = animals.filter((animal) => animal.age === 1);
```

<img src="https://kirkim.github.io/assets/img/js/arrayfunc/2.png" width="85%" alt="out2">
- 이번엔 **수영이 가능(canSwim)**한 동물들만 <rd>필터링</rd>해봤습니다.

```javascript
const result = animals.filter((animal) => animal.canSwim === true);
```

<img src="https://kirkim.github.io/assets/img/js/arrayfunc/3.png" width="85%" alt="out3">
