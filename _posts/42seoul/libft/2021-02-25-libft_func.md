---
layout: post
title:  "[libft](2)내장함수 구현"
subtitle:   ""
date: 2021-02-25 02:45:51 +0900
categories: 42seoul
tags: libft
comments: true
---

이번 포스트는 **libft**에 내장할 string함수중에서도 **메모리할당**이 필요한 함수들에 관한 내용입니다.

* * *
<h2> 내부적으로 메모리할당을 해주는 함수 </h2>
* C언어에 내장된 문자열관련함수들의 대부분은 내부적으로 **동적할당**을 해주지 않습니다.
* **동적할당**을 하게되면 반드시 `free함수`를 통해서 메모리해제를 해줘야하는데 본인이 구현하지않은 **함수**는 **문서**를 자세히 보지않는 이상 **동적할당**이 되어 있는지 안되어 있는지 알 방법이 없습니다**(결국 실수로 메모리헤제를 하지 않을 가능성이 큽니다.)**
* 그렇다고 외부함수에서 선언된 변수를 동적할당을 하지않고 반환하여 사용하게 된다면 **댕글링 포인터(dangling pointer)**가 일어나기 때문에 위험합니다.
* 결과적으로 **동적할당이 필요한 외부함수**의 경우 직접 구현해서 사용하는 것이 좋습니다.
* 이번포스트에서는 **libft**라이브러리 내장함수들 중 이렇게 직접구현이 필요한 함수
들에 대해 다뤄볼 예정입니다.

* * *
<h2>1️⃣ stdup </h2>
* **strdup함수**는 **문자열**을 새로운 메모리를 할당하여 그곳에 복사하는 함수입니다.
<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
char *ft_strdup(const char *str)
{
	size_t	str_len;
	char	*result;

	str_len = ft_strlen(str);      //직접구현한 길이계산함수를 이용
	if (!(result = (char *)malloc(sizeof(char) * (str_len + 1))))
		return (0);                //할당실패시 0을 반환
	while (*str != '\0')
		*result++ = *str++;
	*result = '\0';
	return (result - str_len);     //result의 시작주소 반환
}
```

* * *
<h2>2️⃣ strjoin </h2>
* **strjoin함수**는 두개의 문자열을 불여 새로운 메모리를 할당한 곳에 복사하는 함수입니다.
<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
char *ft_strjoin(char const *s1, char const *s2)
{
	size_t	len1;
	size_t	len2;
	char	*result;

	if (s1 == NULL || s2 == NULL) //상황에 따라서 이러한 오류처리는 안해도 됩니다.
		return (0);
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
**memcpy**에 대한 내용은 <a href="https://kirkim.github.io/c/2021/02/08/memcpy.html" target="blank">( memcpy함수 )</a>에 자세히 나와있습니다.

* * *
<h2>3️⃣ substr </h2>
* **substr함수**는 **문자열**의 **원하는 곳**부터 **원하는 길이**만큼을 새로운 메모리를 할당한 곳에 복사하는 함수입니다.
<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
char *ft_substr(char const *str, unsigned int start, size_t len)
{
	char	*result;
	size_t	s_len;
	size_t	i;

	if (str == NULL)  //상황에 따라서 이런식의 오류처리를 안해도됩니다
		return (0);
	s_len = ft_strlen(str);
	if (s_len < start)  //유효한 문자열이 없는 곳을 복사할때 '\0'한개만을 포함한 메모리를 반환
		return (ft_strdup(""));
	if (!(result = (char *)malloc(sizeof(char) * (len + 1))))
		return (0);
	i = 0;
	while (i < len && i < s_len - start)
	{
		result[i] = str[start + i];
		i++;
	}  //포인터복사가 빠르지만 가독성의 이유로 이번엔 배열복사로 구현했습니다
	result[i] = '\0';
	return (result);
}
```

