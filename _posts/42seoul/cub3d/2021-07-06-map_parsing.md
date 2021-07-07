---
layout: post
title:  "[cub3d](11)(.cub)파일 파싱하기"
subtitle:   ""
date: 2021-07-06 02:45:51 +0900
categories: 42seoul
tags: cub3d
comments: true 
---

* * *
<h1>1️⃣ 목표</h1>

* **.cub**형식의 파일의 내용에 따라 **맵을 파싱하기 이전**에 <rd>내용을 변수에 담는</rd>코드를 구현할 예정입니다.
* <b><rd>적절한 .cub파일</rd></b>은 다음의 내용을 포함해야 합니다. <b style="font-size:85%">(보너스 구현은 일단 제외)</b>
    1.  **NO(북), SO(남), WE(서), EA(동)**의 <rd>xpm파일 경로</rd>
    2.  **F(바닥), C(천장)**의 <rd>색깔</rd>
    3.  **0, 1, N, S, E, W**로 구성된 <rd>지도 배열</rd>
* <b><rd>.cub파일</rd></b>는 다음과 같은 규칙으로 적혀 있어야합니다.
<kkr>
NO texture/NO.xpm<br>
SO texture/SO.xpm<br>
WE texture/WE.xpm<br>
EA texture/EA.xpm<br>
<br>
F 0,100,222<br>
C 97,144,0<br>
<br>
1111111111111111111111111<br>
1000000111110000000000001<br>
1011000001110000010000001<br>
1001001100000000000000001<br>
1110001110110000011100001<br>
100000N000110000011101111<br>
1000000000000000110101001<br>
1100000111010101111101111<br>
1111111111111111111111111<br>
</kkr>
<br><br>

* * *
<h1>2️⃣ 파싱관련 구조체 선언</h1>

```c
typedef struct  s_texture
{
    char		*tex_path;
    int			*texture;
    double		width;
    double		height;
}               t_texture;

typedef struct  s_parse
{
    t_texture   tex[TEXTURE_COUNT];
    int         floor_color;
    int         ceiling_color;
    char        *temp_map;
    char        **map;
    int         row;
    int         col;
}               t_parse;
```

* `t_parse`구조체에 **맵 좌표(2차원 배열형식)**, **천장, 바닥색**, **texture관련 구조체**변수들을 담았습니다.
* `t_texture`구조체는 **xpm파일을 mlx내장함수로 로딩**하는데 필요한 변수들이 담겨져있습니다.
<br><br>

* * *
<h1>3️⃣ 메인 파싱 함수</h1>

* **파싱함수**는 <rd>메모리 누수</rd>관리도 해주어야하며 다소 복잡합니다.
* 그렇기 때문에 **세부적인 함수**부터 구현해나가는 것보다 어떤식으로 .cub파일을 읽어올지 <rd>큰틀을 잡고 중심이되는 파싱함수</rd>부터 구현하는 것이 좋습니다.

