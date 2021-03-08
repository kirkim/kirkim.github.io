---
layout: post
title:  "[ft_printf]가변 인자 함수(variadic function)"
subtitle:   ""
date: 2021-03-06 02:45:51 +0900
categories: 42seoul
tags: ft_printf
comments: true 
---

이번 포스트는 **가변 인자 함수(variadic function)**에 관한 내용입니다.

* * *
<h2>1️⃣ 가변 인자 함수란?</h2>
<span style="background-color: #0a2835; padding: 7px; font-size: 85%">&nbsp;&nbsp;&nbsp;<b style="color:#8fcaf1;">&lt;반환형&gt;</b>&nbsp;&nbsp;&nbsp;&nbsp;<b style="color:#b5ebb3f6;">&lt;함수명&gt;</b><b style="color:#ffffff;">&#40;</b><b style="color:#f5c118;">&lt;자료형이 고정된 매개변수&gt;</b><b style="color:#ffffff;">&#44;&nbsp;&nbsp;&#46; &#46; &#46;	&#41;&#59;</b>&nbsp;&nbsp;&nbsp;&nbsp;</span><br />
* **매개변수(가변 인자)를 개수**를 미리 고정시키지않고 임의대로 허용할 수 있는 함수입니다.
* 반드시 **최소 한 개**의 정해진 **자료형의 매개변수**가 필요합니다.
* 함수에 들어가는 인자의 개수가 변하는 것을 **가변 인자**라고 하며 <b>&#39; . . . &#39;</b>로 표현합니다.
<h4 align="middle" style="color:#0e435c;">&lt; 가변인자함수 예 &gt;</h4>
    
```c
int printf(const char* format, ...);
int scanf(const char* format, ...);
```

<br /><br />

* * *
<h2>2️⃣ 간단한 가변 인자 함수의 구현 예 <span style="color: #dd1144; font-size: 90%;">&#91; preview &#93;</span></h2>
<h4 align="middle" style="color:#0e435c;">&lt; 앞으로 알아볼 가변 인자함수로 구현한 간단한 숫자 출력함수 &gt;</h4>
```c
#include <stdio.h>
#include <stdarg.h>

void print_num(const size_t count, ...)
{
        va_list ap;
        int num;
        size_t i;

        va_start(ap, count);
        {
            for (i = 0; i < count; i++)
            {
                num = va_arg(ap, int);
                printf("%d: %d\n", i + 1, num);
            }
        }
        va_end(ap);
}

int main(void)
{
    print_num(4, 3, 6, 9, 12);

    return (0);
}
```
<kkr>
<span style="color: #999988; font-style: italic;">/*---출력---*/</span><br />
1: 3<br />
2: 6<br />
3: 9<br />
4: 12<br />
</kkr>

<br />

* * *
<h2>3️⃣ va_list</h2>
<h4 align="middle"><span style="background-color: #0a2835; padding: 7px; font-size: 110%">&nbsp;&nbsp;&nbsp;<b style="color:#27bd77;">va_list</b><b style="color:#8fcaf1;"> ap;</b>&nbsp;&nbsp;&nbsp;</span></h4>
* **가변 인자 목록**으로 `va_start()`, `va_arg()`, `va_end()` 와 같은 **매크로 함수**를 사용할 때 **필요한 정보**가 포함되어 있습니다.
* 함수로 전달되는 인수들은 스택으로 저장되며 하나씩 꺼내서 씁니다. **va_list형**은 매개변수를 차례로 가리키는 포인터 변수를 정의할 때 사용됩니다.
* **C표준**에서 정확히 명시되지않은 **자료형**입니다. 그러기 때문에 운영체제나 컴파일러에 구현이 다를 수 있습니다.
* 이번 포스트에서는 **va_list**의 **변수명**으로 <b>매개변수 포인터(argument pointer)</b>의 첫 글자만을 따서 **ap**로 선언해 주었습니다.

<br />

