---
layout: post
title:  "[C]strstr & strnstr"
subtitle:   ""
date: 2021-02-12 11:45:51 +0900
categories: c
tags: string
comments: true
---

**strstr함수**는 문자열을 찾는 함수입니다.<br />
**strnstr함수**는 정해진 길이안에서 문자열을 찾는 함수입니다.

* * *
<h2>1. 함수원형</h2>
<h4 align="middle">&#60; strstr &#62;</h4>
```c
char *strstr(const char *str, const char *substr)
```
<h4 align="middle">&#60; strlcat &#62;</h4>
```c
char *strnstr(const char *str, const char *substr, size_t len)
```

* * *
<h2>2. 헤더파일, 반환값</h2>
* **반환값** : 
    
    |조건|strstr|strnstr|
    |:--:|:--:|:--:|
    |**문자열 찾을경우**|찾은문자열 시작주소|찾은문자열 시작주소|
    |**문자열 못찾을경우**|NULL포인터|NULL포인터|
    |**(찾는문자열이"\0") or (len == 0)일경우**|str문자열주소|str문자열주소|
    |**NULL포인터를 입력받을경우**|segmentation fault|segmentation fault|
    |**len값이 음수일 경우**||strstr함수와같이 동작|

* **헤더파일** : \<string.h\>

* * *
<h2>3. 함수구현</h2>
<h4 align="middle">&#60; strstr &#62;</h4>
```c
char *strstr(const char *str, const char *substr)
{
    size_t	i;

	if (substr[0] == '\0')
		return ((char *)str);

	while (*str != '\0')
	{
		i = 0;
		while (*(str + i) == *(substr + i))
		{
			i++;
			if (*(substr + i) == '\0')
				return ((char *)str);
		}
		str++;
	}
	return (0);
}
```

* * *
<h4 align="middle">&#60; strlcat &#62;</h4>
```c
char *k_strnstr(const char *str, const char *substr, size_t len)
{
	size_t	i;

	if (substr[0] == '\0')
		return ((char *)str);
	while (*str != '\0' && len-- > 0)
	{
		i = 0;
		while (*(str + i) == *(substr + i) && i < len)
		{
			i++;
			if (*(substr + i) == '\0')
				return ((char *)str);
		}
		str++;
	}
	return (0);
}
```

* * *
<h2>4. 특징 & 주의사항</h2>
1. strstr, strnstr함수 모두 const char*로 받은 것을 char*로 반환해주는 부분이 애매하긴 합니다. stdup, substr과 같은 함수를 직접구현해서 사용하면 strstr,strnstr함수로 찾은 문자열을 새로운 메모리에 복사해서 사용할 수 있습니다. **(자세한 내용 아래 5번항목)**
2. strnstr함수는 윈도우에서는 정의되어 있지 않습니다.(리눅스엔 있음)
3. stnstr함수는 문자열끝('\0')을 내부적으로 확인하기 때문에 len의 값에 대해 안전합니다.<br />len이 음수이면 어떠한 경고도 출력하지않고 버퍼오버플로우된채로 컴파일됩니다.(strstr함수와같이 동작)

* * *
<h2>5. 특징1번 해결법</h2>
<br />
* **직접 strdup, substr함수를 구현해서 쓰는 이유**
    1. 메모리 할당을 운영체제에게 부탁해야 하므로 느립니다.
    2. 직접 메모리 해제 함수(free함수)를 호출해야 하는데 깜박 잊고 안 할 수도 있음<br />(C언어에 내장된 함수들 내부에 메모리할당이 됬는지 안됬는지 문서를 자세히 읽지 않는 이상 알 수 없다.)
    3. 차라리 직접 메모리할당이 내장된 함수를 구현해서 free함수를 잊지않고 사용하는 것이 안전한 방법입니다.
    4. 이러한 이유들로 대부분의 C언어내장함수들은 내부적으로 메모리할당을 하지 않습니다.

**1. &#60; strdup함수 구현 &#62;**
* 문자열을 새로운 메모리를 할당하여 복사하는 함수입니다.
```c
char	*strdup(const char *str)
{
	size_t str_len;
	char   *result;
    char   *temp;

	i = 0;
	str_len = strlen(str);
	if (!(result = (char *)malloc(sizeof(char) * (str_len + 1))))
		return (0);
    temp = result;
	while (*str != '\0')
		*temp++ = *str++;
	*temp = '\0';
	return (result);
}
```

**2. &#60; substr함수 구현 &#62;**
* 문자열의 시작주소와 길이를 커스텀해서 새로운메모리를 할당하여 복사하는 함수입니다.
```c
char	*substr(char const *str, unsigned int start, size_t len)
{
	char	*result;
	size_t	s_len;
	size_t	i;

	s_len = strlen(str);
	if (s_len < start)
		return (strdup(""));        // 직접구현한 strdup함수 이용
	if (!(result = (char *)malloc(sizeof(char) * (len + 1))))
		return (0);
	i = 0;
	while (i < len && i < s_len - start)
	{
		result[i] = str[start + i];
		i++;
	}
	result[i] = '\0';
	return (result);
}
```

**3. &#60; substr함수 사용 &#62;**
* strstr, strnstr함수와 조합해서 다음과 같이 사용하면 됩니다.
```c
int main(void)
{
    char word[] = "Hello! my name is kirim!";
    char *result;
    char *temp;

    temp = strnstr(word, "my", sizeof(word));
    result = substr(temp, 0, 17);        // result = strdup(temp);와 같음
    /*
    코드생략
    */
    free(result);           // 잊지말고 메모리해제
    result = NULL;          // 주소에 남아있는 쓰래기값도 초기화(안해줘도 됨)
}
```