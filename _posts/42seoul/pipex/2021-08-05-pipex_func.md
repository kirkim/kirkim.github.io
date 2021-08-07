---
layout: post
title:  "[pipex]pipex 함수파악하기"
subtitle:   ""
date: 2021-08-05 03:45:51 +0900
categories: 42seoul
tags: pipex
comments: true
---

* * *
<h1>1️⃣ 목표</h1>

* `pipex`의 서브젝트를 보면 알 수 있듯이 이번 파트는 <rd>쉘 커맨드</rd>에 관한 파트입니다.
* 처음의 과제를 접했을 때 `피펙스`라고 읽었는데 사용가능한 함수중 `pipe()`함수가 있는 것을 보고 `파이프엑스`로 읽어야함을 깨달았습니다. 그만큼 `pipe()`함수는 아직 저에게 매우 낯선함수입니다.
* 목표에 대해서 서브젝트에 예시가 잘나와있지만 어떤식으로 구현할지 아직 막연한 것이 사실입니다. 다행히 **힌트(?)**로 주어진듯한 `사용가능한 함수 목록`이 있는데, 거기에 나온 <rd>함수</rd>를 하나하나 파악해가면 어느정도 해결책이 생길 것 같습니다.
* `함수 목록`중 처음보거나 애매한 함수는 다음과 같고 이번에 파악해볼 예정입니다.
	1. `pipe`
	2. `execve`
	3. `fork`
	4. `access`
	5. `unlink`
	6. `waitpid`
	7. `wait`
	8. `dup`
	9. `dup2`
	10. `perror`
	11. `strerror`
<br><br>

* * *
<h1>2️⃣ pipe함수</h1>

* 이번 프로젝트의 이름이 `pipex`인 만큼 이번 과제에서 **가장 중요한 함수**이지 않을까 생각이 듭니다.
* `pipe()`함수는 말그대로 `파이프`를 생성해준다고 생각하면 될 것같습니다. 이 `파이프`에 **데이터를 넣고 뺄 수 있습니다.**
* 단, `FIFO`<b style="font-size:90%"> (First In First Out, 선입선출)</b>의 방식으로 데이터를 주고받을 수 있습니다.
* **인자**로 <b style="color:blue">fd<b style="font-size:90%">(파일디스크립터)</b>변수</b>를 넣어주어야합니다. **변수명**은 마음대로지만 `int`형의 크기가 2인 배열을 넣어주어야합니다. `pipe()`함수는 이 **fd[0]**을 <b style="color:blue">입력fd</b>로 **fd[1]**을 <b style="color:blue">출력fd</b>로 만들어 줍니다.

```c
int main(void)
{
	int fd1[2];
	int fd2[2];
	int fd3[2];

	pipe(fd1);
	pipe(fd2);
	pipe(fd3);
	printf("%d %d\n", fd1[0], fd1[1]);
	printf("%d %d\n", fd2[0], fd2[1]);
	printf("%d %d\n", fd3[0], fd3[1]);
}
```
<kkr>
<rmk>/* 출력 */</rmk><br>
3 4<br>
5 7<br>
8 9<br>
</kkr>

* 위의 예시는 `파이프`를 **3개**만들어준 뒤 각각의 `fd요소`를 확인해 보는 코드입니다.
* **출력값**을 보면 알 수 있듯이 `3`부터 겹치지 않게 배정되어 졌음을 알 수 있습니다.
* 기본적으로 `fd(파일디스크립터)`에서 `0, 1, 2`는 다음으로 배정되어 있습니다.
	* `0`: 표준입력
	* `1`: 표준출력<b style="font-size:85%">(콘솔출력)</b>
	* `2`: 에러출력
* `open()`함수를 이용했을때도 <b style="color:blue">fd</b>를 배정받는데 사용한 후에 `close()`함수를 이용하여 닫아줬습니다. `pipe()`함수 역시 <b style="color:blue">fd</b>를 배정받기에 **사용 후 혹은 사용하지않는** <b style="color:blue">fd(파일디스크립터)</b>는 `close()`함수를 이용하여 닫아주어야 합니다.
* `pipe()`함수가 실패했을 경우 `-1`을 반환합니다.
<br><br>

* * *
<h1>3️⃣ fork함수</h1>

