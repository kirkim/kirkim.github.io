---
layout: post
title:  "[C]strchr & strrchr"
subtitle:   ""
date: 2021-02-04 12:45:51 +0900
categories: c
tags: string
comments: true
---

**strchr**함수는 문자열에서 찾고자하는 문자를 앞에서부터 찾는 함수입니다.
**strrchr**함수는 문자열에서 찾고자하는 문자를 뒤에서부터 찾는 함수입니다.

* * *
<h3>1. 함수원형</h3>
<h4 align="middle">&#60;strchr&#62;</h4>
```c
char *strchr(const char *str, int character);
```
<h4 align="middle">&#60;strrchr&#62;</h4>
```c
char *strrchr(const char *s, int character);
```
* * *
<h3>2. 헤더파일, 반환값</h3>
<br />
* **반환값** :
    * 문자를 찾았을시 그 문자위치의 주소값을 가진 문자열 포인터(char*)
    * 문자를 못찾을시 0 반환

* **헤더파일** : \<string.h\>

* * *
<h3>3. 함수구현</h3>
<h4 align="middle">&#60;strchr&#62;</h4>
```c
char *strchr(const char *str, int character)
{
    while (*str != character)
    {
        if (*str == '\0')
            return (0);
        str++;
    }
    return ((char *)str);
}
```
<h4 align="middle">&#60;strrchr&#62;</h4>
```c
char *strrchr(const char *s, int character)
{
	size_t	s_len;

	s_len = strlen(s);
	while (s_len != 0 && s[s_len] != character)
		s_len--;
	if (s[slen] == character)
		return ((char *)(s + s_len));
	return (0);
}
```
* * *
<h3>4. 특징 & 주의사항</h3>
* 찾아야할 문자가 여러개라면 첫번째로 찾은 문자만을 찾아줍니다.
* const char형식으로 문자열을 받아오지만 그 문자열을 char형으로 반환합니다. 그렇기 때문에 굳이 const를 사용해서 인자를 받아올 필요가 있을까하는 생각이 듭니다.