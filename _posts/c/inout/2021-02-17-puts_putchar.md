---
layout: post
title:  "[C]puts,fputs & putchar,fputc"
subtitle:   ""
date: 2021-02-17 02:45:51 +0900
categories: c
tags: inout
comments: true
---

* **puts함수**는 문자열 출력함수입니다.
* **fputs함수**는 스트림에 문자열을 쓰는 함수입니다.
* **putchar함수**는 문자 출력함수입니다.
* **fputc함수**는 스트림에 문자를 쓰는 함수입니다.

* * *
<h2>1️⃣ 함수원형</h2>
<h4 align="middle">&#60; puts &#62;</h4>
```c
int puts(const char* str);
```
<h4 align="middle">&#60; fputs &#62;</h4>
```c
int fputs(const char* str, FILE* stream);
```
<h4 align="middle">&#60; putchar &#62;</h4>
```c
int putchar(int character);
```
<h4 align="middle">&#60; fputc &#62;</h4>
```c
int fputc(int character, FILE* stream);
```

* * *
<h2>2️⃣ 헤더파일, 반환값</h2>
* **헤더파일**: &lt;stdio.h&gt;
* **반환값**:

  ||성공|실패|
  |:--:|:--:|:--:|
  |puts|음이아닌값|EOF(-1)|
  |fputs|음이아닌값|EOF(-1)|
  |putchar|출력된문자|EOF(-1)|
  |fputc|쓰인문자|EOF(-1)|
  
* * *
<h2>3️⃣ 함수사용</h2>
<h3 style="color:#0e435c;">(1) puts, putchar</h3>
```c
int main(void)
{
	char string[] = "hello";
    char word = "c";

    puts(string);
    putchar(word);
    putchar(word);
}
/*---출력---*/
hello     //puts함수는 개행문자 자동포함 
cc        //putchar함수는 개행문자포함x
```

* * *
<h3 style="color:#0e435c;">(2) fputs, fputc</h3>
```c
int main(void)
{
	FILE *stream;

	stream = fopen("test.txt", "w");
	char string[] = "hello";
    char word = 'c';

    fputs(string, stream);
	fputc(word, stream);

	fclose(stream);
}
```
<h5 align="middle">&lt; test.txt내용 &gt;</h5>
<kkr>
helloc
</kkr>

* fputs함수는 puts함수처럼 개행문자를 넣어주지는 않습니다.

* * *
<h2>4️⃣ 특징 &amp; 주의사항</h2>
1. `puts함수`는 자동으로 마지막에'\n'문자도 넣어 줍니다.
2. `fputc`의 스트림으로 `stdout`스트림을 넣으면 `putchar`함수와 같이 동작합니다.
3. `fputs`의 스트림으로 `stdout`스트림을 넣으면 `puts`함수와 같이 동작하지만 개행문자`'\n'`을 넣어주지 않습니다.
4. int형정수를 출력하는데 한계가 있기 때문에 `printf`를 더 많이 씁니다.
5. 하지만 `putchar`함수는 문자한개를 출력할 때는 유용한 함수입니다.
6. 음수가 반환 될 수 있기때문에 반환형으로 `int`자료형을 사용합니다.