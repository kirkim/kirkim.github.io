---
layout: post
title:  "[cub3d]player 움직임 구현하기(삽질의 과정)"
subtitle:   ""
date: 2021-06-24 02:45:51 +0900
categories: 42seoul
tags: cub3d
comments: true 
---

* * *
<h1>1️⃣ 목표</h1>

* 이전에 `mlx_hook`함수를 이용하여 키값을 입력받는데 성공하였습니다. 하지만 **입력받은 키값**을 이용하여 동작을 구현하는데 실패하였습니다.
* 이번에 **입력받은 키값**을 이용하여 `player`의 동작을 구현하는 것이 목표입니다.
<br><br>

* * *
<h1>2️⃣ mlx_hook_loop함수 이용</h1>

* 기존에 `mlx_hook`을 이용하여 **키값**을 입력받았습니다. 메인함수에서 사용된 `mlx_loop`함수가 그러한 **키값**을 계속해서 업데이트 해줄 것을 기대했었습니다.
* 하지만 기대한 것 처럼 동작하지 않았습니다.
* 다행히 `mlx_hook_loop`함수라는 **이벤트**에 대한 **루프**함수가 존재했습니다.

* * *
<h2 style="color:#0e435c;">(1) mlx_hook_loop 매개변수</h2>
<h3 align="middle" style="color:#0e435c;">&lt; mlx_hook_loop함수 원형 &gt;</h3>
<img src="https://kirkim.github.io/assets/img/cub3d/cub30.png" alt="mlx_hook_loop" width="85%" style="margin-top:3%">

* **첫번째 인자**로 **mlx포인터**를 넣어줍니다.
* **두번째 인자**로 `mlx_hook`함수의 매동작마다 업데이트될 **함수의 포인터**를 넣어줍니다.
* **세번째 인자**로 두번째 인자로 넣어준 **함수의 인자(param)**를 넣어줍니다. 하지만 **인자(param)**가 여러개일 경우 **구조체**형태로 넘겨주어야 합니다.
* 이번기회에 모든 변수를 담는 `t_god god`이라는 구조체를 만들어 주었습니다. <b style="font_size:85%">(이전에 구현한 코드들이 약간씩 수정되지만 과정은 생략)</b>
<h3 align="middle" style="color:#0e435c;">&lt; t_god 구조체 &gt;</h3>

```c
typedef struct s_god {
    t_player player;
    t_img    img;
    void     *mlx;
    void     *win;
} t_god;
```

* * *
<h2 style="color:#0e435c;">(2) ft_loop함수 구현</h2>

* `mlx_loop_hook`함수의 두번째 인자값으로 넣어줄 **함수**를 구현했습니다.

```c
int     ft_loop(t_god *god)
{
    draw_ray(god, &(god->player), &(god->img));
    return (0);
}
```

* `player`를 그려주는 함수인 `draw_ray`함수를 이 루프 함수에 넣어서 관리하도록 하였습니다.
* 이제 **키값**을 입력받을 때 마다 `draw_ray`함수가 호출되어 `player`값을 새롭게 그려줄 것입니다.
<br><br>

* * *
<h1>3️⃣ 이전player가 남아있는 문제 발생</h1>
<h2 style="color:#0e435c;">(1) 문제</h2>

* 지금까지의 과정을 통해 **키값**을 **player동작**에 적용이 잘되었습니다.
* 하지만 다음과 같이 <rd>이전 player</rd>가 그대로 남아 있습니다.
<div class="explain-cover">
    <div class="explain-left">
        <h3 align="middle" style="color:#0e435c;">&lt; 이동 전 &gt;</h3>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub33.png" alt="base_player" width="100%" style="margin-top:3%">
    </div>
    <div class="explain-right">
        <h3 align="middle" style="color:#0e435c;">&lt; 이동 후 &gt;</h3>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub31.png" alt="preplayer_remain_problem" width="100%" style="margin-top:3%">
    </div>
</div>

* * *
<h2 style="color:#0e435c;">(2) 문제 해결</h2>

* `mlx_loop_hook`함수의 동작원리를 파악하고 나니 이러한 문제를 해결하는 것은 어렵지 않았습니다.
* 이전에 구현했던 **지도를 그려주는 함수**인 `render_map`함수를 `mlx_loop_hook`함수속에서 동작하도록 구현하면 됐습니다.

```c
int     ft_loop(t_god *god)
{
    render_map(god, &(god->img));
    /* 코드 생략 */
}
```
<div class="explain-cover">
    <div class="explain-left">
        <h3 align="middle" style="color:#0e435c;">&lt; 이동 전 &gt;</h3>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub33.png" alt="base_player" width="100%" style="margin-top:3%">
    </div>
    <div class="explain-right">
        <h3 align="middle" style="color:#0e435c;">&lt; 이동 후 &gt;</h3>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub32.png" alt="after_player" width="100%" style="margin-top:3%">
    </div>
</div>
<br><br>

* * *
<h1>4️⃣ 회전방향 적용하기</h1>

* 기존에는 단순하게 **상하좌우**로 움직이도록 코드를 구현하였습니다.
* 하지만 최종적으로 **3D**로 화면을 봤을때 바라보는 각도를 조절해줄 수 있어야합니다. 기존의 **좌, 우**움직이는 방향키를 바라보는 각도를 변경하는 키로 바꿀계획입니다.

