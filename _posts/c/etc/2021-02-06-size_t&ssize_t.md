---
layout: post
title:  "[C]size_t & ssize_t"
subtitle:   ""
date: 2021-02-06 11:45:51 +0900
categories: c
tags: etc
comments: true
related_posts:
    - category/_posts/study/2020-12-26-making-blog-02.md
    - category/_posts/study/2020-12-26-making-blog-03.md
---

* * *
이번장에서는 **size_t**와 **ssize_t**자료형에 대해알아보도록 하겠습니다. <br />
 'size_t'의 영어로된 정의를 살펴보면 "The datatype size_t is unsigned integral type."로 되어있습니다. 그렇기 때문에 'size_t'는 'unsigned int'라고 잘못 생각할 수도 있습니다. <br /> size_t와 ssize_t를 알아보기 전에 **int**, **long**자료형에 대해 알아보겠습니다.

* * *
<h2 align="center">int</h2>
* * *
* int형은 C표준 "최소 16비트 그리고 short의 크기 이상인 정수형"으로 정의되어 있습니다.
* int는 단순히 정수(integer)라는 의미이며 CPU가 알 수 있는 정수값의 크기를 가졌습니다.(16비트컴퓨터: 16비트, 32비트컴퓨터: 32비트)
* 예전에는 16비트 컴퓨터가 흔했기 때문에 "C표준기준 최소 16비트"라는 정의가 생겼습니다. <br />그 후 32비트 컴퓨터가 나오면서 int의 크기는 32비트로 바꼈습니다.
* 현재 64비트 컴퓨터임에도 불구하고 32비트 컴퓨터를 너무 오랬동안 사용해 왔기 때문에 int의 크기는 32비트에 머물러 있습니다.

* * *
<h2 align="center">long</h2>
* * *
* long형은 C표준 "최소 32비트이상 그리고 int이상의 크기"로 정의되어 있습니다.
* int형이 32비트로 바뀌면서 int, long 자료형 모두 32비트인 웃픈상황이 되었습니다.(윈도우기준,리눅스에서는 long의 크기가 64비트)
* 64비트 정수형을 사용하고 싶다면 'long long'자료형을 사용하면됩니다.(윈도우,리눅스동일)

* * *
<h1 align="center">size_t</h1>
* * *
* C99표준에서 최소 16비트를 요구합니다.
* 'size_t'는 "이론상 가장 큰 사이즈를 담을 수 있는 unsigned 정수형으로 정의됩니다.<br />32비트 운영체제에서는 unsigned32비트 정수이고, 64비트 운영체제에서는 64비트 unsigned 정수입니다.<br />
* 윈도우에서는 'unsigned int'로 리눅스에서는 'unsigned long'으로 정의되어 있습니다.
* '_t'는 typedef를 했다는 뜻으로 실제로 다음과 같이 선언되어 있습니다.
```c
typedef unsigned int size_t     // 윈도우
typedef unsigned long size_t    // 리눅스
```
* 하지만 size_t역시 최소값만 정해져 있고 운영체제나 컴파일러에 따라 달라질 수도 있습니다. 심지어 `typedef unsigned long long size_t`로 선언되어 있는 곳도 있습니다.
* 단순하게 하드웨어에 따라 최고의 범위를 사용하기 위해 size_t를 사용한다라고 생각하면 될 것 같습니다. (음수를 이용하지 않는 곳)

* * *
<h1 align="center">ssize_t</h1>
* * *
* 윈도우에서는 'int'로 리눅스에서는 'long'으로 선언되어 있습니다.
```c
typedef int ssize_t     // 윈도우
typedef long ssize_t    // 리눅스
```
* 'size_t'와 마찬가지로 'long long'으로 선언되어 있을 수 있습니다.
* 'ssize_t'는 저수준언어(open, write, read, close등등) 유닉스 기반의 고전함수(?)의 반환형으로 해당 IO 함수의 실패여부를 알려주기 위해 사용되었습니다.<br />(정상작동시 1, EOF시 0, ERROR시 -1 반환)
* 따라서 윈도우에서는 컴파일러나 환경에 따라서 'ssize_t'라는 자료형이 없을 수 도 있습니다.

* * *
<h2>고찰</h2>
* 굳이 'size_t'와 같은 자료형을 사용하는 이유는 환경에 따라서 크기가 달라질 수있으나 변경할 수 없는 자료형을 사용하는 것 보다 typedef로 선어되어 있어 크기 수정이 쉬운 'size_t'를 사용하는 것이 호환성면에서 더 좋기 때문(?)이라고 생각했습니다.
* 항상 시스템 환경이 바뀌면 그 환경의 자료형에 관한 메뉴얼을 읽어 보는 것이 좋을 것 같습니다. (작은 기계를 프로그래밍할때도 크기가 다를 수도 있다)
* 위에서 알아본 여러 자료형들과 비슷한 이유로 1바이트가 8비트가 아닐 수도 있습니다. C에서 1바이트는 1Character(char)라고 부릅니다. 그렇다고 char형이 반드시 8비트인 것은 아닙니다. char형은 "최소 8비트인 정수형"으로 C표준에 정의되어 있습니다. <br />자세한 내용은 [( ZepehWAVE블로그 )](https://zepeh.tistory.com/313)를 참고하면될 것 같습니다.
* 대부분의 컴파일러에서 자료형의 크기는 <limit.h>헤더에 선언되어 있습니다. <br />(예를들어 char형의 max값은 CHAR_MAX를 보면 알 수 있습니다.)