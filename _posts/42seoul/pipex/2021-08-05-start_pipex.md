---
layout: post
title:  "[pipex]pipex 개요"
subtitle:   ""
date: 2021-08-05 02:45:51 +0900
categories: 42seoul
tags: pipex
comments: true
---

* * *
<h1>1️⃣ 목표</h1>

* 새로운과제 `pipex`의 서브젝트를 읽고 파악하기
<br><br>

* * *
<h1>2️⃣ 기본지시사항</h1>

1. `Norminette`기준에 따를 것
2. **정의되지 않는 동작**으로 프로그램이 예기치 않게 종료되면 안됩니다.<b style="font-size:90%"> (segmentation fault, bus eror, double free 등).</b>
3. 힙에 선언한 모든 메모리는 `free`로 처리되어 `메모리 누수`가 일어나면 안됩니다.
4. `Makefile`을 만들어야하며 `-Wall -Wextra -Werror`플래그를 사용하여 컴파일을 진행해야하며, 컴파일 이후에 다시 리링크되면 안됩니다.
5. `Makefile`은 다음의 규칙을 정의해야합니다.
	* `$(NAME)`, `all`, `clean`, `fclean`, `re`
6. 보너스파일에 `_bonus`붙이기.
7. 왠만하면 프로젝트를 위한 `테스터 프로그램`을 만들기.
8. 실행파일은 `pipex`로 이름을 지을 것.
<br><br>

* * *
<h1>3️⃣ pipex 기본파트 목표</h1>

* `pipex`프로그램은 다음과 같이 실행됩니다.
<kkr>
./pipex file1 cmd1 cmd2 file2<br>
</kkr>

* 실행예시를 보여드리면 다음과 같습니다.
<kkr>
<rmk>/* 실제 입력 */</rmk><br>
./pipex infile "ls -l" "wc -l" outfile<br>
<br>
<rmk>/* 다음의 결과와 동일하게 실행되야함 */</rmk><br>
< infile ls -l | wc -l > outfile<br>
</kkr>
<br><br>

* * *
<h1>4️⃣ 사용가능한 함수</h1>

* `open`
* `close`
* `read`
* `write`
* `malloc`
* `free`
* `dup`
* `dup2`
* `execve`
* `fork`
* `perror`
* `strerror`
* `exit`
* `pipe`
* `access`
* `unlink`
* `waitpid`
* `wait`
<br><br>

* * *
<h1>5️⃣ pipex 보너스파트 목표</h1>

* **기본파트**가 완벽하지않다면 **보너스파트**는 철저히 무시될 것입니다.
* 기본파트에서 금지되었던 다양한 **헤더, 라이브러리, 함수**들을 사용할 수 있습니다.
* **보너스 파트**의 목표는 다음과 같습니다.
1. `Handle multiple pipes`: 다중 파이프 구현하기
<kkr>
<rmk>/* 실제 입력 */</rmk><br>
./pipex file1 cmd1 cmd2 cmd3 ... cmdn file2<br>
<br>
<rmk>/* 다음의 결과와 동일하게 실행되야함 */</rmk><br>
< file1 cmd1 | cmd2 | cmd3 ... | cmdn > file2<br>
</kkr>

2. `Support << and >>`: `<<`와 `>>` 구현하기.
