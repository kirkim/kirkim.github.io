---
layout: post
title: "[pipex](4)main함수 구성 및 파싱하기"
subtitle: ""
date: 2021-08-10 02:45:51 +0900
categories: 42seoul
tags: pipex
comments: true
---

---

<h1>1️⃣ 목표</h1>

1. main함수 구성하기
2. <b style="color:green">사용가능</b>하도록 <rd>파싱(parsing)</rd>하는 함수 구현하기
3. **파싱된 것들**이 <b style="color:green">유효한파일 및 경로</b>인지 **확인**하는 함수 구현하기
   <br><br>

---

<h1>2️⃣ main함수 구성하기</h1>
<h2 style="color:#0e435c;">(1) argc, argv</h2>

- **기본파트**에서 `pipex`프로그램은 다음과 같이 실행합니다.
  <kkr>
  ./pipex file1 cmd1 cmd2 file2<br>
  </kkr>

- 즉, 실행과 동시에 입력값을 받기 위해서 **main함수**를 `argc, argv`인자를 받도록 만들어야 합니다.
- `argc`의 값은 반드시 `5`가 되어야 합니다.

---

<h2 style="color:#0e435c;">(2) 환경변수</h2>

- 또한, 이 프로그램은 `execve()`함수를 이용하게 되는데 `execve()`함수의 **세번째 인자**로 <b style="color:green">환경 변수</b>를 받습니다. 지금 제 **프로그램 환경**에서는 `/bin`과 `/usr/bin`경로 두곳에 <rd>커맨드 명령어</rd>파일이 있습니다. 하지만 **모든 프로그램 환경**에서 **이와 같은 경로를 갖는다고 보장할 수 없습니다.**
- 다행히 **프로그램의 환경변수**를 불러오는 방법은 여러가지가 있습니다.
  1.  &lt;stdlib.h&gt; 의 `getenv()`함수를 호출하는 방법
  2.  광역변수로 `extern char **environ`을 정의하여 사용하는 방법
  3.  `main()`함수에 `char **envp`매개변수를 추가하는 방법
- 위의 방법중 **세번째 방법**을 이용하도록 하겠습니다.

```c
int main(int argc, char **envp)
{
    int i ;

    i = 0;
    while (i < 80)
    {
        printf("<%d> %s\n", i, envp[i]);
        i++;
    }
}
```

<details>
<summary><b class="lit2">코드실행 결과 출력값 보기 (클릭)</b></summary>
	<kkr>
		<rmk>/* 출력 */</rmk>
		<0> ./a.out<br>
		<1> (null)<br>
		<2> USER=kimkirim<br>
		<3> __CFBundleIdentifier=com.microsoft.VSCode<br>
		<4> COMMAND_MODE=unix2003<br>
		<5> LOGNAME=kimkirim<br>
		<6> PATH=/Users/kimkirim/.local/bin:/opt/homebrew/bin:/opt/homebrew/sbin: ...<br>
		...<br>
		<69> arm64e_abi=os<br>
		<70> (null)<br>
		zsh: segmentation fault  ./a.out<br>
	</kkr>
	<br>
	이런식으로 <b>간단한 방법</b>으로 <b>프로그램의 환경변수들</b>을 얻어올 수 있습니다.
</details>

---

<h2 style="color:#0e435c;">(3) main함수 설계하기</h2>

```c
int main(int argc, char **argv, char **envp)
{
    t_god god;

    if (argc == 5)
    {
        ft_memset(&god, 0, sizeof(t_god));
        god.envp = envp;
        /* To Do List*/
        // 1. 파싱함수
        // 2. 파싱체크
        // 3. pipex 주요기능 작동함수(pipex_master)
    }
    else
        return (exit_err("wrong command count!"));
    return (0);
}
```

- 위와같이 <b style="color:blue">main함수</b>**의 큰 틀**이 완성되었습니다.
- 이어서 <b>/_ To do list _/의 내용</b>을 하나씩 구현하겠습니다.
  <br><br>

---

<h1>3️⃣ 파싱함수 구현하기</h1>

---

<h2 style="color:#0e435c;">(1) parse_cmd()</h2>

