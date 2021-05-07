---
layout: post
title:  "[cub3d](4)MiniLibX를 이용한 2D지도 구현(C언어)"
subtitle:   ""
date: 2021-05-07 02:45:51 +0900
categories: 42seoul
tags: cub3d
comments: true 
---

* * *
<h1>1️⃣ M1맥환경에서 MiniLibX 컴파일하기</h1>

* M1에서 <rd>MiniLibx</rd>를 이용하여 컴파일 하기 위해서는 아직까지는 `arch -x86_64`를 붙여서 컴파일하여야 합니다.
<kkr>
<b style="color:#009926;">build</b>:<br />
&nbsp;&nbsp;&nbsp;&nbsp;arch -x86_64 gcc -L ./mlx -lmlx -framework OpenGl -framework Appkit main.c<br />
&nbsp;&nbsp;&nbsp;&nbsp;./a.out
</kkr>

* `OpenGl`과 `Appkit` <b>framework</b>를 사용합니다.
* 매번 컴파일옵션을 작성하기가 번거롭기 때문에 위와같이 `Makefile`을 만들어서 실행까지 한번에 되도록 만들어 줬습니다.
<br /><br />

* * *
<h1>2️⃣  초기화및 기본 세팅</h1>

* MiniLibX에 내장된 함수는 <a href="https://harm-smits.github.io/42docs/libs/minilibx" target="blank">&gt;&gt;&gt;42DOCS</a>에서 간단히 알아볼 수 있습니다.
<h2 style="color:#0e435c;">(1) 구조체 구현</h2>

```c
typedef struct    s_mlx
{
    void        *mlx;
    void        *win;
}                t_mlx;
 
typedef struct    s_img
{
    void		*img;
    int         *data;
    int         bpp;
    int         line_size;
    int         endian;
}                t_img;
```

* minilibX 기본적인 포인터를 담는 구조체와 **image함수**에 사용할 변수들을 담는 구조체를 선언해 주었습니다.
<img src="https://kirkim.github.io/assets/img/cub3d/cub24.png" alt="mlx_get_data_addr_func" width="90%" style="margin-top:3%">

* **image함수**에 사용할 변수는 `mlx_get_data_addr`함수의 <rd>매개변수</rd>들을 베이스로 구성되어 있으면 <rd>반환형(char *)</rd>을 (int *)로 변화하여 <rd>data</rd>변수에 담도록 했습니다.
((int*)로 형변환을 함으로써 RGB요소를 한번에 담을 수 있게 됩니다.)
<h2 style="color:#0e435c;">(2) 매크로</h2>
<img src="https://kirkim.github.io/assets/img/cub3d/cub25.png" alt="2D_map" width="80%" style="margin-top:3%">

* 이차배열로 구성된 map변수의 <b>행, 렬</b>과 각 요소의 블럭사이즈를 잡아줄 `TILE_SIZE`, 그리고 미니맵의 배율을 조절할 수 있는 `MINI_SCALE`을 지정하였습니다.
* 띄어질 창의 크기는 `TILE_SIZE`와 `행, 렬`의 곱이 됩니다.

<h2 style="color:#0e435c;">(3) 지도변수 (2차원 배열)</h2>

```c
const int mini_map[MAP_NUM_ROWS][MAP_NUM_COLS] = {
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ,1, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1},
    {1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1},
    {1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1},
    {1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1},
    {1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}
};
```

* 위와같이 지도배열을 임시로 전역변수로 선언했습니다. (나중에 함수 내부로 보낼 예정)
<br /><br />

* * *
<h1>3️⃣  함수</h1>
<h2 style="color:#0e435c;">(1) main함수</h2>

```c
int        main(void)
{
    t_mlx    mlx;
    t_img    map;
 
    mlx.mlx = mlx_init();
    mlx.win = mlx_new_window(mlx.mlx, WINDOW_WIDTH, WINDOW_HEIGHT, "title");
    map.img = mlx_new_image(mlx.mlx, (int)(MINI_SCALE * WINDOW_WIDTH), (int)(MINI_SCALE * WINDOW_HEIGHT));
	render_map(&mlx, &map);
    mlx_loop(mlx.mlx);
    return (0);
}
```

* <rd>mlx포인터와 img포인터</rd>를 초기화 및 새로운 창과 이미지로 세팅을 해놓은 뒤 `render_map함수`를 호출하여 맵을 세팅하여 출력하도록 했습니다.
* 이미지 창의 크기를 윈도우창크기에 `MINI_SCALE`(미니맵 배율)을 곱함으로써 미니맵의 크기를 임의의로 지정할 수 있도록 했습니다.

<h2 style="color:#0e435c;">(2) 2Dmap 렌더링함수</h2>

* map을 렌더링하기 이전에 각각의 요소를 일정한 크기로 색을 입히는 함수를 구현했습니다.
<h2 align="middle" style="color:#0e435c;">&lt; fill_squares &gt;</h2>

```c
void fill_squares(t_img *map, int x, int y, int color)
{
	int i;
	int j;

	j = 0;
	while (j < (int)(MINI_SCALE * TILE_SIZE))
	{
		i = 0;
		while (i < (int)(MINI_SCALE * TILE_SIZE))
		{
			map->data[(int)(MINI_SCALE * WINDOW_WIDTH) * (y + j) + (x + i)] = color;
			i++;
		}
		j++;
	}
}
```

* 이차원배열형식이라면 좀 더 가시적으로 data에 값을 대입해줄 수 있겠지만 아쉽게도 data가 일차원배열의 형식으로 한줄씩 연속적으로 색을 지정해주어야 합니다. 그렇기 때문에 이미지의 크기를 정확히하게 입력해 주어야합니다.<b style="font-size:90%">(사실 2차원배열도 주소로만 보면 연속적으로 구성되어있습니다.)</b>
<h2 align="middle" style="color:#0e435c;">&lt; render_map함수 &gt;</h2>

```c
void	render_map(t_mlx *mlx, t_img *map)
{
	map->data = (int *)mlx_get_data_addr(map->img, &(map->bpp), &(map->line_size), &(map->endian));
	int col;
	int row;

	row = 0;
	while (row < MAP_NUM_ROWS)
	{
		col = 0;
		while (col < MAP_NUM_COLS)
		{
			if (mini_map[row][col] == 1)
				fill_squares(map, (int)(MINI_SCALE * TILE_SIZE * col), (int)(MINI_SCALE * TILE_SIZE * row), 0x000000);
			else
				fill_squares(map, (int)(MINI_SCALE * TILE_SIZE * col), (int)(MINI_SCALE * TILE_SIZE * row), 0xffffff);
			col++;
		}
		row++;
	}
	mlx_put_image_to_window(mlx->mlx, mlx->win, map->img, (int)(WINDOW_WIDTH * (1 - MINI_SCALE)), (int)(WINDOW_HEIGHT * (1 - MINI_SCALE)));
}
```

* 반복문을 돌려 맵의 요소가 1일때 색을 입히도록 하였습니다.
* 미니맵 배율은 <rd>소수의 형태</rd>이기 때문에 int로 강제 형변화을 해주었습니다.
* 미니맵의 위치를 <rd>오른쪽 아래로 보내주기 위해서</rd> `mlx_put_image_to_window`함수의 시작점 요소를 전체 윈도우 크기에 `(1 - MINI_SCALE)`을 곱한값에서부터 출력하도록 하였습니다.
<br /><br />

* * *
<h1>4️⃣ 미니맵 출력</h1>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 미니맵 1배율 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub26.png" alt="large degree">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 미니맵 0.5배율 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub27.png" alt="small degree">
    </div>
</div>
