---
layout: post
title:  "[libft](1)헤더파일 만들기"
subtitle:   ""
date: 2021-02-24 02:45:51 +0900
categories: 42seoul
tags: libft
comments: true
---

이번 포스트는 **libft**과제중 헤더(.h)파일에 관한 내용입니다.

**libft**는 `Makefile`, `Headerfile(.h)`, 그리고 `C파일(.c)`들을 구현하여 나만의 라이브러리를 만드는 과제입니다.

* * *
<h2>헤더파일(libft.h)</h2>

먼저 **libft(나만의 라이브러리)**에 들어갈 함수들을 선언해주는 헤더파일을 구현해 볼 예정입니다.

* * *
<h2>1️⃣ 헤더 파일(.h)이란? </h2>
* 여러 소스코드 파일에 공통적으로 필요한 것들을 저장해 두는 파일입니다.<br />
(함수 선언, 매크로, extern 변수 선언 등..)
* `#include`로 헤더파일을 호출이 가능합니다.
* **전처리과정**을 거쳐서 헤더파일의 내용이 확장되어 작성됩니다.<br />
**전처리과정**에 대한 내용은 <a href="https://kirkim.github.io/c/2021/02/10/c_build_process.html" target="blank">( C언어 빌드과정 )</a>포스트에서 알 수있습니다.

* * *
<h2>2️⃣ #infdef를 이용한 header중복방지 </h2>
<h3 align="left">(1) header 중복방지가 필요한 이유(예시)</h3>
<h4 align="middle">&lt; one.h &gt;</h4>
```c
#include "two.h"
/* one헤더파일 코드 생략 */
```
<h4 align="middle">&lt; two.h &gt;</h4>
```c
#include "one.h"
/* two헤더파일 코드 생략 */
```
<h4 align="middle">&lt; test.c &gt;</h4>
```c
#include "one.h"

int main(void)
{
	printf("Hello world!\n");
	return (0);
}
```

* * *
위의 세파일을 만들고 `test.c`파일을 **전처리 단계**만을 거치면 다음과 같이 무한으로 헤더가 확장됩니다.
<h4 align="middle">&lt; 전처리 단계를 거친후 test.c &gt;</h4>
```c
           ...
           ...
/* one헤더파일 코드 생략 */
/* two헤더파일 코드 생략 */
/* one헤더파일 코드 생략 */
           ...
           ...
/* two헤더파일 코드 생략 */
/* one헤더파일 코드 생략 */
/* two헤더파일 코드 생략 */
/* one헤더파일 코드 생략 */

int main(void)
{
	printf("Hello world!\n");
	return (0);
}
```
* `one.h가 two.h를 복붙` -&gt; `two.h가 one.h을 복붙`...을 끝도 없이 반복하게 됩니다.(컴파일러가 강제로 멈춤)
* 보통 이것을 **순환 헤더 인클루드(circular header include)**라고 합니다.**("헤더가 꼬였다")**
* 그렇기 때문에 `#include`는 되도록이면 .c에서만 하는 것이 좋습니다. 하지만 어쩔 수없이 헤더 파일을 서로 인클루드해야 할 일이 있습니다.
* 이러한 **순환 헤더 인클루드**는 `#ifndef`를 사용하여 방지할 수 있습니다.

* * *
<h3 align="left">(2) #ifndef 이중헤더방지 매크로 구현 </h3>
* `#ifndef A`는 A매크로가 **"정의되어 있지 않다면"** `#endif`까지의 코드를 실행하게 됩니다.<br />(`#ifdef A`는 반대로 A매크로가 **"정의되어 있으면"**입니다.)
* `#ifndef ~~ #end`안에 들어 왔다면 `#define A`로 A매크로를 정의해주어 다시한번 `#ifndef A`를 만났을 때 들어오지 못하게 합니다.
<h4 align="middle">&lt; libft.h &gt;</h4>

```c
#ifndef LIBFT_H
# define LIBFT_H

/* 
코드 생략
*/

#endif
```
이제 이 코드안에 원하는 함수선언, 매크로 등등을 구현하면 됩니다.

