---
layout: post
title:  "[C]매크로 함수(mecro function)"
subtitle:   ""
date: 2021-04-21 02:45:51 +0900
categories: c
tags: etc
comments: true 
---
<style>
    aa {
        font-weight: bold;
        color: #23a11f;
    }
    bb {
        font-weight: bold;
        color: #e97dff;
    }
    cc {
        font-weight: bold;
        color: #e6dd6d;
    }
</style>
이번 포스트는 **매크로 함수(mecro function)**에 관한 내용입니다.

* * *
<h1>1️⃣ 매크로함수</h1>
<h2 style="color:#0e435c;">(1) 매크로함수의 기본사용</h2>

* `#define`을 이용하여 함수처럼 사용할 수 있습니다.
* 다른 <b>매크로</b>들과 마찬가지로 단순히 대체항목으로 <rd>복붙</b>을 해줍니다. <b style="font-size:90%">(전처리 단계에서 해결)</b>
<h3 align="middle" style="color:#0e435c;">&lt; 매크로함수 예시 &gt;</h3>

```c
#include <stdio.h>

#define SQUARE(a) a * a
#define ADD(a, b) a + b
#define SUBTRACT(a, b) a - b

int main(void)
{
    printf("SQUARE(3): %d\n", SQUARE(3));
    printf("ADD(3, 4): %d\n", ADD(a, b));
    printf("SUBTRACT(7, 3): %d\n", SUBTRACT(7, 3));
}
```
<kkr>
    <rmk>/* 출력 */</rmk><br />
    SQUARE(3): 9<br />
    ADD(3, 4): 7<br />
    SUBTRACT(7, 3): 4<br />
</kkr>

* **매크로**를 이용하면 한줄의 코드로 **함수**와 같이 동작하게 만들 수 있습니다.
* 또한 **전처리과정**에서 처리를 하기 때문에 속도가 빠릅니다.
* 하지만 **매크로**의 특성상 코드를 단순히 복사하기 때문에 복사된 후의 <rd>연산 우선순위</rd>를 고려해야 합니다.
<h3 align="middle" style="color:#0e435c;">&lt; 매크로함수 실수할 수 있는 예시 &gt;</h3>

```c
#include <stdio.h>
#define ADD(a, b) a + b
#define ADD2(a, b) (a + b)  // 실수를 줄이는 습관(괄호 이용)

int main(void)
{
    int result1, result2;

    result1 = 10 * ADD(3, 4);
    result2 = 10 * ADD2(3, 4);

    printf("ADD: %d\n", result1);
    printf("ADD2: %d\n", result2);
}
```
<kkr>
    <rmk>/* 출력 */</rmk><br />
    ADD: 34<br />
    ADD2: 70<br />
</kkr>

* 위의 예시와 같이 **매크로**는 단순히 코드를 복사하기 때문에 <rd>괄호 ()</rd>를 사용하는 습관을 가져 실수를 줄여야 합니다.
<br />

* * *
<h2 style="color:#0e435c;">(2) 매크로함수를 여러줄 작성하기</h2>

* `\`를 이용하면 **매크로**를 여러 줄로 작성할 수 있습니다.
<img src="https://kirkim.github.io/assets/img/c/mecro_func1.png" alt="mecro_function_example" width="90%" style="margin-top:3%">
    <kkr>
        <rmk>/* 출력 */</rmk><br />
        3^4 = 81<br />
    </kkr>
<br />

* * *
<h2 style="color:#0e435c;">(3) 매크로함수 활용</h2>

* <b><aa>__builtin_trap();</aa></b>코드를 이용한 나만의 `어서트`매크로를 만들 수 있습니다.
* `assert()`함수의 경우 <rd>실패시</rd><b>호출 스택(call stack)의 현재 위치</b>가 `assert()`함수 속입니다.
* 반면 <aa>__builtin_trap();</aa>은 문제가 생긴 부분에서 멈추기 때문에 위치를 정확히 알 수 있습니다. 즉, <b>호출 스택의 현재 위치</b>가 어서트에 실패한 코드의 현 위치입니다. 그렇기 때문에 `assert()`함수보다 <rd>디버깅</rd>이 편합니다.
* 또한 <aa>stderr</aa>출력을 이용하여 사람이 읽기 편하게 설명할 수 있습니다.

<img src="https://kirkim.github.io/assets/img/c/mecro_func2.png" alt="mecro_function_example2" width="90%" style="margin-top:3%">
    <kkr>
        <rmk>/* 출력 */</rmk><br />
        invalid level(test.c: 13)<br />
    </kkr>

* 하지만 <aa>__builtin_trap();</aa>(맥os기준)대신에 <aa>__asm { int 3};</aa>일 수도 있고 또 다를 수도 있습니다.
* <b>플랫폼</b>마다 사용하는 어셈블리 명령어가 달라집니다. <b style="font-size:90%">(C언어가 <b>크로스 플랫폼</b>이라는 주장은 <b>어셈블리어 코드(.s)</b>로 바뀌기 전까지임을 기억해야 합니다.)</b>
<br /><br />

* * *
<h1>2️⃣ 전처리기 명령어</h1>
<h2 style="color:#0e435c;">(1) &#35; 명령어</h2>

* <b>'&#35;'</b>을 사용하면 `#define`의 매개변수 자체를 <rd>문자열</rd>로 바꿔줍니다.

```c
#include <stdio.h>

#define STR(a) #a

int main(void)
{
    printf("%s\n", STR(\n));
    printf("%s\n", STR("\n"));
    printf("%s\n", STR(Hello));
    printf("%s\n", STR("Hello"));
}
```
<kkr>
    <rmk>/* 출력 */</rmk><br />
    <br />
    <br />
    "\n"<br />
    Hello<br />
    "Hello"<br />
</kkr>

* `\`(escape)문자도 자동으로 추가해줍니다.
<h2 style="color:#0e435c;">(2) &#35;&#35; 명령어</h2>

* <b>대체 목록</b>안에 있는 두 단어를 합쳐서 <b>새로운 텍스트</b>로 바꿔줍니다.

```c
#include <stdio.h>
#define P_ID(n) p_id_##n

int main(void)
{
    int p_id_me = 3;
    int p_id_mom = 4;
    int p_id_dad = 5;
    
    printf("%d\n", P_ID(me));
    printf("%d\n", P_ID(mom));
    printf("%d\n", P_ID(dad));
}
```
<kkr>
    <rmk>/* 출력 */</rmk><br />
    3<br />
    4<br />
    5<br />
</kkr>
<br /><br />

* * *
<h1>3️⃣ 매크로 함수를 이용해서 튜플 만들기</h1>

* 이미 <b>정해진 데이터</b>라면 일리리 구조체를 만들어서 실행중에 출력하는 것은 비효율적입니다.
* 그렇기 때문에 <rd>전처리기튜플</rd>을 만들어줘서 데이터를 한번에 대입시키는 방법을 쓰면 속도면에서 효율적입니다.
<h3 align="middle" style="color:#0e435c;">&lt; 전처리기튜플 예시 &gt;</h3>
<img src="https://kirkim.github.io/assets/img/c/mecro_func3.png" alt="mecro_tuple" width="100%" style="margin-top:3%">
<kkr>
    <rmk>/* 출력 */</rmk><br />
    0: 철수, 24살<br />
    1: 영희, 32살<br />
    2: 민수, 19살<br />
    3: 지은, 25살<br />
</kkr>