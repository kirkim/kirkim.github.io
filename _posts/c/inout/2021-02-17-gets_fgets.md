---
layout: post
title:  "[C]gets & fgets"
subtitle:   ""
date: 2021-02-17 04:45:51 +0900
categories: c
tags: inout
comments: true
---

* **gets함수**는 문자열 출력함수입니다.
* **fgets함수**는 스트림에 문자열을 읽는 함수입니다.

* * *
<h2>1️⃣ 함수원형</h2>
<h4 align="middle">&#60; gets &#62;</h4>
```c
char *gets(char *str);
```
<h4 align="middle">&#60; fgets &#62;</h4>
```c
char *fgets(char *str, int num, FILE *stream);
```

* * *
<h2>2️⃣ 헤더파일, 반환값</h2>
* **헤더파일**: &lt;stdio.h&gt;
* **반환값**:

  ||성공|실패|
  |:--:|:--:|:--:|
  |gets|읽어들인 문자열(str)|NULL포인터|
  |fgets|읽어들인 문자열(str)|NULL포인터|

  
* * *
<h2>3️⃣ 함수사용</h2>
<h3 style="color:#0e435c;">(1) gets</h3>
```c
#define BUFFER 256

int main(void)
{
	char string[BUFFER];
	char *result;

	result = gets(string);
	printf("%s\n", result);
}
```

* * *
<h3 style="color:#0e435c;">(2) fgets</h3>
<h5 align="middle">&lt; test.txt내용 &gt;</h5>
<kkr>
Hello my name is kirim!<br />
nice to meet you!
</kkr>

<h5 align="middle">&lt; fgets &gt;</h5>

```c
#define BUFFER 20

int main(void)
{
	FILE *stream;
	char string[BUFFER];
	char *result;

	stream = fopen("test.txt", "r");
	result = fgets(string, BUFFER, stream);
	printf("%s\n", result);
}
/*---출력---*/
Hello my name is ki
```

* * *
<h2>4️⃣ 특징 &amp; 주의사항</h2>
1. `gets, fgets`함수 모두 끝에 자동으로 `'\0'`문자를 넣어 줍니다.
2. **gets함수**는 매우 매우 위험한 함수입니다. 최신 헤더파일에서는 gets함수가 없습니다.<br />(C11에서는 아예 이 함수를 제거)**(아래 자세한내용)**
3. `fgets`함수 또한 두번째인자값이 첫번재인자의 크기보다 클경우 버퍼오버플로우가 일어납니다. 그렇기 때문에 위의 코드처럼 두번째인자를 `BUFFER`로 매크로형식으로 크기를 동일하게 작성하는 것도 한 방법입니다.
4. `fgets`함수는 '\n'개행문자까지 읽어들입니다.**(아래 자세한내용)**

* * *
<h2>5️⃣ 코드예시(특이케이스)</h2>
<h3>(1)&#60; gets함수의 위험성 &#62;</h3>
```c
#define BUFFER 5

int main(void)
{
	char sample[6] = "hello";
	char string[BUFFER];
	char *result;

	printf("before sample: %s\n", sample);

	result = gets(string);
	printf("result: %s\n");
	printf("after sample: %s\n", sample);
}
/*---입력값---*/
abcdefg
/*---출력값---*/
before sample: hello
result: abcdefg
after sample: fg
```
<img src="https://kirkim.github.io/assets/img/c/gets_img1.jpg" width="90%">
* 위의 코드처럼 다른메모리에 침범을 하게 됩니다.(보안상의 위험성이 크다)
* BUFFER의 크기를 조정한다고해서 해결할 문제가 아닙니다. (언제가는 버퍼오버플로우가 생김)
* 이러한 이유 때문에 **gets함수는 절대로 사용하지 않는 것이 좋습니다.**
<br /><br />
<h3>(2)&#60; '\n'도 읽어들이는 fgets함수 &#62;</h3>
<img src="https://kirkim.github.io/assets/img/c/gets_img2.jpg" width="90%">
이 처럼 fgets함수는 새 줄을 만나서 끝났을 떄랑 아닐 떄를 구분해야 하기 때문에 '\n'문자까지도 읽어 드립니다. (새 줄을 만나지 않아도 반환될 수 있음)
```c
int main(void)
{
	char string[BUFFER];   //#define BUFFER 20

	fgets(string, BUFFER, stdin);  //입력 : "hello"
	printf("< puts 함수결과 >\n");
	puts(string);
	printf("< printf 함수결과 >\n");
	printf("%s", string);
}
/*---출력---*/
< puts 함수결과 >
hello

< printf 함수결과 >
hello
```
* fgets함수에서 stdin(입력스트림)형식으로 입력을 완료하기 위해서는 개행문자(\n)을 입력해야 합니다. 이때 `fgets함수`는 `'\n'`까지 읽어드립니다.
* 이때 `puts함수`는 자동으로 '\n'을 문자끝에 출력해줍니다. 그렇기 때문에 fgets + puts 조합으로 사용할시 '\n'이 두번적용됩니다.
* 결과적으로 `fgets함수는 printf계열의 함수와 사용`하는 것이 어울립니다.
<br /><br />
<h3>(3)&#60; sscanf + fgets조합의 입력코드 &#62;</h3>
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
			printf("%s\n", result);
	}
}
```
* 위험할 수 있는 `scanf함수`를 대체할 수 있는 코드조합입니다.
* `fgets함수`와 `sscanf`함수의 단점을 서로 보완했으며 매우 효과적인 코드조합입니다.**[( 자세한 내용은 scanf관련 POST에 있습니다 )](https://kirkim.github.io/c/2021/02/15/scanf_sscanf.html)**