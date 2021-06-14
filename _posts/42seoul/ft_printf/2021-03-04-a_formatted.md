---
layout: post
title:  "[ft_printf]서식"
subtitle:   ""
date: 2021-03-04 02:45:51 +0900
categories: 42seoul
tags: ft_printf
comments: true 
---

이번 포스트는 **서식 지정 출력함수**에 관한 내용입니다.

* * *
<h2>1️⃣ 서식 지정(formatted) 출력함수</h2>
* C에서 출력을 논할 때 가장 기본이 되는 함수입니다.
* **서식문자열**을 쓰는이유는 **추가 메모리 할당**없이 **기존 자료형**을 **출력 스트림**에 **문자**들로 출력해주기 때문입니다.
* **대표적인 서식 지정 출력함수**
    1. **printf():** 콘솔창(stdout)에 출력
    2. **fprintf():** 스트림(stream)에 출력
    3. **sprintf():** 문자열에 출력
<h4><span style="color:#084B8A;">자세한내용 &gt;</span><a href="https://kirkim.github.io/c/2021/02/15/printf_sprintf_fpirntf.html" target="blank">[C]printf & sprintf & fprintf</a></h4>
<br /><br />

* * *
<h2>2️⃣ 서식 문자열 형식</h2>
<h4 style="background-color: #000000;"><b style="color:#ffffff;">&#37;</b><b style="color:#8fcaf1;">&#91;플래그&#93;</b><b style="color:#b5ebb3f6;">&#91;너비&#93;</b><b style="color:#f5c118;">&#91; &#46;숫자 정밀도 &#124; &#46;문자열 최소&#47;최대 출력 개수&#93;</b><b style="color:#cc60b5;">&#91;길이&#93;</b><b style="color:#ffffff;">서식 지정자</b></h4>
* 일반적으로 `%`뒤에 최대 4개까지 지정자를 지정할 수 있습니다.
* **서식 지정자**는 필수로 작성해야하고 나머지는 선택사항입니다.
* 반드시 위의 순서에 맞춰서 지정자를 작성해야 합니다.
<br /><br />

* * *
<h2>3️⃣ 서식 지정자</h2>

|서식 지정자|출력|예시|
|:--:|:--:|:--:|
|**c**|문자|A|
|**s**|문자열|ABC|
|**d**|부호있는 십진법 정수|65|
|**u**|부호없는 십진법 정수|65|
|**o**|부호없는 정수를 8진수(부호있으면 오버플로우되서출력)<br />**숫자 앞에 '0'안 붙여줌**|101|
|**x**, **X**|부호없는 정수를 16진수(소문자, 대문자)로 출력<br />**숫자 앞에 '0x', '0X'는 안 붙여줌**|41|
|**f**|부동소수점(십진법)|6.500000|
|**e/E**|부동소수점을 지수표기법(e, E)로 출력|6.500000e+000<br />6.500000E+000|
|**g, G**|부동소수점을 최대 소수점5째자리까지<br />(다른 지정자없을시) 간략하게출력|6.24343|
|**p**|포인터값(주소)|0061FECC|

<br /><br />

* * *
<h2>4️⃣ 서식규칙 - 너비</h2>
* 정수로 작성하며 출력값이 너비보다 작으면 **공백**으로 출력
* 기본적으로 오른쪽 정렬
<h3 align="middle" style="color:#0e435c;">&lt; 예시 &gt;</h3>
```c
int num = 65;
printf("%d\n", num);
printf("%5d\n", num);
```
<kkr>
65<br />
&nbsp;&nbsp;&nbsp;65
</kkr>

<br /><br />

* * *
<h2>5️⃣ 서식규칙 - 플래그</h2>
<h3 style="color:#0e435c;">(1) ' &#45; '</h3>
왼쪽으로 정렬시켜줍니다.
```c
int num = 65;
printf("%-5d\n", num);
```
<kkr>
65
</kkr>

* * *
<h3 style="color:#0e435c;">(2) '0'</h3>
왼쪽 빈공간을 0으로 채워줍니다.
```c
int num = 65;
printf("%05d\n", num);
printf("%-05d\n", num);
```
<kkr>
00065<br />
65
</kkr>

* * *
<h3 style="color:#0e435c;">(3) '&#43;'</h3>
양수이면 **&#43;**기호를 붙여 줍니다.
```c
int num = 65;
printf("%+d\n", num);
printf("%+5d\n", num);
printf("%+05d\n", num);
```
<kkr>
&#43;65<br />
&nbsp;&nbsp;+65<br />
&#43;0065
</kkr>

* * *
<h3 style="color:#0e435c;">(4) '&nbsp;'(공백)</h3>
한칸 띄어서 출력해줍니다.(여러번 공백을 줘도 한칸 적용, '&#43;'기호가 있으면 무시합니다)
```c
int num = 65;
printf("% d\n", num);
printf("% 05d\n", num);
printf("% +05d\n", num);
```
<kkr>
&nbsp;65<br />
&nbsp;0065<br />
&#43;0065
</kkr>

* * *
<h3 style="color:#0e435c;">(5) '&#35;'</h3>

|조합|출력|
|:--:|:--:|
|#o|부호없는 정수(8진수)를  '0'을 붙여서 출력|
|#x|부호없는 정수(16진수)를 '0x'를 붙여서 출력|
|#X|부호없는 정수(16진수)를 '0X'를 붙여서 출력|

```c
int num = 65;
printf("%#o\n", num);
printf("%#x\n", num);
printf("%#X\n", num);
```
<kkr>
0101<br />
0x41<br />
0X41
</kkr>
<br /><br />

* * *
<h2>6️⃣ 서식규칙 - 정밀도</h2>
<h3>(1) <b style="color:#4e86ff;">최소 너비</b> &#46; <b  style="color:#dd1144;">소수점 아랫자리 수</b></h3>
* 서식 지정자 **&#39; f &#39;**와 함께 사용합니다.
* 원래 숫자의 너비(소수점 포함)보다 <b style="color:#4e86ff;">최소 너비</b>가 크면 **왼쪽**을 공백으로 채웁니다.
* 원래 숫자의 소수점 아랫자리 수보다 <b style="color:#dd1144;">소수점 아랫자리 수</b>가 크면 **오른쪽**을 0으로 채웁니다.
* **기본 소수점 아랫자리 수: 6** (기존'f'서식자와 동일)
```c
float num = 6.5;
printf("%f\n", num);
printf("%7.3f\n", num);
printf("%2.3f\n", num);
```
<kkr>
6.500000<br />
&nbsp;&nbsp;6.500<br />
6.500
</kkr>

* * *
<h3>(2) <b style="color:#4e86ff;">최소 너비</b> &#46; <b  style="color:#f8913d;">최대 너비</b></h3>
* 서식 지정자 **&#39; s &#39;**와 함께 사용합니다.
* 출력할 문자열의 길이가 <b style="color:#4e86ff;">최소 너비</b>보다 작으면 **왼쪽**을 공백으로 채웁니다.
* 출력할 문자열의 길이가 <b  style="color:#f8913d;">최대 너비</b>보다 크면 문자열을 자릅니다.(뒷 부분부터)
```c
char string[] = "Hi, I'm kirim!";
printf("%s\n", "good");
printf("%6.8s\n", "good");
printf("%s\n", string);
printf("%4.8s\n", string);
```
<kkr>
good<br />
&nbsp;&nbsp;good<br />
Hi, I'm kirim!<br />
Hi, I'm
</kkr>