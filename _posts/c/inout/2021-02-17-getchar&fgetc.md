---
layout: post
title:  "[C]getchar &amp; fgetc"
subtitle:   ""
date: 2021-02-17 03:45:51 +0900
categories: c
tags: inout
comments: true
---

* **getchar함수**는 문자열 출력함수입니다.
* **fgetc함수**는 스트림에 문자열을 읽는 함수입니다.

* * *
<h2>1. 함수원형</h2>
<h4 align="middle">&#60; getchar &#62;</h4>
```c
int getchar(void);
```
<h4 align="middle">&#60; fgetc &#62;</h4>
```c
int fgetc(FILE* stream);
```

* * *
<h2>2. 헤더파일, 반환값</h2>
* **헤더파일**: \<stdio.h\>
* **반환값**:

  ||성공|실패|
  |:--:|:--:|:--:|
  |getchar|읽어들인 문자|EOF(-1)|
  |fgetc|읽어들인 문자|EOF(-1)|

  
* * *
<h2>3. 함수사용</h2>
<h5>&#60; getchar &#62;</h5>
```c
int main(void)
{
	int c;

	while ((c = getchar()) != EOF)
	{
		putchar(c);
	}
}
```
* 이와같이 while문안에 조건을 넣는 코드는 실수할 가능성이 큽니다.<br />아래 코드와 같이 if문으로 처리하는 방법이 실수를 줄이는 방법입니다.
```c
int main(void)
{
	int c;

	while(1)
	{
		if ((c = getchar()) == EOF)
			break;
		putchar(c);
	}
}
```
* 일반적으로 EOF입력은 `Ctrl + Z`로 가능하며 리눅스에서는 `Ctrl + D`입니다.

<h5>&#60; fgetc &#62;</h5>
```c
int main(void)
{
    FILE *stream;
    int c;

    stream = fopen("test.txt","r");
    while(1)
    {
        if ((c = fgetc(stream)) == EOF)
            break;
        putchar(c);
    }

    fclose(stream);
}
/*---test.txt내용---*/
Hello my name is kirim!
nice to meet you!
/*---출력---*/
Hello my name is kirim!
nice to meet you!
```

* * *
<h2>4. 특징 & 주의사항</h2>
<h5>&#60; 한글자씩 읽는 함수 &#62;</h5>
1. 입력이 문자/문자열일 때 좋은 함수입니다.
2. 메모리에 입력값을 저장해두지 않아도됩니다.(용량절약, 실수줄임)
3. 정수형숫자(다른 데이터형)을 읽는 것이 힘듭니다.