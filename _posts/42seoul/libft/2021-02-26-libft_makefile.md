---
layout: post
title:  "[libft](4)Makefile"
subtitle:   ""
date: 2021-02-26 02:45:51 +0900
categories: 42seoul
tags: libft
comments: true
---

이번 포스트는 **libft**에 사용할 Makefile 구현에 관한 내용입니다.

* * *
<h2>1️⃣ Makefile 이란?</h2>
* **linux**에서 반복 적으로 발생하는 컴파일을 쉽게 하기위해 사용하는 make 프로그램의 설정 내용이 적힌 **기술 파일**입니다. (윈도우의 경우 **mingw**(윈도우용 gcc패키지)를 다운받고 `mingw32-make.exe`로 사용하면 됩니다.)
* `make`를 이용하면 **반복적 명령의 자동화로 시간절약 및 실수 최소화**할 수 있고, **프로그램 관리가 용이**하다는 장점이 있습니다.
* 이번 **Makefile**은 최종적으로 **오브젝트파일(.o)**들을 모아 **libft.a(나만의 라이브러리)**를 만들도록 구현할 계획입니다. 굳이 **오브젝트파일(.o)**로 만든뒤 **라이브러리**로 묶어주는 이유는 <a href="https://kirkim.github.io/c/2021/02/10/c_build_process.html" target="blank">( C언어 빌드과정 )</a>포스트에서 **"어셈블 단계"**의 내용을 참고하면 됩니다.
* 파일명을 `Makefile`로 생성해주면 됩니다.

* * *
<h2> 2️⃣ Makefile 매크로 작성</h2>
* Makefile의 **매크로 설정**은 **함수**에서의 **상수 선언**과 비슷한 개념입니다.
* 반드시 필요한 것은 아니지만 기존 매크로의 기능과 같이 **가독성**이 좋아지고 **수정이 편리**해진다는 장점이 있습니다.
<h4 align="middle">&#60; libft의 Makefile의 매크로부분을 단순화시킨 코드 &#62;</h4>
```c
NAME	      = libft.a

CC		= gcc
CFLAG	      = -Wall -Wextra -Werror

RM		= rm -f

AR		= ar
ARFLAGS       = crs

INCLUDES	= ./libft.h 

SRCS	      = ft_strlcpy.c		\
	        ft_strlcat.c		\
            /*
            ...
            .c파일을 나열
            ...
            */

OBJS	    = $(SRCS:.c=.o)
```
* `=`기호로 매크로를 설정할 수 있습니다.
* **&lt;NAME&gt;:** &nbsp;&nbsp;관습적으로 최종적으로 만들 라이브러리의 이름을 `NAME`으로 지정해두어 가장 윗줄에 작서해 줍니다.
* **&lt;CC&gt;:** &nbsp;&nbsp;gcc나 clang과 같이 사용할 컴파일 명령어 매크로입니다.
* **&lt;AR&gt;:** &nbsp;&nbsp;파일들을 모아 아카이브(라이브러리)파일로 압축을 해주는 명령어의 매크로입니다.<br />.c파일도 압축이 가능하지만 목적에 맞게 사용하기 위해서는 **오브젝트파일(.o)파일**만을 압축하여 **라이브러리 파일**을 만듭니다.
* **&lt;FLAGS&gt;:** &nbsp;&nbsp;명령어의 옵션이 담겨있는 매크로입니다.
* **&lt;RM&gt;:** &nbsp;&nbsp;삭제 명령어 매크로입니다.(리눅스: rm, 윈도우(cmd): del)
* **&lt;INCLUDES&gt;:** &nbsp;&nbsp; **헤더파일** 매크로입니다.
* **&lt;SRCS&gt;:** &nbsp;&nbsp;**.c파일**들의 모음 **공백**으로 구분하여 여러개의 파일들을 매크로로 등록이 가능합니다.
* **&lt;OBJS&gt;:** &nbsp;&nbsp;**.o파일**들이 모음 매크로, 일리리 작성해도 되지만 `$(SRCS:.c=.o)`와 같이 작성하는 것이 간편합니다. `$`기호를 붙이면 해당 매크로를 불러올 수 있습니다. `$(SRCS:.c=.o)`는 SRCS매크로에 지정된 것들을 불러오되 모든 `.c`부분을 `.o`로 바꿔서 불러온다는 뜻입니다.

