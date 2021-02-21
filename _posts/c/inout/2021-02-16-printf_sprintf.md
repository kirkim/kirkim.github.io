---
layout: post
title:  "[C]printf & sprintf"
subtitle:   ""
date: 2021-02-16 02:45:51 +0900
categories: c
tags: inout
comments: true
---

* **printf함수**는 데이터를 stdout(콘솔출력)으로 형식에 맞추어 출력하는 함수입니다.
* **sprintf함수**는 데이터를 str(문자열 버퍼)에 형식에 맞추어 쓰는 함수입니다.

* * *
<h2>1️⃣ 함수원형</h2>
<h4 align="middle">&#60; printf &#62;</h4>
```c
int printf(const char* restrict format, ...);
```
<h4 align="middle">&#60; sprintf &#62;</h4>
```c
int sprintf(char* restrict dst, const char* restrict format, ...);
```

* * *
<h2>2️⃣ 헤더파일, 반환값</h2>
* **헤더파일**: &lt;stdio.h&gt;
* **반환값**:

  ||성공|실패|
  |:--:|:--:|:--:|
  |printf|출력된문자 수(NULL문자 포함)|음수|
  |sprintf|쓰여진 문자개수(NULL문자 미포함)|음수|
  
* * *
<h2>3️⃣ 함수사용</h2>
<h5>&#60; sprintf함수 &#62;</h5>
```c
int main(void)
{
	char getdata[8];
	char string[] = "hello ";
	int num = 3;

	sprintf(getdata, "%s%d", string, num);
	
	printf("getdata: %s\n", getdata);
}
/*---출력---*/
getdata: hello 3
```

* * *
<h2>4️⃣ 특징 & 주의사항</h2>
1. `sprintf`함수는 정말 많이쓰는 함수입니다. 심지어 C++에서 `string`클래스가 있는데도 많이 쓴다고 합니다.<br />(가장 빨리 문자열을 조작하는 함수는 C내장함수)
2. 버퍼의 크기를 충분하게 잡지않으면 버퍼오버플로우의 위험이 있습니다.
3. C99에서 조금 더 안전한 `snprintf함수`가 있습니다.
4. `printf함수`의 경우 stdout(출력스트림)의 형식으로 출력을 합니다.
* * *
<h2>5️⃣ 코드예시(특이케이스)</h2>

<h5>1.&#60; sprintf함수로 int형정수 문자형정수로 변환하기 &#62;</h5>
```c
int main(void)
{
	int num = 1234;
	char result[5];

	sprintf(result, "%d", num);     

	printf("%s\n", result);         // "1234"로 정상 출력
	printf("%s\n", (int)1234);      // 컴파일오류(%s는 int형을 읽지못함을 표시)
}
```