* * *
<h2>4️⃣ va_start</h2>
<span style="background-color: #0a2835; padding: 7px; font-size: 85%">&nbsp;&nbsp;&nbsp;<b style="color:#2889b6;">va_start&nbsp;</b><b style="color:#ffffff;">&#40;&nbsp;</b><b style="color:#fcaf4c;">&#60;가변 인자 목록&#62;<b style="color:#ffffff;">&#44;&nbsp;&nbsp;</b><b style="color:#47be4d;">	&#60;가변 인자 시작하기 직전 매개변수&#62;</b><b style="color:#ffffff;">&nbsp;&#41;</b></b>&nbsp;&nbsp;&nbsp;</span><br />

* `va_start`는 **매크로 함수** 입니다.
* 함수 매개변수로 들어온 **가변 인자**들에 접근하기 전에 <b style="color:#dd1144;">반드시 호출</b>해야 되며 **매개변수** 중에서 **이름을 가진 것**이 <b style="color:#dd1144;">적어도 하나</b>는 있어야 합니다. **이름 붙여진 매개변수** 중 **마지막** 것은 `va_start`를 시작하기 위해 사용됩니다.
* 매크로 `va_start`는 첫 번째 이름 없는 매개변수를 가리키도록 **ap**의 초깃값을 설정합니다.

<br />

* * *
<h2>5️⃣ va_end</h2>
<span style="background-color: #0a2835; padding: 7px; font-size: 85%">&nbsp;&nbsp;&nbsp;<b style="color:#2889b6;">va_end&nbsp;</b><b style="color:#ffffff;">&#40;&nbsp;</b><b style="color:#fcaf4c;">&#60;가변 인자 목록&#62;<b style="color:#ffffff;">&nbsp;&#41;</b></b>&nbsp;&nbsp;&nbsp;</span><br />

* `va_end`는 **매크로 함수** 입니다.
* 사용했던 가변 인자 목록을 **청소**해줍니다.
* 함수가 **리턴**되기 전에 반드시 호출되어야 합니다.

<br />

* * *
<h2>6️⃣ va_arg</h2>
<span style="background-color: #0a2835; padding: 7px; font-size: 85%">&nbsp;&nbsp;&nbsp;<b style="color:#2889b6;">va_arg&nbsp;</b><b style="color:#ffffff;">&#40;&nbsp;</b><b style="color:#fcaf4c;">&#60;가변 인자 목록&#62;<b style="color:#ffffff;">&#44;&nbsp;&nbsp;</b><b style="color:#47be4d;">	&#60;얻어올 가변 인자의 자료형&#62;</b><b style="color:#ffffff;">&nbsp;&#41;</b></b>&nbsp;&nbsp;&nbsp;</span><br />

* `va_arg`는 **매크로 함수** 입니다.
* **va_arg**를 호출하면 **하나의 매개변수**를 **리턴**하고 **ap**가 다음 매개변수를 가리키게 합니다.
* **va_arg**는 **어떤 자료형**이 리턴될 것이며, **ap**가 **얼마나 전진**해야 될지를 결정하기 위해 **자료형**을 참고합니다.
* 예전 표준상의 문제로 가변 인자 목록의 기본 자료형 인자들은 다음과 같이 승격(promotion)됬습니다.
    * 모든 **정수형**은 `int`형으로
    * 모든 **부동소수점**은 `double`형으로

<br /><br />

* * *
<h2>7️⃣ 특징</h2>
<h4 style="color:#0e435c;">(1) 매크로함수로 구현?</h4>
* `va_start`, `va_end`, `va_arg`는 **일반 함수**같지만 사실상 **매크로 함수**입니다.
* **C언어**에서 실행 중에 자동으로 자료형을 판단하는 기능이 없습니다. 따라서 **매크로**형식으로 선언된 함수들을 **전처리기**에서 구현 코드로 대체시켜줌으로써 자료형을 판단해서 동작하는 것 처럼 구현이 되어 있습니다.

<h4 style="color:#0e435c;">(2) 가변 인자 작성 규칙</h4>
* 가변 인자`. . .`앞에 자료형이 특정된 매개변수가 반드시 있어야 합니다.
<br />다음과 같은 경우는 <b style="color:#dd1144;">컴파일 오류</b>가 납니다.
```c
void sample_vf(..., int);        //컴파일 오류
void sample_vf(int, ..., int);   //컴파일 오류
```

