---
layout: post
title:  "[C]strncpy & strlcpy"
subtitle:   ""
date: 2021-02-05 11:45:51 +0900
categories: c
tags: string
comments: true
---

**strncpy함수**와 **strlcpy함수** 모두 문자열(dst)에 원하는 길이만큼 소스(src)를 복사하는 함수입니다.<br />

* * *
<h2>1️⃣ 함수원형</h2>
<h4 align="middle">&#60; strncpy &#62;</h4>
```c
char *strncpy(char *dst, const char *src, size_t len)
```
<h4 align="middle">&#60; strlcpy &#62;</h4>
```c
size_t strlcpy(char *dst, const char *src, size_t len)
```
* * *
<h2>2️⃣ 헤더파일, 반환값</h2>
* **반환값** : 
    * **strncpy**: 복사된 문자열(char*)
    * **strlcpy**: src문자열의 길이(size_t)

* **헤더파일** : &lt;string.h&gt;

* * *
<h2>3️⃣ 함수구현</h2>
<h4 align="middle">&#60; strncpy &#62;</h4>
```c
char* strncpy(char *dst, const char *src, size_t len)
{
    char *temp;

    temp = dst;
    while (len-- > 0 && *src != '\0')
        *temp++ = *src++;
    if (len-- > 0)
        *temp++ = '\0';
    return (dst);
}
```
<h4 align="middle">&#60; strlcpy &#62;</h4>
```c
size_t strlcpy(char *dst, const char *src, size_t len)
{
    size_t src_len;
    size_t i;

    i = 0;
    while (src[src_len])
        src_len++;
    while (i < src_len && i < len - 1)
    {
        dst[i] = src[i];
        i++;
    }
    if (len > 0)
        dest[i] = '\0';
    return (src_len);
}
```
* * *
<h2>4️⃣ 특징 &amp; 주의사항</h2>

||strncpy|strlcpy|
|:--:|:--:|:--:|
|**반환값**|복사된 문자열|src(복사할문자열)의 길이|
|**끝처리**|src가 len보다 짧거나 <br />같으면 남은 자리를 '\0'으로 체워줌|len의 크기가 0보다 클경우<br />끝의 한자리만 '\0'으로 채워줌|
|**src > len일 경우**|NULL문자('\0')를 붙일 곳이 없음<br />따라서 안붙여줌|len의길이가 0보다 크기만하면 <br />끝자리에 무조건 NULL문자를 붙여준다.|

* strncpy함수 같은경우 src가 len의 길이보다 크게되면 문자열 끝에 '\0'문자를 붙여주지 않기 때문에 위험해질 수 있습니다.<br />그래서 다음과 같은 코드와 같이 사용된다고 합니다.
```c
strncpy(dest, src, DEST_LEN);  /* DEST_LEN: 6 */
dest[DEST_LEN - 1] = '\0';     /* 추가된 코드 */
```
* strlcpy함수 같은 경우 위의 strncpy의 단점을 보완한 상태로 조금 더 안전한 함수입니다. <br />운영체제나 콘솔프로그램에 따라 &#60;string.h&#62; 헤더에 정의되어 있지 않을 경우 직접 구현해서 사용하던가 strncpy함수에 위와같은 코드를 추가해서 사용하면될 것 같습니다.

* 자료형이 size_t인 len의 값이 **음수**가 되면 버퍼오버플로우(size_t는 unsigned형으로 선언되어 있기 때문)가 일어납니다. 컴파일러에 따라서 경고메시지를 출력해주기도 합니다. 대부분 컴파일러에서 abort오류가 일어납니다.