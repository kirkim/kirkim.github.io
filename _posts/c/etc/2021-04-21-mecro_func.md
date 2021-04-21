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
        color: #60fc52;
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
<img src="https://kirkim.github.io/assets/img/c/mecro_func1.png" alt="mecro_function_example" width="100%" style="margin-top:3%">