<h4 style="color:#0e435c;">(3) 가변 인자 갯수</h4>
* **가변 인자**는 **va_arg함수**가 시키는대로 하나씩 주소를 늘려가며 읽을 뿐입니다.
* **가변 인자 함수**는 **가변 인자**가 몇개인지 모릅니다. (위의 **2번**의 샘플코드는 `count`변수를 통해 갯수를 파악하고 제어했습니다.)

<h4 style="color:#0e435c;">(4) 가변 인자의 자료형</h4>
* **실행 중**에 어떤 형의 가변 인자인지 결정됩니다.
* **가변 인자 함수 자체**는 스택의 **어떤 위치**를 **어떤 형**으로 읽어야할 지 모릅니다. 그래서 <b style="color:#dd1144;">정해진 자료형으로 넘겨받은 매개 변수</b>로 부터 알아내야 합니다.
```c
va_arg(ap, int); // 넘겨받은 두번째 매개변수(int)로 자료형을 판단
```
만약 잘못된 **자료형**으로 읽는다고 해도 **넘겨받은 매개변수(자료형)**의 크기에 충실하여 읽습니다. <b style="font-size: 85%">(int형(4바이트)을 char형(1바이트)으로 읽는 경우가 가능합니다. 가변인자는 남은 3바이트를 가리킴)</b>

<h4 style="color:#0e435c;">(5) 서식자, 갯수를 잘못 작성해도 그대로 실행(실수할 가능성이 큼)</h4>
* **매크로형식**으로 구현되어 있다보니 위의 경우처럼 **va_arg**가 시키는데로 읽습니다. 비슷한 이유로 **서식자를** 잘못쓰거나 **갯수**를 잘못입력해도 **컴파일 전**에 알지 못합니다.
하지만 **컴파일러**자체에서 <b style="color:#dd1144;">이와같은 사용자 실수</b>를 판단해서 **오류를 출력**해주기도 합니다.
<h4 align="middle" style="color:#0e435c;">&lt; (특정 컴파일러) 컴파일러 자체가 서식자를 비교해서 오류출력 &gt;</h4>
<kkr>
test.c:6:14: <span style="color: #ad25a2;">warning:</span> more '%' conversions than data arguments [-Wformat]<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;printf("%d %s", num);<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #1f2020;">printf("%d </span><span style="color: #009926;">~^</span>
</kkr>

<br /><br />

* * *
<h2>8️⃣ 간단한 버전의 printf함수 구현</h2>
`'d'(정수형)`,`'f'(실수형)`같은 경우 출력하기 위해서는 추가적으로 **문자형**으로 변환하는 함수가 필요합니다. 하지만 이번 구현은 <b style="color:#dd1144;">가변 인자 함수를 이용하는 것이 주목적</b>이기 때문에 **정수,실수형**출력은 **printf함수**를 이용했습니다.
<h4 align="middle" style="color:#0e435c;">&lt; minprintf함수 &gt;<span style="font-size:70%;">(출처:Kernighan, The C Programming Language)</span></h4>
```c
#include <stdio.h>
#include <stdarg.h>

void minprintf(char *fmt, ...)
{
    va_list ap;
    char *p, *sval;
    int ival;
    double dval;

    va_start(ap, fmt);
    {
        for (p = fmt; *p; p++)
        {
            if (*p != '%')
            {
                putchar(*p);
                continue;
            }
            switch (*++p)
            {
                case 'd':
                    ival = va_arg(ap, int);
                    printf("%d", ival);
                    break;
                case 'f':
                    dval = va_arg(ap, double);
                    printf("%f", dval);
                    break;
                case 's':
                    for (sval = va_arg(ap, char *); *sval; sval++)
                        putchar(*sval);
                    break;
                default:
                    putchar(*p);
                    break;
            }   
        }
    }
    va_end(ap);
}
```

<h4 align="middle" style="color:#0e435c;">&lt; main함수 &gt;</h4>
```c
int main(void)
{
    minprintf("%d %d", 3, 34);
    printf("\n");
    minprintf("%f", 3.14);
    printf("\n");
    minprintf("%s %d", "hello!", 3);
    printf("\n");
}
```

<kkr>
<span style="color: #999988; font-style: italic;">/*---출력---*/</span><br />
3 34<br />
3.140000<br />
hello! 3<br />
</kkr>