* * *
<h2 style="color:#0e435c;">(1) t_key key 구조체 만들기</h2>

* 다음과 같이 `t_key key`구조체를 만들어줬으며 각방향별로 **입력됐을 때: 1, 입력이 안됐을 때 0**의 값을 가지도록 했습니다.

```c
typedef struct s_key {
    int up;
    int down;
    int right;
    int left;
} t_key;

/* t_god 구조체에 추가 */
typedef struct s_god {
    /* 코드 생략 */
    t_key    key;
} t_god;
```

* * *
<h2 style="color:#0e435c;">(2) key_press함수 수정</h2>

* `t_key key`변수에 키값을 조정해주도록 `key_press`함수를 수정 해주었습니다.

```c
int        key_press(int keycode, t_key *key)
{
    if (keycode == KEY_A)
        key->left = 1;
    if (keycode == KEY_D)
        key->right = 1;
    if (keycode == KEY_W)
        key->up = 1;
    if (keycode == KEY_S)
        key->down = 1;
    if (keycode == KEY_ESC)
        exit(0);
    
    return (0);
}
```

* * *
<h2 style="color:#0e435c;">(3) player요소 추가 및 player_init함수 내용추가</h2>

```c
typedef struct s_player {
    double x;
    double y;
    int thickness;
    double rotationAngle;
    double walkSpeed;
    double turnSpeed;
} t_player;
```

* `rotationAngle`: 바라보는 각도
* `walkSpeed`: 움직이는 속도
* `turnSpeed`: 바라보는 각도의 조정속도
* `player`의 위치를 나타내는 **x, y**변수는 좀 더 정확하게 계산하기 위해 `double`형으로 수정해 주었습니다.

```c
void player_init(t_player *player)
{
    player->x = WINDOW_WIDTH / 2;
    player->y = WINDOW_HEIGHT / 2;
    player->thickness = PLAYER_THICKNESS;
    player->rotationAngle = PI / 2;
    player->walkSpeed = 1;
    player->turnSpeed = 4 * (PI / 180);
}
```

* `player`을 초기화해주는 함수도 수정해 주었습니다.

* * *
<h2 style="color:#0e435c;">(4) update_player함수 구현</h2>

```c
int update_player(t_god *god)
{
    double turnDirection = 0;
    double walkDirection = 0;
    double newPlayerX;
    double newPlayerY;

    if (god->key.left == 1)
        turnDirection = -1;
    if (god->key.right == 1)
        turnDirection = 1;
    if (god->key.up == 1)
        walkDirection = 1;
    if (god->key.down == 1)
        walkDirection = -1;

    god->player.rotationAngle += turnDirection * god->player.turnSpeed;
    int moveStep = walkDirection * god->player.walkSpeed;
    newPlayerX = god->player.x + moveStep * cos(god->player.rotationAngle);
    newPlayerY = god->player.y + moveStep * sin(god->player.rotationAngle);

    if (!is_wall(newPlayerX, newPlayerY))
    {
        god->player.x = newPlayerX;
        god->player.y = newPlayerY;
    }
    return (0);
}
```

* 예전에 <rd>Pikuma강의</rd>를 통해 배웠던 함수를 응용해서 만들어 주었습니다. 비슷하기 때문에 자세한내용은 이전의 포스트를 참고하면됩니다.
* 벽을 통과하지 못하게 하기위해서 `is_wall`의 함수를 다음과 같이 구현하였습니다.

```c
int is_wall(double x, double y)
{
	int xX;
	int yY;

	if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT) {
            return (1);
    }
    xX = floor(x / TILE_SIZE);
    yY = floor(y / TILE_SIZE);
    return mini_map[yY][xX] != 0;
}
```

* * *
<h2 style="color:#0e435c;">(5) draw_player함수 수정</h2>

* `player`의 좌표값을 나타내는 **x, y**변수의 자료형이 `int`에서 `double`이 되는 바람에 **x, y**의 값이 소수값이 되면 제대로 그려주지 못하는일이 발생하였습니다.
* 그래서 `draw_player`함수 내부에서 다음과 같이 (int)형으로 <rd>강제 케스팅</rd>해주었습니다.

```c
/* 수정 전 */
img->data[(int)(MINI_SCALE * (WINDOW_WIDTH * (player->y + row) + (player->x + col)))] = 0x0000FF;

/* 수정 후 */
img->data[(int)(MINI_SCALE * (WINDOW_WIDTH * ((int)player->y + row) + ((int)player->x + col)))] = 0x0000FF;
```

* 수정 후 정상적으로 작동이 되었습니다.
<br><br>

* * *
<h1>5️⃣ 아쉬운 부분(보완해야할 점)</h1>

* `player`의 좌표값인 **x, y**값은 `double`형으로 계산이 되어집니다. 하지만 `player`를 그리는 부분에서 어쩔수없이 `int`형으로 강제 케스팅을 하였습니다.
* 그렇다보니 실제로 게임을 실행해보면 <rd>바라보는 각도가 조금이라도 변경될 경우</rd> 똑바르게 전진을 못하는 모습이 보여졌습니다.
* 아직 어떤식으로 해결해야할지 감이 잡히지않지만 이부분에 대해서 다시 한번 고민 해봐야할 것 같습니다.