```c
int parse_cmd(t_god *god, char **argv, char **envp)
{
    char	*temp_path;

    god->infile = ft_strdup(argv[1]);
    god->ps[0].cmd = ft_split(argv[2], ' ');
    check_slash(&god->ps[0], argv[2]);
    god->ps[1].cmd = ft_split(argv[3], ' ');
    check_slash(&god->ps[1], argv[3]);
    god->outfile = ft_strdup(argv[4]);
    temp_path = find_path(envp);
    if (temp_path == NULL && (god->ps[0].slash == FALSE || god->ps[1].slash == FALSE))
        return (exit_err("wrong path!\n"));
    god->path = ft_split(temp_path, ':');
    free(temp_path);
    return (SUCCESS);
}
```

- `parse_cmd()`함수는 **main함수**의 인자 `argv, envp`를 그대로 받아옵니다.
- <b style="color:blue">argv[1]</b>을 **infile**변수에 **그대로 저장**해줍니다.
- <b style="color:blue">argv[2]</b>와 <b style="color:blue">argv[3]</b>는 각각 `cmd1`과 `cmd2`를 나타내는데 **커맨드**는 `공백`을 제외하고 변수에 저장해주도록 했습니다. 커맨드가 **옵션**을 포함하고 있을 수도 있기 때문입니다 . <b style="font-size:85%">(ex&gt; `ls -l`)</b>
- 또한 `cmd1`과 `cmd2`가 `/bin/ls`, `./ls`, `../ls`와 같이 입력하는 경우를 대비하여 `check_slash()`함수를 호출하여 검사해주도록 했습니다. <b style="font-size:85%">(이런식의 커맨드명령어들은 추후에 `path`와 결합해주는 과정을 생략&lt;slash변수에 표시&gt;)</b>

```c
void check_slash(t_ps *ps, const char *temp)
{
    if (ft_strncmp(temp, "/", 1) == 0
        || ft_strncmp(temp, "./", 2) == 0 || ft_strncmp(temp, "../", 3) == 0)
        ps->slash = TRUE;
}
```

- <b style="color:blue">argv[4]</b>는 **outfile**변수에 **그대로 저장**해줍니다.
- **main함수**에서 받은 `envp`는 `PATH=`(경로)부분만 찾아서 `temp_path`변수에 저장해줍니다.
- 경로는 `PATH=`이후에 `:`로 구분되어 여러가지 경로를 포함하고 있습니다. `split()`함수를 이용하여 **모든 경로**를 추출해주도록 했습니다.

---

<h2 style="color:#0e435c;">(2) find_path()</h2>

- **main함수**에서 받은 `envp`에서 `PATH=`(경로)부분만 찾아서 저장해주는 함수입니다.

```c
static char *find_path(char **envp)
{
    int		i;
    char	*ret_path;

    i = 0;
    while (envp[i] != NULL)
    {
        if (ft_strncmp("PATH=", envp[i], 5) == 0)
        {
            ret_path = ft_strdup(envp[i] + 5);
            return (ret_path);
        }
        i++;
    }
    return (NULL);
}
```

<br><br>

---

<h1>4️⃣ 파싱체크함수 구현하기</h1>
<h2 style="color:#0e435c;">(1) check_parse()</h2>

```c
int check_parse(t_god *god)
{
    god->infile_fd = open(god->infile, O_RDWR);
    if (god->infile_fd < 0)
        return (exit_perror("not valid infile!"));
    god->outfile_fd = open(god->outfile, O_RDWR | O_CREAT | O_TRUNC, 0644);
    if (god->outfile_fd < 0)
        return (exit_perror("not valid outfile!"));
    check_commands(god);
    return (SUCCESS);
}
```

