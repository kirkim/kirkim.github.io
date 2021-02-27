---
layout: post
title:  "[getnextline](1)헤더파일 만들기"
subtitle:   ""
date: 2021-02-27 02:45:51 +0900
categories: 42seoul
tags: get_next_line
comments: true
---

이번 포스트는 **get_next_line**에 내장할 헤더파일(.h)에 관한 내용입니다.

* * *
<h2>1️⃣ get_next_line.h</h2>
<h4 align="middle">&#60; 함수구현 &#62;</h4>

```c
#ifndef GET_NEXT_LINE_H
# define GET_NEXT_LINE_H

# ifdef _WIN32
#  include <io.h>
# else
#  include <unistd.h>
# endif

# include <stdlib.h>  //malloc함수 선언
# include <limits.h>  //OPEN_MAX 선언

# ifndef OPEN_MAX
#  define OPEN_MAX 10240
# endif

# ifndef BUFFER_SIZE
#  define BUFFER_SIZE 4
# endif

# define FT_EOF 0
# define FT_SUCCESS 1
# define FT_FAIL -1

int     get_next_line(int fd, char **line);
char    *ft_strjoin(char const *s1, char const *s2);
void    *ft_memcpy(void *dst, const void *src, size_t num);
size_t  ft_strlen(const char *str);
char    *ft_strndup(const char *str, ssize_t offst);

#endif
```
* **&lt;ifdef _WIN32&gt;:** &nbsp;&nbsp;
    * `ifdef A`는 만약 A가 정의 되있으면 구문에 들어오게됩니다.
    * `_WIN32`는 **윈도우32비트 운영체제**를 뜻하며 **64비트 운영체제도 포함**합니다.
    * get_next_line프로그램 안에 사용할 저수준입출력함수는 리눅스에서는 `<unistd.h>`헤더에 윈도우에서는 `<io.h>`헤더에 선언되어 있습니다. 그렇기 때문에 두운영체제에서 호환시키기 위해 **ifdef ~eneif**매크로로 처리하였습니다.
* **&lt;OPEN_MAX&gt;:** &nbsp;&nbsp;open함수가 열 수 있는 최대 파일갯수의 매크로이며 `<limits.h>`헤더에 선언되어 있습니다. **저수준입출력함수**는 **유닉스계열**의 함수이기 때문에 운영체제에 따라 선언되지 않는 경우가 있습니다. **ifndef ~endif**매크로 처리로 **OPEN_MAX**가 선언되어 있지 않는 다면 10240으로 선언하도록 처리했습니다.(맥os환경에서 10240으로 선언 되어있습니다.)
* **&lt;BUFFER_SIZE&gt;:** &nbsp;&nbsp; `read함수`를 이용하여 한번에 읽어들일 크기를 결정합니다. get_next_line프로그램은 다양한 크기(유효한 값)로 읽어 들여와도 문제없이 작동해야합니다.
* **&lt;EOF, SUCCESS, FAIL&gt;:** &nbsp;&nbsp; **EOF**일때 0,**성공**할때 1 그리고 **에러**가 날때 -1을 반환할 예정입니다. 코드의 가독성을 좋게 하기위해 매크로를 만들어 주었습니다.

* * *
<br /><br />
<h2><span style="color:#084B8A;">다음포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/26/gnl_util_func.html" target="blank"> [getnextline](2)Util함수 구현</a></h2>