---
layout: post
title:  "[cub3d](14)제대로된 맵 파싱하기"
subtitle:   ""
date: 2021-07-14 02:45:51 +0900
categories: 42seoul
tags: cub3d
comments: true 
---

* * *
<h1>1️⃣ 목표</h1>

* `get_next_line함수`를 이용하여 저장한 맵배열을 <rd>보정</rd>하여 새로운 변수에 저장할 예정입니다.
* 굳이 새로운 변수를 만들어 옮기는 이유는 다음과 같습니다.

<b>1.</b> **미니맵**을 그릴 때 **최대 길이를 기준**으로 항상 <rd>직사각형</rd>형태로 배열을 읽습니다. 하지만 `get_next_line함수`로 저장한 **맵배열**은 각각의 줄의 길이가 다를 수있습니다. 그럴경우 <rd>쓰래기값(할당되지않은 메모리)</rd>를 읽게됩니다.
예를 들면 다음과 같은 경우입니다.
<kkr>
<b style="color:#009999;">/* 기대한 출력 */</b><br>
1 1 1 1 1 1 1<br>
1 1 1 1<br>
1 1 1 1<br>
<b style="color:#009999;">/* 쓰래기 값이 출력 */</b><br>
1 1 1 1 1 1 1<br>
1 1 1 1&nbsp;&nbsp;&nbsp;t  <br>
1 1 1 1&nbsp;&nbsp;&nbsp;1 <rmk>// 우연히 쓰래기값이 1</rmk><br>
</kkr>
만약 쓰래기값이 우연히 `1`과 같은 값으로 저장되어 있다면 `벽`으로 인식하게 될 것입니다.
이러한 `버그`가 일어나지않게 하기위함입니다.

<b>2.</b> **저장된 맵**의 <rd>row(줄)</rd>,<rd>col(열)</rd>의 수치는 **렌더링**을 할때 필요한 수치를 계산하기위해 **이곳저곳**에서 쓰이게 됩니다. 심지어 <rd>창의 가로, 세로</rd>길이도 이 값에 의존적입니다. 하지만 픽셀을 이용하는 `mlx함수` 특성상 <rd>int(정수)</rd>로 강제 케스팅되어 사용하는 경우가 많습니다.<br>
-->만약 **저장된 맵**의 <b style="color:blue">row(줄),col(열)을 짝수가 되게끔 보정</b>한다면 <rd>int(정수)</rd>로 강제 케스팅 때문에 생기는 <rd>오차</rd>를 조금이라도 줄일 수 있습니다.
<br><br>

* * *
<h1>2️⃣ map 구조체 선언, 옮기기</h1>
<h2 style="color:#0e435c;">(1) map 구조체 선언</h2>

```c
typedef struct s_map
{
    int map_rows;
    int map_cols;
    int window_width;
    int window_height;
    int ray_count;
    char **map;
}               t_map;
```

* 기존에 매크로로 정의했던 `윈도우 너비`, `윈도우 높이`, `광선의 수` 들은 `cub파일의 맵`에 따라 달라지게 되기 때문에 변수로 만들어 `map구조체`에 저장해 주었습니다.

<h2 style="color:#0e435c;">(2) set_map함수</h2>

```c
void    set_map(t_god *god)
{
    int y;
    int row;
    int col;

    god->map.map = (char **)malloc(sizeof(char *) * god->map.map_rows);
    y = -1;
    while (++y < god->map.map_rows)
        god->map.map[y] = (char *)malloc(sizeof(char) * (god->map.map_cols + 1));
    row = -1;
    while (++row < god->parse.row)
    {
        col = -1;
        while (god->parse.map[row][++col] != '\0')
            god->map.map[row][col] = god->parse.map[row][col];
		col--;
		while (++col < god->map.map_cols)
        	god->map.map[row][col] = ' ';
        god->map.map[row][col] = '\0';
    }
    free_array_memory((void **)god->parse.map, god->parse.row);
}
```

* 기존에 `parse->map`변수에 `ft_split함수`를 이용하여 요소를 저장했었습니다. 이것을 최대 **열길이**에 맞춰서 <rd>2차원 동적할당</rd>을 해주었습니다.
* 그후 조건문을 통해 **뒤쪽의 쓰래기값** 대신 `공백`이 저장해 주었습니다.
<br><br>

* * *
<h1>3️⃣ 모서리가 통과되는 버그</h1>
<h2 style="color:#0e435c;">(1) 버그 발견</h2>

* 벽의 구조가 다음과 같을 때 <rd>광선(ray)<rd>가 통과하는 현상이 발견되었습니다. 당연히 <rd>player</rd>도 통과가 되었습니다.
<kkr>
<rmk>/* 문제가 되는 맵의 좌표 */</rmk><br>
0 1<br>
1 0<br>
</kkr>
<img src="https://kirkim.github.io/assets/img/cub3d/cub57.png" alt="bug">

* 어짜피 `player`의 부피를 **서브젝트가 정의**해주지 않았기때문에 **모서리를 통과**해도 괜찮지 않을까 생각을 했지만 그래도 <rd>통과하지 못하도록 막는 것</rd>이 상식적으로 맞을 것 같습니다.
* 먼저 문제의 원인은 제가 구현한 **렌더링함수**는 <rd>픽셀단위로</rd> 모든 벽을 탐색하지 않습니다.
* 우연히 **꼭지점**을 탐색하더라도 <rd>꼭지점 기준 왼쪽 상단</rd>의 좌표로 인식할 것입니다.

* * *
<h2 style="color:#0e435c;">(2) 버그 해결하기</h2>

* 벽을 탐색하는 함수인 `is_wall()`함수를 수정해줄 필요가 있습니다.

```c
int check_edge(t_god *god, double x1, double x2, double y1, double y2)
{
    int dx;
    int dy;

    dx = (int)(x1 / TILE_SIZE) - (int)(x2 / TILE_SIZE);
    dy = (int)(y1 / TILE_SIZE) - (int)(y2 / TILE_SIZE);
    int dx2 = (int)(x1 / TILE_SIZE);
    int dy2 = (int)(y1 / TILE_SIZE);
    
    if (dx == 1 && dy == 1)
        return (ft_strchr("0NSEW", god->map.map[dy2 - dy][dx2]) == NULL) && (ft_strchr("0NSEW", god->map.map[dy2][dx2 - dx]) == NULL);
    if (dx == 1 && dy == -1)
        return (ft_strchr("0NSEW", god->map.map[dy2 - dy][dx2]) == NULL) && (ft_strchr("0NSEW", god->map.map[dy2][dx2 - dx]) == NULL);
    if (dx == -1 && dy == 1)
        return (ft_strchr("0NSEW", god->map.map[dy2 - dy][dx2]) == NULL) && (ft_strchr("0NSEW", god->map.map[dy2][dx2 - dx]) == NULL);
    if (dx == -1 && dy == -1)
        return (ft_strchr("0NSEW", god->map.map[dy2 - dy][dx2]) == NULL) && (ft_strchr("0NSEW", god->map.map[dy2][dx2 - dx]) == NULL);
    return FALSE;
}
```

* `check_dege()`함수를 이용하여 `is_wall()`함수로 벽을 확인할때 이 함수를 추가로 사용하여 검사해주도록 하였습니다.
<img src="https://kirkim.github.io/assets/img/cub3d/cub58.png" alt="resolve_bug">

* 이제 `광선(ray)`과 `player`모두 통과하지 않습니다.