* * *
<h2> 3️⃣ Makefile 명령어</h2>
* `make`에 사용될 명령어들을 **Makefile**에 규칙에 맞게 작성해야 됩니다.
<h4 align="middle">&#60; Makefile 규칙을 단순화시킨 예 &#62;</h4>
```c
(타겟) : (재료1) (재료2) (재료3)
    (터미널명령어)
```
*  `make (타겟)`으로 입력하는 식으로 명령어를 수행할 수 있습니다. 만약 단순히 `make`로만 명령어를 입력하면 가장 위쪽에 위치한 타겟 명령어가 실행됩니다.

* * *
<h4 align="middle">&#60; libft의 Makefile의 명령어부분 코드 &#62;</h4>
```c
all : $(NAME)

%.o : %.c
	$(CC) $(CFLAG) -c $< -o $@

clean :
	$(RM) $(RMFLAG) $(OBJS) $(OBJS_BONUS)

fclean : clean
	$(RM) $(RMFLAG) $(NAME)

re : fclean all

$(NAME) : $(OBJS)
	$(AR) $(ARFLAGS) $@ $^

.PHONY : all clean fclean re
```
1. **&lt;all&gt;:** &nbsp;&nbsp; 이번 **libft**과제에서는 가장 위쪽에 `all`타겟을 작성하여 최종적으로 만들어줄 **libft.a**의 매크로인 **NAME**을 `$(NAME)`으로 불러왔습니다. **make프로그램**은 똑똑하기 때문에 `$(NAME)`타겟을 찾아서 명령어를 수행합니다. `$(NAME)`의 재료로 `$(OBJS)`가 있습니다. **make프로그램**은 또다시 OBJS를 찾게 되고 `%.o : %c`규칙을 찾아내어 명령어를 수행합니다.
<br /><br />
2. **&lt;%.o : %.c&gt;:** &nbsp;&nbsp; 전통적인 표현법으로는 `.c.o`이 였습니다. 하지만 **GNU버전의 make프로그램은** `%.o: %.c`와 같은 확장문법을 지원합니다. 둘다 같은 기능을 수행하지만 다른 규칙들과 비교해 봤을때 `%.o: %.c`와 같이 표현하는 것이 논리적입니다. **Make**는 똑똑하기 때문에 **.o파일**이 필요하게 되면 타겟을 찾아 명령어를 자동으로 수행해줍니다.
```c
%.o : %.c
    $(CC) $(CFLAG) -c $< -o $@
```
`$<`는 **첫재료**를 뜻하고 `$@`는 **타겟**을 가리킵니다. `%`는 **동일한 이름**으로 매칭시켜줍니다.
예를 들어 `ft_strlcpy.o`와`ft_strjoin.o`파일이 필요하다면 Makefile은 %.o 타겟을 찾아내고 다음과 같이 명령어를 수행할 것입니다.
```c
gcc -Wall -Wextra -Werror -c ft_strlcpy.c -o ft_strlcpy.o
gcc -Wall -Wextra -Werror -c ft_strjoin.c -o ft_strjoin.o
```
하지만 요즘 make프로그램은 `%.o: %.c`와 같은 규칙을 작성해주지 않아도 다음과 같이 기본적인 옵션으로 오브젝트파일(.o)을 만드는 명령어를 수행시켜줍니다.
```c
gcc -c -o ft_strlcpy.o ft_strlcpy.c
gcc -c -o ft_strljoin.o ft_strljoin.c
```

3. **&lt;clean&gt;:** &nbsp;&nbsp;생성된 **오브젝트 파일**을 **삭제**해주는 타겟입니다.
4. **&lt;fclean&gt;:** &nbsp;&nbsp;생성된 **오브젝트 파일**과 **라이브러리 파일**을 **삭제**해주는 타겟입니다.
5. **&lt;re&gt;:** &nbsp;&nbsp;**fclean**타겟과 **all**타겟을 순차적으로 진행해줍니다.
6. **&lt;.PHONY&gt;:** &nbsp;&nbsp;이 규칙은 공백으로 구분된 재료들의 이름을 **파일명**대신 **타겟**으로 인식하게 합니다.**(기본적으로 타겟과 동일한 이름을 가진 파일을 만들어서는 안됩니다.)**

