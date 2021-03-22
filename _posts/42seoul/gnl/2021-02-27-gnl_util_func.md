---
layout: post
title:  "[getnextline](2)Util함수 구현"
subtitle:   ""
date: 2021-02-27 03:45:51 +0900
categories: 42seoul
tags: get_next_line
comments: true
---

이번 포스트는 **get_next_line**프로그램에 필요한 함수들에 대한 내용입니다.

* * *
<h2>1️⃣ 유틸함수</h2>
* **get_next_line**함수는 기본적으로 `<unistd.h>`헤더파일에 선언된 **저수준입출력함수**를 이용하여 구현할 예정입니다.<br />**저수준입출력함수**에 관한 내용은 (1)<a href="https://kirkim.github.io/c/2021/02/18/lowfildefunc(1).html" target="blank"> open,close함수</a>, (2)<a href="https://kirkim.github.io/c/2021/02/20/lowfildefunc(2).html" target="blank"> read,write,lseek함수</a>을 참고하시면 됩니다.
* 그외에 필요한 함수들은 따로 `get_next_line_utils.c`파일에 구현하여 사용할 예정입니다.
<h4 align="left">&#60; 추가적으로 필요한 함수 &#62;</h4>
1. 문자열의 길이를 새어주는 함수(strlen)
2. 메모리를 복사해주는 함수(memcpy)
3. 기존문자열에 새로운문자열을 붙여 새로 할당한 메모리에 복사하는 함수(strjoin)
4. 문자열을 원하는 길이만큼 새로 할당한 메모리에 복사하는 함수(strndup)

* * *
<h2>2️⃣ 함수 구현</h2>
<h3 align="left">1. &#60; ft_strlen &#62;</h3>
<a href="https://kirkim.github.io/c/2021/02/04/strlen.html" target="blank"> strlen함수</a>포스트를 참고하시면 됩니다.

```c
size_t ft_strlen(const char *str)
{
	size_t	len;

	len = 0;
	while (*str != '\0')
	{
		str++;
		len++;
	}
	return (len);
}
```

<h3 align="left">2. &#60; ft_memcpy &#62;</h3>
<a href="https://kirkim.github.io/c/2021/02/08/memcpy.html" target="blank"> memcpy함수</a>포스트를 참고하시면 됩니다.
```c
void *ft_memcpy(void *dst, const void *src, size_t size)
{
	unsigned char       *dp;
	const unsigned char *sp;

	dp = dst;
	sp = src;
	if (dp == NULL && sp == NULL)
		return (0);
	while (size-- > 0)
		*dp++ = *sp++;
	return (dst);
}
```

<h3 align="left">3. &#60; ft_strjoin &#62;</h3>

```c
char *ft_strjoin(char const *s1, char const *s2)
{
	size_t	len1;
	size_t	len2;
	char	*result;

	len1 = ft_strlen(s1);
	len2 = ft_strlen(s2);
	if (!(result = (char *)malloc(sizeof(char) * (len1 + len2 + 1))))
		return (0);
	ft_memcpy(result, s1, len1);
	ft_memcpy(result + len1, s2, len2);
	result[len1 + len2] = '\0';
	return (result);
}
```

<h3 align="left">4. &#60; ft_strndup &#62;</h3>

```c
char *ft_strndup(const char *str, ssize_t offst)
{
	char	*result;
	ssize_t	cnt;

	cnt = 0;
	if (!(result = (char *)malloc(sizeof(char) * (offst + 1))))
		return (0);
	while (*str != '\0' && cnt < offst)
	{
		*result++ = *str++;
		cnt++;
	}
	*result = '\0';
	return (result - cnt);
}
```

* * *
<br /><br />
<h2><span style="color:#084B8A;">이전포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/26/gnl_header.html" target="blank"> [getnextline](1)헤더파일 만들기</a></h2>
<h2><span style="color:#084B8A;">다음포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/26/gnl_func.html" target="blank"> [getnextline](3)본함수 구현</a></h2>