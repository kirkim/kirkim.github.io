---
layout: post
title:  "[cub3d](17)마우스 시점전환기능 구현하기"
subtitle:   ""
date: 2021-07-26 02:45:51 +0900
categories: 42seoul
tags: cub3d
comments: true
---

* * *
<h1>1️⃣ 목표</h1>

1. `마우스`로 시점을 바꿀 수 있는 기능을 구현할 계획입니다.
2. 추가적으로 프로그램을 돌렸을때 `leak(메모리누수)`가 발생하지 않는지 테스트도 할 것입니다.
<br><br>

* * *
<h1>2️⃣ 마우스관련 mlx함수 알아보기</h1>

* **마우스 관련** 함수는 `mlx.h`에 크게 **4가지**가 정의되어 있습니다.

```c
/* mlx.h */
int     mlx_mouse_hide();
int     mlx_mouse_show();
int     mlx_mouse_move(void *win_ptr, int x, int y);
int     mlx_mouse_get_pos(void *win_ptr, int *x, int *y);
```

1. `mlx_mouse_hide()`: 마우스포인터를 숨겨주는 함수
2. `mlx_mouse_show()`: 마우스포인터를 보여주는 함수
3. `mlx_mouse_move()`: 마우스위치를 `win_ptr`기준으로 **x, y**변수에 저장해주는 함수
4. `mlx_mouse_get_pos`: 마우스위치를 `win_ptr`기준으로 **x, y**변수 위치로 옮겨주는 함수
<br><br>

* * *
<h1>3️⃣ 마우스 시점전환기능 구현하기</h1>
<h2 style="color:#0e435c;">(1) update_mouse함수</h2>

```c
void	update_mouse(t_god *god)
{
	if (god->key.mouse_on == TRUE)
	{
		mlx_mouse_hide();
		mlx_mouse_get_pos(god->win, &god->mouse.x, &god->mouse.y);
		mlx_mouse_move(god->win, god->map.window_width / 2, god->map.window_height / 2);
	}
	else
		mlx_mouse_show();
}
```

* 숫자키 `3, 4`로 **god->key.mouse_on**변수를 <rd>키고 끌(TRUE, FALSE)</rd> 수 있도록 하였습니다.
* `켰을 경우` **마우스커서를 숨기고 마우스움직임**을 얻습니다. 그리고 <rd>마우스가 창밖으로 튀는 것</rd>을 막기 위해 `mlx_mouse_move()`함수를 이용하여 한틱마다 **윈도우 정중앙에 위치**하도록 하였습니다.
* `껏을 경우` **마우스커서를 다시 보여줍니다.**

* * *
<h2 style="color:#0e435c;">(2) 마우스함수 적용하기</h2>

```c
/* x좌표 */
if (god->key.mouse_on == TRUE)
	god->player.rota_angle += ((god->mouse.x - god->map.window_width / 2) / (100 * PI));

/* y좌표 */
if (god->key.mouse_on == TRUE)
    god->player.updown_sight += 2 * (god->mouse.y - god->map.window_height / 2);
```

* 마우스 포인터가 <rd>윈도우 중앙에 고정</rd>시킨 것을 생각하여 **윈도우 사이즈의 절반을 빼준 좌표**를 더해주도록 했습니다. 나머지 연산들은 단순히 **화면전환속도**를 조절하고자하는 수치일뿐입니다.

* * *
<h2 style="color:#0e435c;">(3) 시점이 튀는 현상 발생</h2>

* 기존에 `3`번키를 누르면 <rd>마우스시점 전환모드</rd>를 사용할 수 있도록 구현하였습니다.
* 하지만 다음그림과 같이 최초로 `3`번키를 누르는 순간 <rd>"시점이 튀는 현상"</rd>이 발생하였습니다.
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 3번키를 누르기전 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub72.png" alt="before_sight">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 3번키를 누른직후 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub73.png" alt="after_sight">
    </div>
</div>

* 우선 원인을 찾기 위해 `printf()`함수로 `3`번키를 누른 순간 **마우스 x좌표와 rota_angle(사용자 시점각도)**을 출력해 봤습니다.
<kkr>
-2.546479 0.595114<br>
1.349634 1.944747<br>
0.000000 1.944747<br>
0.000000 1.944747<br>
0.000000 1.944747<br>
0.000000 1.944747<br>
0.000000 1.944747<br>
0.000000 1.944747<br>
0.000000 1.944747<br>
</kkr>