* * *
<h2>4️⃣ 최종 libft의 Makefile</h2>
```c
NAME	      = libft.a

CC		= gcc
CFLAG	      = -Wall -Wextra -Werror

RM		= rm -f

AR		= ar
ARFLAGS       = crs

INCLUDES	= ./libft.h 

SRCS_1	=       ft_strlen.c		\
		  ft_strlcpy.c		\
		  ft_strlcat.c		\
		  ft_strchr.c		\
		  ft_strnstr.c		\
		  ft_strncmp.c		\
		  ft_strdup.c		\
		  ft_strrchr.c		\
		  ft_memset.c		\
		  ft_memcpy.c		\
		  ft_memccpy.c		\
		  ft_memmove.c		\
		  ft_memchr.c		\
		  ft_memcmp.c		\
		  ft_bzero.c		\
		  ft_atoi.c		\
		  ft_calloc.c		\
		  ft_isalnum.c		\
		  ft_isalpha.c		\
		  ft_isascii.c		\
		  ft_isdigit.c		\
		  ft_isprint.c		\
		  ft_strdup.c		\
		  ft_tolower.c		\
		  ft_toupper.c		\
			
SRCS_2	=       ft_substr.c		\
		  ft_strjoin.c		\
		  ft_strtrim.c		\
		  ft_split.c		\
		  ft_strmapi.c		\
		  ft_itoa.c		\
		  ft_putchar_fd.c	\
		  ft_putstr_fd.c	\
		  ft_putendl_fd.c	\
		  ft_putnbr_fd.c	\

SRCS_BN =       ft_lstnew.c		\
		  ft_lstsize.c		\
		  ft_lstadd_front.c	\
		  ft_lstadd_back.c	\
		  ft_lstclear.c	\
		  ft_lstlast.c		\
		  ft_lstiter.c		\
		  ft_lstmap.c		\
		  ft_lstdelone.c	\

SRCS	= $(SRCS_1)			\
	  $(SRCS_2)			\

OBJS	= $(SRCS:.c=.o)

OBJS_BONUS = $(SRCS_BN:.c=.o)

all : $(NAME)

%.o : %.c
	$(CC) $(CFLAG) -c $< -o $@

clean :
	$(RM) $(RMFLAG) $(OBJS) $(OBJS_BONUS)

fclean : clean
	$(RM) $(RMFLAG) $(NAME)

re : fclean all

$(NAME) : $(OBJS)
	$(AR) $(ARFLAGS) $@ $^

bonus : $(OBJS) $(OBJS_BONUS)
	$(AR) $(ARFLAGS) $(NAME) $^

 .PHONY : all clean fclean re
 ```

* * *
<h2>5️⃣ libft의 make명령어</h2>
* **make:** &nbsp;&nbsp;처음 명령어 실행시 모든.c파일의 오브젝트파일(.o)이 생성됬으며 그 오브젝트파일(.o)을 아카이브(.a)파일로 묶어 주었습니다. **만약 특정 .c파일을 수정**하게 되면 수정한 .c파일만을 새롱누 오브젝트파일(.o)로 수정하여 기존 오브젝트파일과 묶어 주었습니다.
<h4 align="middle">&#60;memcpy.c파일을 수정하고 make명령어를 실행했을때(터미널)&#62;</h4>
```c
$>make

gcc -c -o ft_memcpy.o ft_memcpy.c
ar crs libft.a ft_strlen.o ft_strlcpy.o ft_strlcat.o
/* .o 파일 생략 */
ft_itoa.o ft_putchar_fd.o ft_putstr_fd.o ft_putendl_fd.o
```
<br />
<h4 align="middle">&#60;수정할 파일이 없을때 make명령어 실행(터미널)&#62;</h4>
```c
$>make

make: Nothing to be done for `all'.
```
* **기타명령어:** &nbsp;&nbsp;`make clean`, `make fclean`, `make re`, `make bonus`명령어는 수정없이 중복실행하여도 특별한 오류출력없이 명령을 수행했습니다.
* 최종적으로 만들어준 **libft.a**라이브러리에 담긴 함수를 사용한 **main.c**파일을 다음과 같이 컴파일하여 사용할 수 있게 됩니다.
```c
$> gcc main.c libft.a
```
**main함수파일(main.c)** 또한 라이브러리에 함께 묶어서 사용할 수 있습니다.
```c
$> gcc libft.a //main.c가 포함된 라이브러리
```

* * *
<h2>6️⃣ Makefile을 마무리하며</h2>
**Makefile**에 대한 내용은 이것보다 훨씬 많을 것입니다. 하지만 이번에 libft과제에서 사용한 Makefile의 규칙들이 가장 기본적이면서도 중요한 규칙일 것이라고 생각합니다.

* * *
<br /><br />
<h2><span style="color:#084B8A;">이전포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/24/list_func.html" target="blank"> [libft](3)리스트 함수</a></h2>