---
layout: post
title:  "[C]strtok & split"
subtitle:   ""
date: 2021-02-13 11:45:51 +0900
categories: c
tags: etc
comments: true 
---

* **strtok함수**는 구분문자를 경계로 문자열을 토큰화하는 함수입니다..

* * *
<h2>1️⃣ 함수원형</h2>
<h4 align="middle">&#60; split &#62;</h4>
```c
char *strtok(char *str, const char *delim)
```

* * *
<h2>2️⃣ 헤더파일, 반환값</h2>
* **헤더파일**: &lt;string.h&gt;
* **반환값**: 토큰화된 문자열, NULL(더이상 토큰이 없을 시)

* * *
<h2>3️⃣ 함수사용</h2>
```c
int main(void)
{
	char str[] = "Hello,my name is kirim..!Bye!";
	char *ptr;
	ptr = strtok(str, " .,!");
    int cnt;

    cnt = 1;
	while (ptr != NULL)
	{
		printf("%d: %s\n", cnt, ptr);
		ptr = strtok(NULL, " .,!");
        cnt++;
	}
    printf("%d: %s\n", cnt, ptr);
	return (0);
}
/*---출력---*/
1: Hello
2: my
3: name
4: is
5: kirim
6: Bye
7: (null)
```

![strtok_img](https://kirkim.github.io/assets/img/c/strtok_img.jpg)
* 처음 strtok함수를 호출시 문자열(str)을 넣어야 됩니다.
* 그 다음부터 strtok함수는 프로그램 종료시까지 그 다음 토큰의 위치를 기억하고 있게 됩니다.
* 문자열(str)의 다음 토큰을 구하려면 NULL을 넣어주면됩니다.
* 더 이상 토큰화할 문자가 없으면 NULL을 반환합니다.

* * *
<h2>4️⃣ 특징 &amp; 주의사항</h2>
1. strtok함수는 다른 C언어 문자열 내장함수들처럼 새로운 메모리를 할당하지 않습니다.
2. 그렇기 때문에 토큰화에 쓰이는 문자열(str)은 어쩔 수 없이 바뀌게 됩니다.<br />(원본을 지키고 싶으면 사본을 만든 뒤 strtok함수를 호출해야 합니다.)
3. 원본문자열을 수정하지 않고 각각의 토큰문자열을 이차원배열의 형식으로 저장하고 싶다면 `split`함수를 직접구현해야서 사용하면 됩니다. <br />**(아래 split함수 구현)**

* * *
<h2>5️⃣ 코드예시(split함수 구현)</h2>
<br />
<h4 align="middle">&#60; split &#62;</h4>
```c
/* 토큰문자열 갯수를 구하는 함수*/
static size_t k_cntword(const char *s, char c)
{
	size_t	cnt;
	size_t	flag;

	cnt = 0;
	flag = 0;
	while (*s != NULL)
	{
		if (*s != c && flag == 0)
		{
			flag = 1;
			cnt++;
		}
		else if (*s == c)
			flag = 0;
		s++;
	}
	return (cnt);
}

/* 각토큰문자열의 길이를 구하는 함수*/
static size_t k_wordlen(char const *s, char c)
{
	size_t len;

	len = 0;
	while (s[len] && s[len] != c)
		len++;
	return (len);
}

/* 토큰문자열 한개를 새로운 메모리에 복사하는 함수 */
static char *k_strndup(const char *s, size_t num)
{
	char	*word;

	if (!(word = (char *)malloc(sizeof(char) * (num + 1))))
		return (0);
	while (num-- > 0)
		*word++ = *s++;

	*word = '\0';
	return (word);
}

/* 이차원배열의 메모리를 해제하는 함수 */
static void k_free_str(char **s, int i)
{
	while (i-- > 0)
	{
		free(s[i]);
		s[i] = NULL;
	}
	free(s);
	s = NULL;
}

/* split 본 함수 */
char **split(char const *str, char c)
{
	size_t	nb;
	size_t	wordlen;
	size_t	cnt;
	char    **result;

	cnt = k_cntword(str, c);
	if (!(result = (char **)malloc(sizeof(char *) * (cnt + 1))))
		return (0);
	nb = 0;
	while (nb < cnt)
	{
		while (*str && *str == c)
			str++;
		wordlen = k_wordlen(str, c);
		if (!(result[nb] = k_strndup(str, wordlen)))
		{
			k_free_str(result, nb);
			return (0);
		}
		str += wordlen;
		nb++;
	}
	result[cnt] = 0;
	return (result);
}
```

* split함수는 C언어에 내장된 함수가 아니기 때문에 직접 구현해서 사용해야 합니다.
* 위의 코드는 제가만든 split함수일뿐 자신만의 스타일로 만들어서 사용하면 됩니다.<br />**(※항상 유효한 값이 들어온다고 가정하고 작성한 코드입니다.)**<br />(※문자열 구분문자를 한개만 지정할 수 있는 함수)**
* split함수는 2차원메모리를 할당하는 함수이므로 반드시 메모리 해제를 잊지않고 해야됩니다.
<h4 align="middle">&#60; split함수 사용시 꼭 메모리 해제 &#62;</h4>
```c
char word[] = "Hello, my name is kirim!";
char **result;

result = split(word, " ");
/*
코드 생략
*/
while (i-- > 0)      // i는 토큰화된 문자 갯수
{
	result(s[i]);
	result[i] = NULL;
}
free(result);
result = NULL;
```
