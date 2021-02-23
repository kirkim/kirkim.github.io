---
layout: post
title:  "[C]memccpy & memmove"
subtitle:   ""
date: 2021-02-09 02:45:51 +0900
categories: c
tags: memory
comments: true
---

**memccpy함수**는 메모리값을 원하는 크기안에서 원하는 문자까지 복사하는 함수입니다.<br />
**memmove함수**는 메모리값을 원하는 크기만큼 복사하는 함수입니다.(주소가 겹칠때 유용)

* * *
<h2>1️⃣ 함수원형</h2>
<h4 align="middle">&#60; memccpy &#62;</h4>
```c
void *memccpy(void *dst, const void *src, int c, size_t size)
```
<h4 align="middle">&#60; memmove &#62;</h4>
```c
void *memmove(void *dst, const void *src, size_t size)
```
* * *
<h2>2️⃣ 헤더파일, 반환값</h2>
* **반환값**:

    |조건|memccpy|memmove|
    |:--:|:--:|:--:|
    |**성공시(문자찾을시)**|복사된 문자열 다음주소(dst)|복사된 문자열 시작주소(dst)|
    |**실패시(문자못찾을시)**|NULL포인터(0)||
    |**dst, src모두 NULL포인터일 때**|segmentation fault|NULL포인터(0)|
    |**dst, src둘중하나가 NULL포인터일 때**|segmentation fault|segmentation fault|

* **헤더파일**: &lt;string.h&gt;

* * *
<h2>3️⃣ 함수구현</h2>
<h4 align="middle">&#60; memccpy &#62;</h4>
```c
void *memccpy(void *dst, const void *src, int c, size_t size)
{
	unsigned char       *dp;
	const unsigned char *sp;

	dp = dst;
	sp = src;
	while (size-- > 0)
	{
		*dp = *sp;
        if (*sp == (unsigned char)c)
            return (dp + 1);
        dp++;
        sp++;
	}
	return (0);
}
```
<h4 align="middle">&#60;memmove&#62;</h4>
```c
void *memmove(void *dst, const void *src, size_t size)
{
	const unsigned char	*sp;
	unsigned char		*dp;
	size_t				i;

	i = 0;
	dp = dst;
    sp = src;
	if (dp == NULL && sp == NULL)
		return (0);
	if (dp > sp)
    {
		while (size-- > 0)
			*(dp + size) = *(sp + size);
    }
	else
	{
		while (size-- > 0)
			*dp++ = *sp++;
	}
	return (dst);
}
```
* * *
<h2>4️⃣ 특징 &amp; 주의사항</h2>
<h4 align="left">&#60; memccpy &#62;</h4>
1. 찾고자하는 문자를 못찾을시 0을 반환하지만 복사는 이뤄집니다.
2. size값을 dst, src의 크기보다 작게 잡아줘야 합니다.(컴파일러에 따라 경고메시지출력)
3. 되도록이면 1바이트크기의 자료형만 사용하는 것이 좋습니다.(아래 자세한 내용)
<h4 align="left">&#60; memmove &#62;</h4>
1. 첫번째인자(dst), 두번째인자(src) 둘다 NULL포인터이면 예상과 달리 대부분의 컴파일러에서 경고메시지 없이 NULL포인터를 반환하면서 정상컴파일이 되었습니다.
2. size값을 dst, src의 크기보다 작게 잡아줘야 합니다.(컴파일러에 따라 경고메시지출력)
* * *
<h2>5️⃣ 코드예시(특이케이스)</h2>
<br />
**1. &#60; memccpy에서 1byte크기가 아닌 자료형을 사용할 경우 &#62;**
```c
#include <stdio.h>
#include <string.h>

int main(void)
{
	int word1[20] = { 0, };
	int temp[] = {4423, 2, 3, 65281, 4};
	int *result

	result = memccpy(word1, temp, 65281, sizeof(temp));
	if (result == 0)
		printf("ss\n");
	for (int i = 0; i < 5; i++)
		printf("%d ", word1[i]);
	printf("\n");
}
/*---출력---*/
5 2 3 1 0
```
* **기대값:** `4423 2 3 65281 0`
* **출력값:** `4423 2 3 1 0`
* **원인:** 문자(c)를 찾은 지점에서 문제가 생김
* **이유:** memccpy함수는 찾을문자(int c)를 내부적으로 1byte의 메모리만 비교하여 찾습니다. (int)65281의 메모리를 리틀엔디언 기준으로 본다면 "01 ff 00 00"으로 되어있는데 앞의 1byte크기인 "01"부분만을 비교하여 찾게 되고 복사를 종료하게 됩니다. 
* **해결 방안:**
	1. 3번째인자의 값에 "0xff"를 입력하면 65281의 메모리에서 "01 ff"까지 복사되어 기대값처럼 출력이 됩니다.
	2. int자료형일 경우 0 ~ 255(1byte범위)안에서만 다루는 것이 좋습니다.<br />3번째 인자(c))가 0일경우 문제가 생길 확률이 큽니다.
<h6 align="middle">&#60;3번째 원소(65281)의 실제메모리&#62;</h6>

||리틀 엔디언|빅 엔디언|
|:--:|:--:|:--:|
|**(int)257**|01 ff 00 00|00 00 ff 01|
|4byte단위(int)로|앞에서 부터 스텍에 쌓임|뒤에서 부터 스텍에 쌓임|

* **결론:** 예상치 못한 결과를 방지하기 위해서는 memccpy의 인자들을 1byte크기의 자료형을 사용하는 것이 좋습니다. 굳이 int형을 다루고 싶다면 0 ~255의 범위안에서 사용하는 것이 좋습니다.(또한 3번째인자(c)는 0을 사용하지 않는다)