---
layout: post
title:  "[C]인라인 함수(inline)"
subtitle:   ""
date: 2021-04-27 02:45:51 +0900
categories: c
tags: etc
comments: true 
---

* * *
<h1>1️⃣  매크로 함수 vs 인라인 함수</h1>
<h2 style="color:#0e435c;">(1) 매크로 함수의 한계</h2>

1. 단순히 복붙을 해줌으로 실수할 가능성이 있습니다. (괄호를 잘 사용해야 됩니다)
2. 가독성이 매우 안좋습니다.
3. 디버깅하기가 매우 어렵습니다.

<h2 style="color:#0e435c;">(2) 인라인 함수의 특징</h2>

1. 컴파일러가 판단하여 매크로처럼 코드를 교체합니다. <b style="font-size:90%">(함수를 호출하여 생기는 스텍소모가 없어짐)</b>
2. 컴파일러가 링커가 볼 수 있는 함수 심볼을 만들지 않습니다. <b style="font-size:90%">(인라인이 되지않을 때 문제가 생김)</b>
3. 연산우선순위가 **일반 함수**와 같이 동작하여 실수할 가능성이 적어집니다.

    ```c
    #define multi_mecro(b) b * b

    inline int multi_inline(int a)
    {
        return a * a;
    }

    int main(void)
    {
        printf("%d\n", multi_mecro(3 + 4)); // 3 + 4 * 3 + 4
        printf("%d\n", multi_inline(3 + 4)); // (3 + 4) * (3 + 4)
    }
    ```
4. C99표준에 포함될 정도로 매크로함수대신 사용할 것을 권장하고 있습니다. <b style="font-size:90%">(하지만 c에서는 아직도 매크로를 더 많이 사용)</b>
<br /><br />

* * *
<h1>2️⃣ 인라인 함수 한계</h1>
<h2 style="color:#0e435c;">(1) 심볼을 찾을 수 없는 문제</h2>

* **inline**키워드는 컴파일러에게 <rd>함수로 사용하지마</rd>라고 알려주기 때문에 링커가 볼 수 있는 **함수 심볼**을 만들지 않습니다.
* 그렇기 때문에 **인라인**이 되지않으면 링크할 함수를 찾지못하게 됩니다.
* <b>C표준</b>을 잘 따르는 <rd>gcc</rd>로 컴파일할 경우 다음과 같은 결과가 출력됩니다.

```c
inline int multi_inline(int a)
{
    return a * a;
}

int main(void)
{
    printf("%d\n", multi_inline(7));
}
```
<kkr>
    Undefined symbols for architecture arm64:<br />
    &nbsp;&nbsp;"_multi_inline", referenced from:<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_main in test-cc3cd3.o<br />
    ld: symbol(s) not found for architecture arm64<br />
    clang: error: linker command failed with exit code 1 (use -v to see invocation)<br />
</kkr>
<h2 style="color:#0e435c;">(2) 해결법찾기1: static키워드 사용</h2>

* `static`키워드를 붙여주면 링커가 찾을 수 있는 함수(사본)도 만들어 줍니다.

```c
static inline int multi_inline(int a)
{
    return a * a;
}
```

* 하지만 **C99**의 표준 inline함수 사용방법은 <rd>헤더파일(.h)</rd>에 인라인함수를 정의해서 사용하는 것입니다.
* `static`키워드를 사용한 inline함수를 <b>헤더파일(.h)</b>에 넣을 경우 인라인이 안됬을 경우를 대비한 <rd>사본함수들을 각각의 파일에 만들어줍니다.</rd> 메모리적으로 매우 비효율적이게 됩니다. 그 대신에 <rd>extern키워드</rd>를 사용하는 것이 좋습니다.
<h2 style="color:#0e435c;">(3) 해결법찾기2: extern키워드 사용</h2>

* `extern`키워드 역시 링커가 찾을 수 있는 함수(사본)도 만들어 줍니다.
* `extern`키워드를 단 inline함수를 <b>헤더파일</b>에 넣을 경우 `static`키워드를 사용했을때와 마찬가지로 <b>사본함수</b>를 각파일에 만들어줍니다. 때문에 메모리적으로 비효율적이며 추가적으로 다음과 같이 `duplicate symbol`오류가 생깁니다.(함수 중복문제)
<kkr>
    duplicate symbol '_multi' in:<br />
    &nbsp;&nbsp;&nbsp;&nbsp;/var/folders/z2/f7fpwgjj4qz90sv6mptq71500000gn/T/main-34ef2a.o<br />
    &nbsp;&nbsp;&nbsp;&nbsp;/var/folders/z2/f7fpwgjj4qz90sv6mptq71500000gn/T/power-1a3620.o<br />
    ld: 1 duplicate symbol for architecture arm64<br />
    clang: error: linker command failed with exit code 1 (use -v to see invocation)<br />
</kkr>
<br /><br />

* * *
<h1>3️⃣ 올바른 인라인함수 사용법</h1>

* 헤더파일에 inline함수를 정의해주고 그와 대응되는 인라인함수를 `extern키워드`를 달아 선언해준 파일을 별도로 만들어줍니다.

```c
/******** test.h ********/
#ifndef TEST_H
# define TEST_H

#include <stdio.h>

inline int multi(int a, int b)
{
    return a * b;
}

int power(int a, int b);

#endif
```
```c
/******** multi_inline.c ********/
#include "test.h"

extern inline int multi(int a, int b);
```
```c
/******** power.c ********/
#include "test.h"

int power(int a, int b)
{
    int result = 1;

    for (int i = 0; i < b; i++)
        result = multi(result, a);
    return result;
}

/******** main.c ********/
#include "test.h"

int main(void)
{
    int result;
    int result2;

    result = multi(3 + 2, 4);
    result2 = power(3, 4);
    printf("%d\n%d\n", result, result2);
}
```
<kkr>
    <rmk>/* 출력 */</rmk><br />
    20<br />
    81<br />
</kkr>