* 위처럼 **1, 2틱**정도가 0.00이아니라 다른 값으로 튀는 것을 볼 수 있습니다. <b style="font-size:85%">(아마 마우스포인터를 윈도우 중앙에 고정시켜주는 함수가 `후순위`에 배치되서인듯하지만 `1.349634`로 튀는 원인을 찾을 수 없을 뿐더러 `앞순위`로 보내면 정상적으로 작동하지 않았습니다.)</b>
* **단순한 해결방법**으로 `3`번키를 누르고 최초 `5틱`을 지연시키는 방법을 사용했습니다.
<h3 align="middle" style="color:#0e435c;">&lt; 딜레이조건을 넣어준 뒤 코드 &gt;</h3>

```c
/* x좌표 */
if (god->key.mouse_on == TRUE)
{
	god->mouse.delay_x++;
	if (god->mouse.delay_x > 5)
		god->player.rota_angle += ((god->mouse.x - god->map.window_width / 2) / (100 * PI));
}

/* y좌표 */
if (god->key.mouse_on == TRUE)
{
	god->mouse.delay_y++;
	if (god->mouse.delay_y > 5)
        god->player.updown_sight += 2 * (god->mouse.y - god->map.window_height / 2);
}
```

* 전역으로 사용할 수 있도록 `god->mouse`구조체안에 `delay변수`를 넣고 틱을 조절하는 방식으로 만들어 줬습니다.
<br><br>

* * *
<h1>4️⃣ leak(메모리 누수) 검사</h1>
* 컴퓨터가 발달해서인지 프로그램을 `exit()`함수로 종료 시켜주면 자동으로 **메모리 해제**를 해줍니다. <b style="font-size:85%">(그래도 프로그램 사용중에 사용하지않는 메모리는 free해주는 습관이 좋을듯합니다.)</b>
* 하지만 이번에 `leak(메모리 누수) 검사`는 게임실행 중에 생기는 누수를 없애주는 것 입니다.
* `vargrind`라는 프로그램을 이용해도 되지만 현재 **m1맥북**에는 잘 작동하지(?)않는 다고 합니다.<b style="font-size:85%"> (`brew`를 사용해서 다운을 받아봐쓴ㄴ데 결국 포기)</b>
<h2 style="color:#0e435c;">(1) leaks이용하여 검사하기</h2>

* `leaks`커맨드 명령어를 이용하여 **메모리 누수**를 검사할 수 있습니다.
* **터미널을 2개**열고 <rd>실행 중</rd>에 `leaks 프로그램명`을 입력해야 합니다.
<kkr>
%> leaks a.out<br>
<br>
Process:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.out [xxxx]<br>
Path:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xxxx/a.out<br>
Load Address:&nbsp;&nbsp;&nbsp;&nbsp;xxxx<br>
Identifier:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.out<br>
Version:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;???<br>
Code Type:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X86-64 (translated)<br>
Platform:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;macOS<br>
Parent Process:&nbsp;&nbsp;zsh [xxxx]<br>
<br>
Date/Time:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2021-07-26 01:08:34.341 +0900<br>
Launch Time:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2021-07-26 01:08:14.082 +0900<br>
OS Version:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;macOS 11.2.3 (20D91)<br>
Report Version:&nbsp;&nbsp;7<br>
Analysis Tool:&nbsp;&nbsp;&nbsp;/usr/bin/leaks<br>
<br>
Physical footprint:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;88.4M<br>
Physical footprint (peak):&nbsp;&nbsp;88.6M<br>
----<br>
<br>
leaks Report Version: 4.0<br>
Process 12156: 22932 nodes malloced for 26789 KB<br>
<b><rd>Process 12156: 1 leak for 16 total leaked bytes.</rd></b><br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;1 (16 bytes) ROOT LEAK: 0x7fa63940dd40 [16]<br>
</kkr>

* `leaks`커맨드를 이용하면 위와같이 출력을 해줍니다. 저같은경우 **1개의 leak**이 발생했습니다.
* 하지만 정확히 <rd>어느곳에서 메모리누수가 발생</rd>했는지 찾기가 쉽지 않습니다.
<h2 style="color:#0e435c;">(2) 원하는 위치에서 누수검사하기</h2>