<kkr>
<b style="color:#2f79ce">int</b> <b style="color:#5cce2f">parse_file</b>(<b style="color:#2f79ce">t_god</b> <b style="color:#CB7800">*god</b>, <b style="color:#009999">const char</b> <b style="color:#CB7800">*cub_file_path</b>)<br>
{<br>
&nbsp;&nbsp;&nbsp;&nbsp;<b style="color:#CC0000">if문</b><b style="color:#AAAAAA">(cub파일 경로명이 올바른지 확인)</b><br>
&nbsp;&nbsp;&nbsp;&nbsp;<b style="color:#CC0000">if문</b><b style="color:#AAAAAA">(open함수를 이용해서 경로의파일을 불러오는 코드)</b><br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;<b style="color:#CC7700">while문</b><b style="color:#AAAAAA">(get_next_line함수를 이용하여 한줄씩 읽어옴)</b><br>
&nbsp;&nbsp;&nbsp;&nbsp;{<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style="color:#CC0000">if문</b><b style="color:#AAAAAA">(빈줄발견시 스킵)</b><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style="color:#CC0000">if문</b><b style="color:#AAAAAA">(각줄의 정보의 종류를 판별)</b><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style="color:#CC0000">if문</b><b style="color:#AAAAAA">(판별한 정보의 종류에 따라 변수에 저장)</b><br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;&nbsp;&nbsp;return (SUCCESS);<br>
}<br>
</kkr>

* 위의 <rd>메인 파싱 함수</rd>의 설계방향에 따라 다음 함수들을 구현해 나갈 계획입니다.
    1.  `is_cub_file()`: .cub파일명 체크
    2. `check_parse_type()`: 각줄의 정보의 종류를 판별
    3. `do_parsing()`: 판별 정보를 토대로 변수에 대입
<br><br>

* * *
<h1>4️⃣ is_cub_file()함수 구현</h1>

```c
static int is_cub_file(const char *cub_file_path)
{
    int file_len;
    int is_same;

    file_len = ft_strlen(cub_file_path);
    if (ft_strncmp(cub_file_path + file_len - 4, ".cub", 4) == 0)
        is_same = TRUE;
    else
        is_same = FALSE;
    return (is_same);
}
```

* 이전 과제인 `libft`때 구현한 함수들을 사용하면 쉽게 구현이 가능합니다.
* 끝의 4자리가 <rd>".cub"</rd>이 맞는지 확인합니다.
* 만약 `FALSE`가 반환될 경우 **서브젝트**에 나온 내용대로 `ERROR\n"를 출력해주어야합니다. 이러한 오류출력은 앞으로 여러번 쓰일 것이기 때문에 다음과 같이 따로 함수로 구현하였습니다.

```c
int    exit_error(t_god *god, int exit_code, const char *message)
{
    write(2, "ERROR\n", 6);
    if (message)
    {
        write(2, message, ft_strlen(message));
        write(2, "\n", 1);
    }
    exit_cub3d(god, exit_code);
    return (exit_code);
}
```
<br><br>

* * *
<h1>5️⃣ check_parse_type()함수 구현</h1>

```c
static int check_parse_type(char *line)
{
	if (line[0] == 'N' && line[1] == 'O')
		return (T_NO);
	else if (line[0] == 'S' && line[1] == 'O')
		return (T_SO);
	else if (line[0] == 'W' && line[1] == 'E')
		return (T_WE);
	else if (line[0] == 'E' && line[1] == 'A')
		return (T_EA);
	else if (line[0] == 'F' && line[1] == ' ')
		return (T_FLOOR);
	else if (line[0] == 'C' && line[1] == ' ')
		return (T_CEIL);
	else if (is_map_valid(line))
		return (T_MAP);
	return (T_ERROR);
}
```

* `strcmp`함수를 이용할까했지만 두글자만 체크하기 때문에 위와같이 코드를 구현하였습니다.
* 각각의 **return(반환값)**들은 다음과 같이 **헤더파일**에 정의해두었습니다.

```c
/* texture */

# define T_ERROR (-1)
# define T_NO (0)
# define T_SO (1)
# define T_WE (2)
# define T_EA (3)
# define T_FLOOR (4)
# define T_CEIL (5)
# define T_MAP (6)
# define TEXTURE_COUNT (4)
```

* **map(지도)**의 정보같은 경우 각각의 요소를 체크해주었습니다.

```c
int     is_map_valid(char *line)
{
    int i;

    i = 0;
    while (line[i])
    {
        if (find_char("01NSEW ", line[i]) == FALSE)
            return (FALSE);
        i++;
    }
    return (TRUE);
}
```

* `0, 1, N, S, E, W`값으로만 이루어져있는지 체크하는 함수입니다.
<br><br>

* * *
<h1>6️⃣ do_parsing()함수 구현</h1>

* 이전까지는 단순히 **읽기**만 하는 것이기 때문에 간단했습니다.
* 하지만 읽어온**정보**를 토대로 **쓰기**를 하는 `do_parsing()`함수를 구현하는 것은 만만치 않았습니다. <b style="font-size:85%">(사실 노가다..)</b>
<h2 style="color:#0e435c;">(1) do_parsing() 최종구현</h2>

```c
int do_parsing(t_parse *parse, int g_ret, int type, char *line)
{
    if (type >= T_NO && type <= T_EA)
    {
        if (parse->tex[type].tex_path || !(parse->tex[type].tex_path = parse_path_malloc(line)))
            return (free_memory_return(line, ERROR));
    }
    else if (type == T_CEIL || type == T_FLOOR)
    {
        if ((type == T_CEIL && (parse->ceiling_color = parse_color(line)) == T_ERROR)
            || (type == T_FLOOR && (parse->floor_color = parse_color(line)) == T_ERROR))
            return (free_memory_return(line, ERROR));
    }
    else
    {
        parse->temp_map = update_map_malloc(parse->temp_map, line);
        if (g_ret == 0 && parse_map(parse) == ERROR)
            return (free_memory_return(line, ERROR));

    }
    return (free_memory_return(line, SUCCESS));
}
```

* 위의 코드는 `do_parsing함수`의 최종구현형태입니다.
* 크게 3가지로 분류하여 처리합니다.
    1.  동, 서, 남, 북 정보저장
    2.  천장, 바닥 색깔저장
    3.  맵 저장

* * *
<h2 style="color:#0e435c;">(2) 동, 서, 남, 북 정보저장함수 구현</h2>

```c
char *parse_path_malloc(char *line)
{
    char    *temp_malloc; 

    while (is_upper(*line) == TRUE)
        line++;
    while (is_space(*line) == TRUE)
        line++;
    if((temp_malloc = ft_strdup(line)) == NULL)
        return (NULL);
    return (temp_malloc);
}
```

* **xpm파일경로**에 대한 정보는 <rd>대문자</rd>로 된 **타입명**과 공백다음에 온다는 것을 이용하여 구현했습니다.
* 함수호출 뒤에 <rd>메모리해제</rd>가 필요하므로 함수명 뒤에 `malloc`을 붙여줬습니다.

* * *
<h2 style="color:#0e435c;">(3) 천장, 바닥 색깔저장함수 구현</h2>

```c
int parse_color(char *line)
{
    int i;
    int x;
    int result;
    int color;
    char **color_malloc;

    while (is_upper(*line) == TRUE)
        line++;
    while (is_space(*line) == TRUE)
        line++;
    if ((color_malloc = ft_split(line, ',')) == NULL)
        return (T_ERROR);
    result = 0;
    i = -1;
    while (++i < 3)
    {
        result *= 256;
        x = -1;
        color = 0;
        while (color_malloc[i][++x] != '\0')
        {
            if (ft_isdigit(color_malloc[i][x]) == FALSE)
                return (T_ERROR);
            color = color * 10 + color_malloc[i][x] - '0';
        }
        result += color;
    }
    free_array_memory((void**)color_malloc, 3);
    return (result);
}
```

* **색깔 정보** 또한 **처음 대문자들과 공백**을 넘겨준 뒤 입력을 받게 했습니다.
* 먼저 `ft_split함수`를 이용하여 <rd>r(빨강)</rd>, <b style="color:green">g(초록)</b>, <b style="color:blue">b(파랑)</b>을 분류하여 **임시 2차원 포인터**에 정보를 저장합니다.
* 그 뒤 각각의 `r,g,b`값이 int형 메모리중 <rd>8비트</rd>씩의 메모리를 차지함을 이용하여 연산을 통해 **보정**한 뒤 **반환**해주도록 했습니다.
* `split함수`는 2차원으로 **동적메모리**를 할당시켜주므로 메모리해제할때 주의해서 해야합니다.

* * *
<h2 style="color:#0e435c;">(4) 맵 저장함수 구현</h2>

```c
int     parse_map(t_parse *parse)
{
    int row;
    int col;

    if((parse->map = ft_split(parse->temp_map, '\n')) == NULL)
        return (free_memory_return(parse->temp_map, ERROR));
    row = -1;
    col = 0;
    while (parse->map[++row] != NULL)
        if (ft_strlen(parse->map[row]) > col)
            col = ft_strlen(parse->map[row]);
    parse->row = row;
    parse->col = col;
    return (free_memory_return(parse->temp_map, SUCCESS));
}
```

* `ft_split함수`를 이용하여 맵을 저장해줍니다.
* 그 뒤 저장된 맵을 `while문`을 통해 탐색하면서 `row, col`값도 저장해줍니다.
* 하지만 <rd>지도를 한줄씩 저장하는 것은 비효율적</rd>입니다. 우선적으로 모든 지도를 읽어온 뒤 저장을 시작하면 됩니다. `get_next_line함수`는 파일을 모두 읽었을 경우 `0(EOF)`값을 반환함을 이용하여 **지도 저장**함수를 호출하면 됩니다.
* 먼저 `0(EOF)`함수가 반환될때까지 <rd>맵의 정보</rd>를 임시적으로 저장하는 함수를 구현해야 합니다.

```c
char    *update_map_malloc(char *s1, char *s2)
{
    char *temp;
    char *result;

    if (s1 == NULL)
        s1 = ft_strdup("");
    temp = ft_strjoin(s1, "\n");
    result = ft_strjoin(temp, s2);
    free_memory(s1);
    free_memory(temp);
    
    return (result);
}
```

* `ft_strdup함수`를 이용하여 읽어온 **지도 한줄**씩을 누적해서 저장해나가는 함수입니다.
* 이 함수를 호출한 뒤 <rd>메모리 해제</rd>가 필요하기 때문에 함수명에 `_malloc`을 붙여줬습니다.
* `ft_strdup함수` 특성상 **매개변수**로 `NULL`값이 들어오면 **오류를 반환**하기 때문에
<kkr>
<b style="color:#DD8800">if</b> (s1 == NULL)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s1 = <b style="color:#5cce2f">ft_strdup</b>("");<br>
</kkr>
로 빈 공백값을 넣어줬습니다. 만약
<kkr>
<b style="color:#DD8800">if</b> (s1 == NULL)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s1 = "";<br>
</kkr>

와 같이 지정하지않고 굳이 메모리할당(ft_strdup)을 해서 `""`값을 지정한 이유는 뒤쪽에 구현한 `free함수`에서 오류가 남을 방지해주기 위해서 입니다. <b style="font-size:85%">(free함수를 호출하기 이전에 `NULL`을 확인하는 조건문은 도움이 되지 않았습니다.)</b>
* 이 함수를 이용하여 **지도를 한줄씩 차곡차곡 쌓아간 뒤** 마지막에 `지도 저장함수`를 호출하면 됩니다.
<br><br>

* * *
<h1>7️⃣ 최종 본 parse함수 구현</h1>

```c
int parse_file(t_god *god, const char *cub_file_path)
{
    int     fd;
    char    *line;
    int     gnl_ret;
    int     parse_type;

    if (!(is_cub_file(cub_file_path)))
        return (exit_error(god, ERROR, "NOT \".cub\" FILE"));
    if ((fd = open(cub_file_path, O_RDONLY)) < 0)
        return (exit_error(god, ERROR, "WRONG FILE PATH OR CAN'T OPEN!"));
    gnl_ret = 1;
    while ((gnl_ret = get_next_line(fd, &line)) > 0)
    {
        if (line[0] == '\0')
            continue;
        if ((parse_type = check_parse_type(line)) == T_ERROR)
            return (exit_error(god, ERROR, "WRONG PARSE TYPE"));
        if (do_parsing(&god->parse, gnl_ret, parse_type, line) == ERROR)
            return (ERROR);
    }
    do_parsing(&god->parse, gnl_ret, parse_type, line);
    close(fd);

    return (SUCCESS);
}
```

* 이번에 구현한 **파싱할 데이터를 저장하는 함수**의 중요한점은 <rd>메모리해제</rd>와 <rd>적절한 오류가 출력</rd>입니다.
* 여러가지 **선배들의 코드**들을 참고하여 구현하였지만 **42seoul문법**을 맞추기 위해서는 다음과 같이 기능이 합쳐진 함수를 만들 수 밖에 없는 것 같습니다.
    1.  **에러처리** + **반환값**
    2.  **메모리해제** + **반환값**
* 또한 **에러처리**와 **메모리해제**를 구현을 맞춘 뒤 작성해주는 것보다 각각**세부기능**을 구현해 나가면서 처리해주며 <rd>main함수</rd>로 테스트해가면서 구현해 나가는 것이 효율적일 것 같습니다.
<br><br>

* * *
<h1>8️⃣ 정상적으로 데이터가 저장됐는지 확인(main 함수)</h1>

```c
int main(void)
{
	t_god god;

	ft_memset(&god, 0, sizeof(t_god));
	parse_file(&god, "./map/test.cub");
	for (int i = 0; i < TEXTURE_COUNT; i++)
		printf("%s\n", god.parse.tex[i].tex_path);
	printf("\n");
	printf("ceilling color: %#x\n", god.parse.ceiling_color);
	printf("floor color: %#x\n", god.parse.floor_color);
	printf("row: %d\ncol: %d\n", god.parse.row, god.parse.col);
	for (int y = 0; y < god.parse.row; y++)
	{
		for (int x = 0; x < god.parse.col; x++)
			printf("%c ", god.parse.map[y][x]);
		printf("\n");
	}
}
```
<kkr>
<rmk>/***** 출력 *****/</rmk><br>
texture/NO.xpm<br>
texture/SO.xpm<br>
texture/WE.xpm<br>
texture/EA.xpm<br>
<br>
ceilling color: 0x619000<br>
floor color: 0x64de<br>
row: 9<br>
col: 25<br>
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1<br>
1 0 0 0 0 0 0 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 1<br>
1 0 1 1 0 0 0 0 0 1 1 1 0 0 0 0 0 1 0 0 0 0 0 0 1<br>
1 0 0 1 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1<br>
1 1 1 0 0 0 1 1 1 0 1 1 0 0 0 0 0 1 1 1 0 0 0 0 1<br>
1 0 0 0 0 0 N 0 0 0 1 1 0 0 0 0 0 1 1 1 0 1 1 1 1<br>
1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 0 1 0 1 0 0 1<br>
1 1 0 0 0 0 0 1 1 1 0 1 0 1 0 1 1 1 1 1 0 1 1 1 1<br>
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1<br>
</kkr>

* 정상적으로 필요한 값만 저장됐습니다.