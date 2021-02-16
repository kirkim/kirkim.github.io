---
layout: post
title:  "[C]scanf & sscanf"
subtitle:   ""
date: 2021-02-16 03:45:51 +0900
categories: c
tags: inout
comments: true
---

* **scanf함수**는 데이터를 stdin(콘솔입력)으로 형식에 맞추어 입력하는 함수입니다.
* **sscanf함수**는 데이터를 src(문자열 버퍼)를 형식에 맞추어 입력하는 함수입니다.

* * *
<h2>1. 함수원형</h2>
<h4 align="middle">&#60; scanf &#62;</h4>
```c
int scanf(const char* restrict format, ...);
```
<h4 align="middle">&#60; sscanf &#62;</h4>
```c
int sscanf(char* restrict src, const char* restrict format, ...);
```

* * *
<h2>2. 헤더파일, 반환값</h2>
* **헤더파일**: \<stdio.h\>
* **반환값**:
  ||성공|실패|
  |:--:|:--:|:--:|
  |scanf|읽어들인 것의 개수|0(아무것도 못읽었을 경우)|
  |sscanf|읽어들인 것의 개수|0(아무것도 못읽었을 경우)|

* * *
<h2>3. 함수사용</h2>
<h5>1.&#60; sscanf함수 &#62;</h5>
```c
int main(void)
{
	char putdata[] = "hello 3";
	char string[6];
	int num;

	sscanf(putdata, "%s%d", string, &num);
	
	printf("string: %s\n", string);
	printf("num: %d\n", num);
}
```

* * *
<h2>4. 특징 & 주의사항</h2>
1. %c를 제외하고 모든 데이터는 한단어씩(공백문자로 구분) 또는 가능할때까지 읽습니다.
2. %s는 거의 모든문자를 다 읽을 수 있습니다.(공백 문자) 하지만 배열의 크기보다 큰 문자열이 들어오면 버퍼오버플로우가 일어납니다. **(아래 해결방법)**
3. 서식자에 맞지않는 데이터가 들어오면 오류가 납니다. **(아래 자세한 내용)**

* * *

<h2>5. 코드예시(특이케이스)</h2>
<h3>(1)&#60; sscanf함수로 문자형정수를 int형정수로 변환하기 &#62;</h3>
<h5 align="middle">&#60; 10진수로 변환 &#62;</h5>
```c
int main(void)
{
	int num;
	char result[5] = "1234";

	sscanf(result, "%d", &num);     

	printf("%d\n", num);  
}
/*---출력---*/
10
```
<h5 align="middle">&#60; 8진수로 변환 &#62;</h5>
```c
int main(void)
{
	int num;
	char result[5] = "1234";

	sscanf(result, "%o", &num);     

	printf("%d\n", num);
	printf("%d\n",(8*8*8 + 2*8*8 + 3*8 + 4));  //8진수임을 검증
}
/*---출력---*/
668    //1x8x8x8 + 2x8x8 + 3x8 + 4
668
```
* 8진수로 변환 뿐만아니라 `%f`, `%x` 서식자를 이용해서 float형과 16진수도 동일한 방법으로 바꿀 수 있습니다.
* atoi, atof 등과 같은 함수들과 같이 동작하며 어쩌면 더 간편한 함수라고 할 수 있습니다.
<br /><br />
<h3>(2)&#60; 서식자와 맞지않는 데이터가 들어온 경우(특징3) &#62;</h3>

```c
int main(void)
{
	int num = 0;
	int num2 = 0;
	char putword[] = "1234p567890";

	sscanf(putword, "%d %d", &num, &num2);
	printf("%d %d\n", num, num2);
}
/*---출력---*/
1234 0
```
<img src="/assets/img/c/sscanf_img1.jpg" width="80%">
* num에 '1234'가 입력된 뒤 문자'p'지점에서 인식을 못하고 무한루프가 일어나게 됩니다.
* 컴파일러에 따라서 함수를 종료 시킵니다.
<br /><br />
<h3>(3)&#60; fgets + sscanf 조합[1]: 버퍼오버플로우 해결 &#62;</h3>
* scanf, sscanf함수의 메모리 통제를 잘하지 못하면 버퍼오버플로우가 날 위험이 있습니다.
* 또한 서식자를 잘못사용하면 무한루프에 빠질 위험이 있습니다.
<h5 align="middle">&#60; fgets + sscanf함수를 조합해서 사용 &#62;</h5>
```c
#define BUFFER (4096)
#ifndef TRUE
 #define TRUE (1)
#endif

int main(void)
{
	char temp[BUFFER];
	char result[BUFFER];

	while (TRUE)
	{
		if (fgets(temp, BUFFER, stdin) == NULL)
		{
			clearerr(stdin);
			break;
		}
		if (sscanf(temp, "%s", result) == 1)
			printf("%s\n", word);
	}
}
```
* `temp`와 `result`의 BUFFER의 크기를 동일하게하고 사용하면 버퍼 오버플로우가 절대 발생하지 않습니다.
* 실제 업계에서도 많이 사용하는 조합이라고 합니다.
* fgets함수의 NULL포인터 예외처리는 임시로 해둔 것이지 상황에 맞게 처리하면될 것같습니다. `fprintf(stderr, "error")`와 같이 처리해도 됩니다.
<br /><br />
<h3>(4)&#60; fgets + sscanf 조합[2]: 무한루프 해결 &#62;</h3>
fgets + sscanf조합을 사용하면 sscanf함수에서 서식자오류로 무한루프에 빠질 위험에 빠지더라도 fgets함수를 다시 만나기 때문에 무한루프에 빠질 위험이 없어지게 됩니다.
<h5 align="middle">&#60; sscanf단독사용(안좋은 케이스) &#62;</h5>
<img src="/assets/img/c/sscanf_img2.jpg" width="100%">
<h5 align="middle">&#60; fgets + sscanf함수를 조합 &#62;</h5>
<img src="/assets/img/c/sscanf_img3.jpg" width="100%">