* 다행히도 `system()`함수를 사용하면 원하는 곳에서 **메모리 누수**검사를 할 수 있습니다.
* 다음과 같은 코드를 **메모리 누수를 검사하고싶은 곳 다음에** 작성해주면 됩니다. <b style="font-size:85%">(이 코드는 42seoul slack방에서 얻은 코드입니다. 팁주신분 감사합니다 (_ _))</b>
<kkr>
system("leaks a.out > result; cat result; rm result");<br>
</kkr>

* 이런식으로 `system()`함수를 사용하면 **굳이 터미널을 2개열고 실행할 필요도 없어 집니다.**

```c
int main(int argc, char **argv)
{
	t_god god;

	if (argc != 2)
		return (exit_error(&god, ERROR, "WRONG ARGUMENT COUNT!"));
	ft_memset(&god, 0, sizeof(t_god));
	special_init(&god);
	printf("\n@@@@@ 1 @@@@@\n");
	system("leaks a.out > result; cat result; rm result");

	if (parse_file(&god, argv[1]) == ERROR)
		return (exit_error(&god, ERROR, "FAIL PARSING!"));
	printf("\n@@@@@ 2 @@@@@\n");
	system("leaks a.out > result; cat result; rm result");

	if (check_parsing_value(&god) == ERROR)
		return (exit_error(&god, ERROR, "WRONG PARSING VALUE SAVED!"));
	printf("\n@@@@@ 3 @@@@@\n");
	system("leaks a.out > result; cat result; rm result");

	ft_init(&god);
	printf("\n@@@@@ 4 @@@@@\n");
	system("leaks a.out > result; cat result; rm result");

	load_texture(&god);
	printf("\n@@@@@ 5 @@@@@\n");
	system("leaks a.out > result; cat result; rm result");

	render_master(&god);
	printf("\n@@@@@ 6 @@@@@\n");
	system("leaks a.out > result; cat result; rm result");

    mlx_loop(god.mlx);
	free_texture_array(&god);
	return (0);
}
```

* **약간의 노가다(?) 작업이지만** 메모리 누수위치를 찾기가 훨씬 수월해 졌습니다.
<h2 style="color:#0e435c;">(3) 메모리누수 원인</h2>

* 저같은 경우 메모리 누수가 **다음의 로직**에서 발생했습니다.

```c
while ((gnl_ret = get_next_line(fd, &line)) > 0)
{
    if (line[0] == '\0')
		continue;
    else if ((parse_type = check_parse_type(line)) == T_ERROR)
        return (exit_error(god, ERROR, "WRONG PARSE TYPE"));
    else if (do_parsing(&god->parse, gnl_ret, parse_type, line) == ERROR)
        return (ERROR);
}
```

* while문이 반복될 때마다 `get_next_line()`함수는 **line**변수에 동적할당을한 메모리의 주소를 저장해 줍니다.
* **line변수**는 임시적으로 데이터를 저장하는 변수로 <rd>파싱된 이후에는 사용하지 않</rd>도록 코드를 구현했습니다. 그렇기 때문에 **line변수**는 실행중에 사용하지않는 메모리이기 때문에 **leak검사에서 잡히게 됩니다.**
* `do_parsing()`함수에서 **line**변수의 메모리를 해제해줍니다. 하지만 위의 로직에서 `if (line[0] == '\0')`조건문에 들어갈 경우 `continue`로 인해 `do_parsing()`함수를 거치지 않게됩니다. 결국 이 조건문에서는 따로 `free()`함수를 이용하여 **line변수**의 메모리를 해제해 주어야 합니다.
<h3 align="middle" style="color:#0e435c;">&lt; 변경후 반복문 로직 &gt;</h3>

```c
while ((gnl_ret = get_next_line(fd, &line)) > 0)
{
    if (line[0] == '\0')
		free(line);

    /* 코드 생략 */
}
```
<kkr>
/* 로직 변경 후 leak검사 결과 */
leaks Report Version: 4.0<br>
Process 13623: 18369 nodes malloced for 26343 KB<br>
Process 13623: 0 leaks for 0 total leaked bytes.<br>
</kkr>
