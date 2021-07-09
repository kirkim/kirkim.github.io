---
layout: post
title:  "[cub3d](12)파싱데이터 체크하기"
subtitle:   ""
date: 2021-07-08 02:45:51 +0900
categories: 42seoul
tags: cub3d
comments: true 
---

* * *
<h1>1️⃣ 목표</h1>

* 지금까지 **(.cub)파일**을 읽어서 **구조체 변수**에 저장하는 코드를 구현하였습니다.
* 이제 **구조체 변수**에 필요한 **데이터 값**이 들어왔는지 **체크**하는 코드를 구현할 예정입니다.
* 다음의 순서를 따를 것 입니다.
    1.  <b><rd>타입(xpm, color)</rd></b>가 값이 존재하는지 확인
    2.  <b><rd>map(지도)</rd></b>에 올바른 값이 저장됨을 확인
    3.  <b><rd>map의 요소(N, S, E, W</rd></b>에 따라 player위치 설정해주기
    4.  <b><rd>오류처리</rd></b>해주기
<br><br>

* * *
<h1>2️⃣ 타입(xpm, color)체크 함수 구현</h1>
<h2 style="color:#0e435c;">(1) xpm파일 체크</h2>

```c
int i;

i = -1;
while (++i < TEXTURE_COUNT)
    if ((god->parse.tex[i].tex_path) == NULL)
        return (ERROR);
```

* 파일명이 반드시 `.xpm`일 필요가 없기 때문에 **파일명**에 대해서는 검사하지 않았습니다.
* `TEXTURE_COUNT`는 **헤더 부분**에서 <rd>개발자가 사용할 텍스쳐파일의 갯수를 정확히 넣어줘야 합니다.</rd>

* * *
<h2 style="color:#0e435c;">(2) color 체크</h2>

```c
if ((god->parse.ceiling_color == NO_COLOR) || (god->parse.floor_color == NO_COLOR))
        return (ERROR);
```

* `ft_memset`함수를 이용하여 모든 변수값을 `0`으로 초기화해주기 때문에 만약 **"색깔을 설정하지 않았다면"** <rd>color</rd>변수에 `0`이 저장되어 있을 것입니다.
* 하지만 `0`값은 `0x000000(검정색)`을 나타내기도 합니다. 그렇다고 **검정색**을 설정하지 못하도록 할 수없는 노릇입니다.
* 대신에 `color`변수는 `-1`로 초기화 해주었습니다. `NO_COLOR(-1) 매크로`로 정의해 주었습니다.

* * *
<h2 style="color:#0e435c;">(3) 나머지 변수 체크</h2>

* 위의 과정과 동일하게 **나머지 변수**들도 **초기화된 값**의 비교를 통해 체크할 수 있습니다.
* 아직 **보너스 파트**를 구현하기 전이기 때문에 저같은 경우 다음의 변수들만 추가로 체크해줬으면 됐습니다.

```c
if (!(god->parse.row) || !(god->parse.col))
    return (ERROR);
```
<br><br>

* * *
<h1>3️⃣ map(지도) 체크 및 player위치 설정</h1>
<h2 style="color:#0e435c;">(1) 공백 요소</h2>

* **기본 지도 요소**는 `0, 1, N, S, E, W`와 `공백`입니다.
* `공백`은 말그대로 공백이며 `0(복도)`나 `NSEW`와 <rd>접촉해서는 안됩니다.<rd><b style="font-size:85%"> (공백은 1(벽)으로 막혀있어야 한다)</b>

```c
/* 요소하나씩 탐색하는 wile문 내부 */
/* value = god->parse.map[row][col] */

if (ft_strchr("1 ", value) != NULL)
    continue;
else if (ft_strchr("0NSEW", value) != NULL)
{
    if (is_space_around_position(god, row, col) == ERROR)
        return (ERROR);
}
```

* `ft_strchr함수`를 이용하여 체크를 하게 됩니다.
* 요소가 `0NSEW`중 하나일 경우 `is_space_around_position()`함수를 호출하게 됩니다.
<h2 style="color:#0e435c;">(2) is_space_around_position()함수</h2>

```c
int		is_space_around_position(t_god *god, int row, int col)
{
	if (row <= 0 || row >= god->parse.row || col <= 0 || col >= god->parse.col)
		return (ERROR);
	else if (god->parse.map[row][col + 1] == ' '
	|| god->parse.map[row][col + 1] == '\0' || god->parse.map[row][col - 1] == ' ')
		return (ERROR);
	else if ((int)ft_strlen(god->parse.map[row - 1]) <= col
	|| god->parse.map[row - 1][col] == ' ' || god->parse.map[row - 1][col] == '\0')
		return (ERROR);
	else if ((int)ft_strlen(god->parse.map[row + 1]) <= col
	|| god->parse.map[row + 1][col] == ' ' || god->parse.map[row + 1][col] == '\0')
		return (ERROR);
	return (SUCCESS);
}
```

* 말그대로 공백이 있는지 확인해주는 함수입니다.
* `현재 좌표`에서 **상, 하, 좌, 우**의 값이 <rd>공백</rd>인지를 체크합니다.
<h2 style="color:#0e435c;">(3) player위치 설정</h2>

* 맵이 유효한지 체크가 끝났다면 `NSEW`<b style="font-size:85%">(player가 바라보는 방향)</b>값에 따른 `player`를 설정해 주면됩니다.

```c
int     set_angle(t_god *god, int row, int col)
{
    char type;

    if (god->player.x != 0 || god->player.y != 0)
        return (ERROR);
    type = god->parse.map[row][col];
    if (type == 'E')
        god->player.rotationAngle = HALF_PI * 0;
    else if (type == 'S')
        god->player.rotationAngle = HALF_PI * 1;
    else if (type == 'W')
        god->player.rotationAngle = HALF_PI * 2;
    else if (type == 'N')
        god->player.rotationAngle = HALF_PI * 3;
    god->player.x = ((double)col + 0.5) * TILE_SIZE;
    god->player.y = ((double)row + 0.5) * TILE_SIZE;

    return (SUCCESS);
}
```

* 이미 <rd>player의 좌표가 유효</rd>하다면 `ERROR`를 반환합니다.
* `N, E, S, W`방향은 `HALF_PI`(90도)만큼씩 차이납니다. 적절하게 `rotationAngle`을 설정해줍니다.
* `player의 좌표`는 좌표기준 <rd>정 중앙</rd>에 위치하도록 합니다.<b style="font-size:85%"> (TILE_SIZE를 이용)</b>
<br><br>

* * *
<h1>4️⃣ 오류 출력(main함수)</h1>

* 지금까지 구현한 코드들을 **main함수**에서 <rd>호출과 동시에 에러처리</rd>를 할 예정입니다.
* 파싱에 대해서 **오류가 나는 경우의수**는 너무나 많습니다.
* 그렇다고 각각의 **오류 케이스**마다 <rd>세부적</rd>으로 오류를 처리해주기에는 함수가 너무 복잡해질 것같고 **나중에 코드를 수정**할때도 만만치 않을 것이라고 생각이 들었습니다. <b style="font-size:85%">(예를들어 집안에 누전차단기(두꺼비집)를 생각해보면 <rd>방단위</rd>로 처리하지 <rd>각각의 콘센트</rd>에 대해 처리하지 않습니다.)</b>
* 그렇기 때문에 어느정도 범위를 정해 <rd>오류를 출력</rd>해주도록 했습니다.

```c
int main(int argc, char **argv)
{
	t_god god;

	if (argc != 2)
		return (exit_error(&god, ERROR, "WRONG ARGUMENT COUNT!"));
	ft_init(&god);
	if (parse_file(&god, argv[1]) == ERROR)
		return (exit_error(&god, ERROR, "FAIL PARSING!"));
	if (check_parsing_value(&god) == ERROR)
		return (exit_error(&god, ERROR, "WRONG PARSING VALUE SAVED!"));
	render_player(&god);
    mlx_loop(god.mlx);
	return (0);
}
```

* 크게 세가지 부분으로 오류를 출력하도록 하였습니다. <b style="font-size:85%">(parse_file같은 경우는 내부에서 세부적으로 오류를 출력하도록하기는 했습니다. 단순히 (.cub)파일이 유효한값인지 체크하는 함수이기 때문에 복잡해질 이유가 없다고 생각했습니다.)</b>