* `fork()`함수는 **프로세스를 복사**해주는 함수입니다. 이렇게 복사된 프로세스를 <rd>"자식 프로세스"</rd> 기존의 프로세스를 <rd>"부모 프로세스"</rd>라고 부릅니다.
* 반환값으로 `자식프로세스의 pid`값을 반환합니다. 여기서 `pid`란 **Process IDentifier**의 약자로, 프로세스의 **고유 ID**입니다. **자료형타입**으로 `pid_t`를 사용하는데 `int`형으로 선언해도 잘 동작합니다. <b style="font-size:85%">(자세한 이유는 모르겠지만 pid_t는 0 ~ 32767의 범위를 갖는다고 합니다. -1 == 32768경우도 포함)</b>
* `fork()`함수가 실패할 경우 `-1`을 반환합니다.
* **자식프로세스**는 `fork()`함수가 호출된 이후부터 진행합니다. 그렇기 때문에 **자식프로세스**에서는 `fork()`반환값을 저장한 **변수**의 값이 `0`입니다. 그렇기 때문에 **다음의 코드예시**와 같이 `fork()`함수가 반환한 `자식함수pid`를 이용하여 **부모프로세스** 혹은 **자식프로세스**에서만 동작하는 함수를 만들 수 있습니다.

```c
int main(void)
{
	pid_t pid;

	pid = fork();

	if (pid == -1)
	{
		printf("fork() error");
		exit(1);
	}
	if (pid == 0)
	{
		printf("\n****자식프로세스****\n");
		printf("변수pid값: %d\n", pid);
		printf("자식피드: %d\n", getpid());
	}
	else
	{
		printf("\n****부모프로세스****\n");
		printf("변수pid값: %d\n", pid);
		printf("부모피드: %d\n", getpid());
	}
	return (0);
}
```
<kkr>
<rmk>/* 출력 */</rmk><br>
<br>
****부모프로세스****<br>
변수pid값: 6239<br>
부모피드: 6238<br>
<br>
****자식프로세스****<br>
변수pid값: 0<br>
자식피드: 6239<br>
</kkr>

* `getpid()`함수를 이용하면 **현재 프로세스의 pid값**을 얻을 수 있습니다.
<br><br>

* * *
<h1>4️⃣ wait함수, waitpid함수</h1>
<h2 style="color:#0e435c;">(1) wait함수</h2>

* 형식은 `pid_t wait(int *status)`로 **감시한 자식 프로세스pid값**을 반환함과 동시에 **인자값**을 통해 **자식 프로세스 종료 상태 정보**를 알려줍니다.
* 다음은 `wait()`함수를 쓰기 전 코드예시입니다.

```c

/* 코드 생략 */

if (pid == 0)
	{
		printf("\n****자식프로세스****\n");
		sleep(2);
		printf("자식프로세스 종료\n");
	}
	else
	{
		printf("\n****부모프로세스****\n");
		sleep(1);
		printf("부모프로세스 종료\n");
	}
```

<kkr>
<rmk>/* 출력 */</rmk><br>
<br>
****부모프로세스****<br>
<br>
****자식프로세스****<br>
부모프로세스 종료<br>
$> 자식프로세스 종료<br>
</kkr>

* `sleep()`함수는 인자의 값만큼 딜레이를 가지게합니다. 즉, 위의코드에서 `sleep()`의 인자값이 더 큰 **자식프로세스**가 더 늦게 종료됩니다.

```c

/* 코드 생략 */

if (pid == 0)
	{
		printf("\n****자식프로세스****\n");
		sleep(2);
		printf("자식프로세스 종료\n");
	}
	else
	{
		wait_res = wait(&status);
		printf("\n****부모프로세스****\n");
		sleep(1);
		printf("부모프로세스 종료\n");
		printf("wait인자값: %d\nwait반환값: %d\n", status, wait_res);
		printf("자식pid: %d\n", pid);
	}
```
<kkr>
<rmk>/* 출력 */</rmk><br>
****자식프로세스****<br>
자식프로세스 종료<br>
<br>
****부모프로세스****<br>
부모프로세스 종료<br>
<br>
wait인자값: 0<br>
wait반환값: 7891<br>
자식pid: 7891<br>
<br>
</kkr>

* `wait()`함수가 호출된 시점에서 **자식프로세스가 종료될떄까지** 기다리고 코드가 진행됨을 알 수 있습니다.
* `wait()`함수를 반대로 자식프로세스에서 사용해봤지만 아무일도 일어나지않았습니다. 아마 **부모프로세스**에서만 사용이 가능한 것 같습니다.

* * *
<h2 style="color:#0e435c;">(2) waitpid함수</h2>

* `waitpid()`함수의 동작은 `wait()`함수의 매커니즘과 비슷합니다.
* 자세한 **사용법 및 인자**는 <a href="https://codetravel.tistory.com/42" target="blank">
