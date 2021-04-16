---
layout: post
title:  "[C]strncat & strlcat"
subtitle:   ""
date: 2021-02-06 13:45:51 +0900
categories: c
tags: string
comments: true
---

**strncat함수**는 원하는 길이(len)만큼의 소스(src)를 문자열(dst)에 붙이는 함수입니다.<br />
**strlcat함수**는 소스(src)를 문자열(dst)에 붙여 원하는 길이(len)를 만드는 함수입니다.

* * *
<h2>1️⃣ 함수원형</h2>
<h4 align="middle">&#60; strncat &#62;</h4>
```c
char *strncat(char *dst, const char *src, size_t len)
```
<h4 align="middle">&#60; strlcat &#62;</h4>
```c
size_t strlcat(char *dst, const char *src, size_t len)
```
* * *
<h2>2️⃣ 헤더파일, 반환값</h2>
* **반환값** : 
    * **strncat**: 복사된 문자열(char*)
    * **strlcat**: 

        |조건|반환값(size_t)|
        |:--:|:--:|
        |**len < dst길이**|src길이 + len|
        |**그외**|dst길이 + src길이|

* **헤더파일** : &lt;string.h&gt;

* * *
<h2>3️⃣ 함수구현</h2>
<h4 align="left">&#60; strncat &#62;</h4>
```c
char* strncat(char *dst, const char *src, size_t len)
{
    char *temp;

    temp = dst;
    while (*temp != '\0')
        temp++;
    while (len-- > 0 && *src != '\0')
        *temp++ = *src++;
    *temp = '\0';
    return (dst);
}
```
___
<h4 align="left">&#60; strlcat &#62;</h4>
<h4 align="middle">&#60; strlcat(1) &#62;</h4>
```c
size_t strlcat(char *dst, const char *src, size_t len)
{
    size_t dst_len;
    size_t src_len;

    dst_len = 0;
    src_len = 0;
    while (*dst != '\0')
	{
		dst++;
        dst_len++;
	}
    while (*src != '\0' && dst_len + src_len + 1 < len)
    {
        *dst++ = *src++;
        src_len++;
    }
    while (*src++ != '\0')
        src_len++;
    *dst = '\0';
    if (len <= dst_len)
        return (src_len + len);
    else
        return (src_len + dst_len);
}
```
<h4 align="middle">&#60; strlcat(2)-내장함수사용(strlen) &#62;</h4>
```c
size_t	strlcat(char *dst, const char *src, size_t len)
{
	size_t dst_len;
	size_t src_len;
	size_t i;

	i = 0;
	dst_len = strlen(dst);
	src_len = strlen(src);
	if (len <= dst_len)
		return (src_len + len);
	while (src[i] && dst_len + i + 1 < len)
	{
		dst[dst_len + i] = src[i];
		i++;
	}
	dst[dst_len + i] = '\0';
	return (src_len + dst_len);
}
```
* * *
<h2>4️⃣ 특징 &amp; 주의사항</h2>

||strncat|strlcat|
|:--:|:--:|:--:|
|**반환값**|char*|size_t|
|**len(3번째인자)**|src에서 복사하고싶은 길이('\0'제외)|dst에 src를 덧붙인 총길이('\0'포함)|
|**안전한 len의 최대값**|dst크기 - strlen(dst) - 1|dst의 크기|

* strncat, strlcat함수 모두 문자열(dst)의 크기를 잘 통제하고 그에 맞게 len의 값을 잘 정한다면 strcat함수보다 안전하게 사용할 수 있습니다.
* C11에서는 이보다 더 안전한 strcat_s(),strncat_s()함수가 있습니다.
* 자료형이 size_t인 len의 값이 **음수**가 되면 버퍼오버플로우(size_t는 unsigned형으로 선언되어 있기 때문)가 일어납니다. 컴파일러에 따라서 경고메시지를 출력해주기도 합니다. 하지만 대부분의 컴파일러에서 오버플로우난 상태로 함수가 실행됩니다. 결국 음수값의 len값을 가진 strncat함수는 strcat함수와 같게 됩니다.