<h2>3️⃣ 함수를 헤더파일에 선언 </h2>
```c
void A(void);

int main(void)
{
	A();  // A함수의 원형을 알아야 컴파일을 통해 구멍이라도 만들 수 있다.
}

void A(void)
{
	/* 코드생략 */
}
```
* **C언어 빌드과정**에서 링크단계에서 **구멍을 매꾸는 작업**을 한다고 배웠습니다. 컴파일러가 코드의 위쪽부터 읽기 때문에 위의 코드예시경우 `void A(void);`처럼 함수원형을 선언해주지 않는다면 `main함수`내부에 있는 `A()함수`가 무엇인지 알 수 없게 되고 **구멍**조차 만들어줄 수 없게 됩니다.
* `A()함수`를 `main함수` 위쪽에 위치시키는 것이 좋겠지만 함수의 수가 많아질 경우 복잡하고 실수할 가능성이 큽니다. 그렇기 때문에 함수원형을 위쪽에 선언시키는쪽이 안전한 방법입니다.
* **전처리단계**에서는 **헤더파일**을 확장시켜 **기존 함수**에 복붙을 시켜줍니다. 그렇기에 **헤더파일**에 함수를 선언한다면 **기존 함수**에 선언한 것처럼 사용할 수 있게 됩니다.
* **베스트 프렉티스**는 모든 필요함수들을 **헤더파일에 선언**하고 링크단계에서 알아서 구멍을 매꿔 사용하게 하는 것입니다.

<h2>4️⃣ libft.h 최종구현 </h2>
```c
#ifndef LIBFT_H
# define LIBFT_H

# include <stdlib.h>
# include <unistd.h>

typedef struct	s_list       //구조체를 이용한 리스트함수 (뒤에서 다룰예정)
{
	void			*content;
	struct s_list	*next;
}				t_list;

/*
*** String
*/
size_t		ft_strlen(const char *str);
size_t		ft_strlcpy(char *dst, const char *src, size_t len);
size_t		ft_strlcat(char *dst, const char *src, size_t len);
char		*ft_strchr(const char *str, int character);
char		*ft_substr(char const *str, unsigned int start, size_t len);
char		*ft_strnstr(const char *big, const char *little, size_t len);
char		*ft_strdup(const char *str);
char		*ft_strjoin(char const *s1, char const *s2);
char		*ft_strtrim(char const *s1, char const *set);
char		**ft_split(char const *s, char c);
char		*ft_strmapi(char const *s, char (*f)(unsigned int, char));
char		*ft_strrchr(const char *s, int c);
int		ft_strncmp(const char *s1, const char *s2, size_t len);

/*
*** Memory
*/
void		*ft_memset(void *ptr, int value, size_t num);
void		*ft_memcpy(void *dst, const void *src, size_t num);
void		*ft_memccpy(void *dst, const void *src, int c, size_t num);
void		*ft_memmove(void *dst, const void *src, size_t num);
void		*ft_memchr(const void *ptr, int c, size_t num);
void		ft_bzero(void *ptr, size_t num);
int		ft_memcmp(const void *s1, const void *s2, size_t num);

/*
*** Etc
*/
void		*ft_calloc(size_t num, size_t size);
void		ft_putchar_fd(char c, int fd);
void		ft_putstr_fd(char *s, int fd);
void		ft_putendl_fd(char *s, int fd);
void		ft_putnbr_fd(int n, int fd);
char		*ft_itoa(int n);
int		ft_atoi(const char *str);
int		ft_isalnum(int character);
int		ft_isalpha(int character);
int		ft_isascii(int character);
int		ft_isdigit(int character);
int		ft_isprint(int character);
int		ft_tolower(int character);
int		ft_toupper(int character);

/*
*** List
*/
t_list		*ft_lstmap(t_list *lst, void *(*f)(void *), void (*del)(void *));
t_list		*ft_lstnew(void *content);
t_list		*ft_lstlast(t_list *lst);
void		ft_lstadd_front(t_list **lst, t_list *new);
void		ft_lstadd_back(t_list **lst, t_list *new);
void		ft_lstiter(t_list *lst, void (*f)(void *));
void		ft_lstdelone(t_list *lst, void (*del)(void *));
void		ft_lstclear(t_list **lst, void (*del)(void*));
int		ft_lstsize(t_list *lst);

#endif
```
이렇게 최종적으로 구현한 libft헤더파일은 `#include "libft.h"`를 통해 호출할 수 있게 됩니다.

* * *
<br /><br />
<h2><span style="color:#084B8A;">다음포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/24/func.html" target="blank"> [libft](2)내장함수 구현</a></h2>