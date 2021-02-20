---
layout: post
title:  "[C]strcmp &amp; strncmp"
subtitle:   ""
date: 2021-02-06 11:45:51 +0900
categories: c
tags: string
comments: true
---

**strcmp함수**는 두문자열을 비교하는 함수입니다.<br />
**strncmp함수**는 두문자열을 원하는 길이까지만 비교하는 함수입니다.

* * *
<h2>1. 함수원형</h2>
<h4 align="middle">&#60; strcmp &#62;</h4>
```c
int strcmp(const char* str1, const char* str2)
```
<h4 align="middle">&#60; strncmp &#62;</h4>
```c
int strncmp(const char* str1, const char* str2, size_t len)
```
* * *
<h2>2. 헤더파일, 반환값</h2>
* **반환값**:

    |조건|반환값(size_t)|
    |:--:|:--:|
    |**str1 > str2**|1 or 양수|
    |**str1 == str2**|0|
    |**str1 < str2**|-1 or 음수|

* **헤더파일**: \<string.h\>

* * *
<h2>3. 함수구현</h2>
<h4 align="left">&#60; strcmp &#62;</h4>
```c
int strcmp(const char* str1, const char* str2)
{
    while (*str1 != '\0' && *str1 == *str2)
    {
        str1++;
        str2++;
    }
    return (*str1 - *str2);
}
```
___
<h4 align="left">&#60; strncmp &#62;</h4>
```c
int strncmp(const char* str1, const char* str2, size_t len)
{
    size_t i;

    i = 1;
    while (*str1 != '\0' && *str1 == *str2 && i < len)
    {
        str1++;
        str2++;
        i++;
    }
    return (*str1 - *str2);
}
```
* * *
<h2>4. 특징 & 주의사항</h2>

* 자료형이 size_t인 len의 값이 **음수**가 되면 버퍼오버플로우(size_t는 unsigned형으로 선언되어 있기 때문)가 일어납니다. 컴파일러에 따라서 경고메시지를 출력해주기도 합니다. 하지만 대부분의 컴파일러에서 오버플로우난 상태로 함수가 실행됩니다. 결국 음수값의 len값을 가진 strncmp함수는 strcmp함수와 같게 됩니다.