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
<img src="https://kirkim.github.io/assets/img/cub3d/cub30.png" alt="mlx_hook_loop" width="70%" style="margin-top:3%">

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

* 지금까지의 과정을 통해 **키값**을 **player동작**에 적용시키는 것이 성공하였습니다.
* 하지만 다음과 같이 <rd>이전 player</rd>가 그대로 남아 있습니다.
<div class="explain-cover">
    <div class="explain-left">
        <h3 align="middle" style="color:#0e435c;">&lt; 이동 전 &gt;</h3>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub33.png" alt="base_player" width="100%" style="margin-top:3%">
    </div>
    <div class="explain-right">
        <h3 align="middle" style="color:#0e435c;">&lt; 이동 후 &gt;</h3>
        <img src="https://kirkim.github.io/assets/img/cub3d/cub31.png" alt="preplayer_remain_problem" width="70%" style="margin-top:3%">
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
    draw_ray(god, &(god->player), &(god->img));
    return (0);
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
