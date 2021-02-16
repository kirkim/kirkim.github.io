---
layout: post
title:  "[C]printf와 sprintf & scanf와 sscanf"
subtitle:   ""
date: 2021-02-16 02:45:51 +0900
categories: c
tags: inout
comments: true
---

* **printf함수**는 데이터를 stdout(콘솔출력)으로 형식에 맞추어 출력하는 함수입니다.
* **sprintf함수**는 데이터를 str(문자열 버퍼)에 형식에 맞추어 쓰는 함수입니다.

* * *
<h3>1. 함수원형</h3>
<h4 align="middle">&#60; printf &#62;</h4>
```c
int printf(const char* restrict format, ...);
```
<h4 align="middle">&#60; sprintf &#62;</h4>
```c
int sprintf(char* restrict dst, const char* restrict format, ...);
```

* * *
<h3>2. 헤더파일, 반환값</h3>
* **헤더파일**: \<stdio.h\>
* **반환값**:
  ||성공|실패|
  |:--:|:--:|:--:|
  |printf|출력된문자 수(NULL문자 포함)|음수|
  |sprintf|쓰여진 문자개수(NULL문자 미포함)|음수|
  

* * *
<h3>3. 함수사용</h3>

* * *

<h3>5. 코드예시(특이케이스)</h3>

<h5>1.&#60; sprintf함수로 int형정수 문자형정수로 변환하기 &#62;</h5>
```c
int main(void)
{
	int num = 1234;
	char result[5];

	sprintf(result, "%d", num);     

	printf("%s\n", result);         // "1234"로 정상 출력
	printf("%s\n", (int)1234);      // 컴파일오류
}
```
