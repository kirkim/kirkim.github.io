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
<h1>2️⃣ pipe() 함수</h1>

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
<h1>3️⃣ fork() 함수</h1>

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
<h1>4️⃣ wait(), waitpid() 함수</h1>
<h2 style="color:#0e435c;">(1) wait() 함수</h2>

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
<h2 style="color:#0e435c;">(2) waitpid() 함수</h2>

* `waitpid()`함수의 동작은 `wait()`함수의 매커니즘과 비슷합니다.
* 자세한 **사용법 및 인자**는 <a href="https://codetravel.tistory.com/42" target="blank">waitpid 함수 사용하기 - 개발여행기</a>를 참고하면 될 것같습니다.

```c
if (pid == 0)
{
    printf("\n****자식프로세스****\n");
    sleep(4);
    printf("자식프로세스 종료\n");
}
else
{
    wait_res = waitpid(pid, &status, WNOHANG);
    printf("\n****부모프로세스****\n");
    sleep(1);
    printf("부모프로세스 종료\n");
    printf("\nwaitpid인자값: %d\nwaitpid반환값: %d\n", status, wait_res);
}

return (0);
```
<kkr>
<rmk>/* 출력값 */</rmk><br>
<br>
****자식프로세스****<br>
자식프로세스 종료<br>
<br>
****부모프로세스****<br>
부모프로세스 종료<br>
<br>
waitpid인자값: 0<br>
waitpid반환값: 2935<br>
</kkr>

* `waitpid()`의 3번째 인자에 `0`을 넣으면 `wait()`함수와 같이 동작합니다. 하지만 다른점은 **여러개의 자식프로세스**가 있을 때 `wait()`함수는 <rd>자식프로세스중 하나라도 종료</rd>되면 대기상태가 풀립니다.
* `두번째 인자`는 **상태를 저장**해주는 용도인 것같은데 설명을 읽어도 정확한 사용법을 모르겠습니다. 우선은 `NULL`을 넣어도 정상작동합니다.
* `세번째 인자`는 다음과 같은 값들을 넣을 수 있습니다.
	* <b style="color:green">WCONTINUED</b>: 0x00000010
	* <b style="color:green">WNOHANG</b>: 0x00000001
	* <b style="color:green">WUNTRACED</b>: 0x00000002
* `세번째 인자`도 나중에 코드를 구현하면서 필요에 따라서 기능을 알아보도록 하겠습니다. 우선은 `0`을 넣으면 `wait()`함수와 비슷하게 동작합니다.
* 결론적으로 `waitpid()`함수는 <b style="color:blue">특정 자식프로세스</b>를 감시할 수 있다는 점 입니다.
<br><br>

* * *
<h1>5️⃣ fork(), pipe() 조합해서 사용해보기</h1>

```c
int main(void)
{
    int fd1[2];
    int fd2[2];
    char buffer[BUFSIZE];
    pid_t pid;

    if(pipe(fd1) == -1 || pipe(fd2) == -1)
    {
        printf("pipe error");
        exit(1);
    }

    pid = fork();

    if (pid == -1)
    {
        printf("fork() error");
        exit(1);
    }
    if (pid == 0)
    {
        write(fd1[1], "(자식에서 입력)\n", 25);
        read(fd2[0], buffer, 25);
        printf("\n자식출력: %s\n", buffer);

    }
    else
    {
        write(fd2[1], "(부모에서 입력)", 25);
        read(fd1[0], buffer, BUFSIZE);
        printf("\n부모출력: %s\n", buffer);
    }
    return (0);
}
```
<kkr>
<rmk>/* 출력 */</rmk><br>
<br>
자식출력: (부모에서 입력)<br>
<br>
부모출력: (자식에서 입력)<br>
<br>
</kkr>

* 위처럼 `fork()`함수와 `pipe()`함수를 조합해서 간단한 예시를 만들어 봤습니다.
* `파이프`는 `FIFO`방식으로 동작하기 때문에 **2개**를 만들어주어 일방통행으로 사용하도록 했습니다. 그렇게 되면 **각각의 프로세스**에서 안쓰는 `fd`가 생기게 되는데 적절히 `close()`함수로 닫아주면 될 것같습니다. <b style="font-size:85%">(위의 예시에서는 생략)</b>

* * *
<h2 style="color:#0e435c;">(1) 동작방식 실험1</h2>

* 위의 예시에서 **자식 프로세스**와 **부모 프로세스**가 독립되어 있지만 출력부분을 보면 **입,출력**이 꼬이지 않고 **동시에** 출력되었습니다. <b style="color:blue">절차지향형</b>으로 프로그래밍이 진행된다는 것을 생각한다면 다소 이해가 되지않았습니다.

```c
/* 코드 생략 */

if (pid == 0)
{
    write(fd1[1], "(자식에서 입력)\n", 25);
    read(fd2[0], buffer, 25);
    printf("\n자식출력: %s\n", buffer);
}
else
{
    //write(fd2[1], "(부모에서 입력)", 25);
    read(fd1[0], buffer, BUFSIZE);
    printf("\n부모출력: %s\n", buffer);
}
```
<kkr>
<rmk>/* 출력 */</rmk><br>
<br>
부모출력: (자식에서 입력)<br>
<br>
</kkr>

* 위와같이 **부모 프로세스**에서 <rd>입력</rd>을 하지 않아봤습니다.
* **자식 프로세스**에서 `read()`함수가 읽을 함수가 **읽을fd**가 있을 떄까지 대기하고 있음을 알 수 있습니다. 위의 예시에서는 **읽을 fd**가 없어서 아래의 `printf()`함수를 호출하지않고 그 지점에서 중단됐음을 알 수 있습니다.

* * *
<h2 style="color:#0e435c;">(2) 동작방식 실험2</h2>

```c
/* 코드 생략 */

if (pid == 0)
{
    write(fd1[1], "(자식에서 입력)\n", 25);
    read(fd2[0], buffer, 25);
    printf("\n자식출력: %s\n", buffer);

}
else
{
    wait(NULL);  // wait함수 추가
    write(fd2[1], "(부모에서 입력)", 25);
    read(fd1[0], buffer, BUFSIZE);
    printf("\n부모출력: %s\n", buffer);
}
```
<kkr>
<rmk>/* 출력 */</rmk><br>
<br>
</kkr>

* 이번에는 **부모프로세스**에서 **입력**을 하기전에 `wait()`함수를 이용하여 대기를 시켜줬습니다.
* 결국 서로 입력값을 못찾아서 **아무것도 출력되지 않은 채 종료되었습니다.**