- `infile`과 `outfile`에는 **경로의 형식**으로 데이터가 저장되어 있습니다. 그렇기에 단순히 `access`함수를 사용하여 **유효한 파일인지**만 체크 해주어도 되지만 나중에 이파일들의 `fd`가 필요하기 때문에 `opne()`함수를 이용하여 진행하였습니다. <b style="font-size:85%">(`outfile`의 경우 파일이 존재하지 않을 수도 있기 때문에 `access()`로 체크를 못해주긴 함)</b>
- `infile`에서 데이터를 얻어야하므로 반드시 존재해야하는 파일입니다. 그렇기 때문에 `O_RDWR`(읽기/쓰기용)의 옵션만 사용하여 열어주고 <b style="color:blue">파일이 없는 경우</b>오류를 출력해주도록 했습니다.
- 반대로 `outfile`은 단순히 **커맨드명령어**를 수행하고 <rd>최종출력값을 저장</rd>하는 목적입니다. 즉, 존재하지않는 파일이여도 됩니다. 하지만 <b style="color:blue">이미 존재하는 경우</b> 기존의 **파일내용을 모두 지워주기**위해 `O_TRUNC`옵션도 사용해 주었습니다.
- 이제 `check_commands()`함수로 <b style="color:green">"파싱된 커맨드가 유효한 커맨드인지"</b>만 검사해주면 됩니다.

---

<h2 style="color:#0e435c;">(2) check_commands()</h2>

- **커맨드를 체크**해주는 함수이지만 사실 여기서 **커맨드를 사용할 수 있도록 제대로 파싱**을 해줍니다.

```c
void check_commands(t_god *god)
{
    int i;

    i = 0;
    while (i < 2)
    {
        if (god->ps[i].slash == FALSE)
        {
            if (set_cmd(god, &god->ps[i]) == ERROR)
                exit_err("command not found!\n");
        }
        else
            god->ps[i].path = ft_strdup(god->ps[i].cmd[0]);
        i++;
    }
}
```

- `ps[0]`구조체에 `cmd1`명령어가, `ps[1]`구조체에 `cmd2`명령어가 저장되어 있습니다. 추후에 <rd>bonus part(보너스 파트)</rd>에서는 커맨드가 2개가 아닌 여러개를 사용할 수 있도록 구현해야 합니다. 지금 당장에 구현할 수 없지만 **커맨드들**이 모두 같은 **메커니즘**과 **변수들**을 사용할 것으로 예상되기 때문에 <b style="color:green">배열형식으로 저장</b>하였습니다.
- 같은이유로 당장에는 반복문이 <rd>두번</rd>만 돌지만 `while`문으로 만들어 주었습니다.
- 위에서도 언급했듯이 `slash`변수는 `/`, `./`, `../`의 형식으로 <b style="color:blue">경로형식의 명령어</b>인지 표시해줍니다. 이 변수가 <rd>FALSE(거짓)</rd>이라면 `set_cmd()`함수를 이용하여 **경로(path)**와 **명령어(cmd)**를 합쳐서 <rd>재파싱</rd>해줍니다.

---

<h2 style="color:#0e435c;">(3) set_cmd()</h2>

```c
int set_cmd(t_god *god, t_ps *ps)
{
    int	i;
    char *temp_path;
    char *temp_cpath;

    i = 0;
    while (god->path[i])
    {
        temp_path = ft_strjoin(god->path[i], "/");
        temp_cpath = ft_strjoin(temp_path, ps->cmd[0]);
        if (access(temp_cpath, F_OK) == 0)
        {
            ps->path = ft_strdup(temp_cpath);
            free(temp_path);
            free(temp_cpath);
            return (SUCCESS);
        }
        free(temp_path);
        free(temp_cpath);
        i++;
    }
    return (ERROR);
}
```

- `god->path`에는 `envp`에서 추출한 **모든 경로**들이 배열형식으로 저장되어 있습니다.
- **반복문**을 돌리며 <b style="color:green">모든 경로</b>를 **하나씩** <b style="color:green">커맨드(cmd)</b>와 결합하여 `access()`함수를 이용하여 유효한 파일인지 **체크**를 합니다.
- <b style="color:blue">유효한 조합</b>을 찾자마자 **변수를 저장**하고 함수를 종료해 줍니다.
- 만약 **모든 경로**를 탐색했는데도 **유효한 조합**을 찾지 못하면 **에러**값을 반환합니다.

<!--
<script>
	const lit2 = document.querySelector(".lit2");
	function handleMouse2() {
		lit2.style.color = "orange";
	}

	function handleMouseLeave2() {
		lit2.style.color = "black";
	}

	lit2.addEventListener("mouseenter", handleMouse2);
	lit2.addEventListener("mouseleave", handleMouseLeave2);
</script>
-->