* * *
<h2>4️⃣ strtrim </h2>
* **strtrim**함수는 **문자열**의 앞뒤에 **지정한 문자들(set)**을 **제거**하는 함수입니다.
<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
char *ft_strtrim(char const *s1, char const *set)
{
	size_t	start;
	size_t	end;
	char	*result;

	start = 0;
	if (s1 == NULL || set == NULL) //상황에 따라서 이런식의 오류처리는 안해도됩니다
		return (0);
	end = ft_strlen(s1); //end값을 문자열 끝(=문자열길이)으로 잡습니다.
	while (s1[start] && ft_strchr(set, s1[start])) //set문자가 아닐때까지 start값을 증가
		start++;
	while (end && s1[end - 1] && ft_strchr(set, s1[end - 1])) //set문자가 아닐때까지 end값을 감소
		end--;
	if (start > end)  // start > end라는 것은 유효한 문자열이 없다는 뜻입니다
		return (ft_strdup("")); // '\0'문자한개만 가진 메모리로 반환
	result = ft_substr(s1, start, end - start); //위에서구한 start, end값으로 원하는 문자열복사
	return (result);
}
```

* * *
<h2>5️⃣ split </h2>
* **split**는 **문자열**을 **지정 문자**로 구분하고 **토큰화**하여 새롭게 할당된 메모리에 이차원배열의 형식으로 복사하는 함수입니다.
<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
/* 토큰화시킨 문자열(단어)의 갯수를 구하는 함수*/
static size_t ft_cntword(const char *str, char c)
{
	size_t	cnt;
	size_t	flag;

	cnt = 0;
	flag = 0;
	while (*str != '\0')
	{
		if (*str != c && flag == 0)
		{
			flag = 1;
			cnt++;
		}
		else if (*str == c)
			flag = 0;
        str++;
	}
	return (cnt);
}

/* 현재토큰문자의 길이를 구하는 함수 */
static size_t ft_wordlen(char const *s, char c)
{
	size_t len;

	len = 0;
	while (*s != '\0' && *s != c)
    {
		len++;
        s++;
    }
	return (len);
}

/* strdup함수에 길이수(num)인자를 포함시킨 함수 */
static char *ft_strndup(const char *s, size_t num)
{
	char	*word;
    char    *temp;

	if (!(word = (char *)malloc(sizeof(char) * (num + 1))))
		return (0);
    temp = word;
	while (num-- > 0)
        *temp++ = *s++;
	*temp = '\0';
	return (word);
}

/* 2차원배열의 동적메모리를 해제하는 함수 */
static void ft_free_str(char **s, int i)
{
	while (i--)
    {
		free(s[i]);
        s[i] = NULL;
    }
	free(s);
    s = NULL;
}

char **ft_split(char const *s, char c)
{
	size_t	nb;
	size_t	wordlen;
	size_t	cnt;
	char	**result;

    if (s == NULL) //상황에 따라서 이런식의 오류처리는 안해도 됩니다.
		return (0);
	cnt = ft_cntword(s, c); //토큰화시킬 단어의수를 구한다.(이차원배열 메모리할당을 위해)
	if (!(result = (char **)malloc(sizeof(char *) * (cnt + 1))))
		return (0);
	nb = 0; //nb를 cnt(토큰화할 단어의 수)를 비교해가면서 이차원배열에 복사
	while (nb < cnt)
	{
		while (*s != '\0' && *s == c) //구분문자(c)를 스킵
			s++;
		wordlen = ft_wordlen(s, c); //현재 토큰화할 문자의 길이 지정
		if (!(result[nb] = ft_strndup(s, wordlen))) //현재 토큰문자 복사
		{
			ft_free_str(result, nb - 1); //실패시 이차원으로 동적할당된 것을 해제
			return (0);
		}
		s += wordlen;
		nb++;
	}
    /* split함수를 사용하는 입장에서 토큰화할 단어수를 알 수 없기 때문에 아랫줄처럼 
    NULL포인터로 마지막 토큰문자열임을 알려주는 NULL포인터를 만들어 주는 것이 좋습니다*/
	result[cnt] = NULL;
	return (result);
}
```

* * *
<br /><br />
<h2><span style="color:#084B8A;">이전포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/23/libft_header.html" target="blank"> [libft](1)헤더파일 만들기</a></h2>
<h2><span style="color:#084B8A;">다음포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/24/libft_list_func.html" target="blank"> [libft](3)리스트 함수</a></h2>