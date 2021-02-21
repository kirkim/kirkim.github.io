---
layout: post
title:  "[C]저수준 파일입출력 함수(2)[fd(파일디스크립터), fopen]"
subtitle:   ""
date: 2021-02-21 02:45:51 +0900
categories: c
tags: inout
comments: true
---

<h2>5️⃣ read함수</h2>
<h4 align="middle">&#60;함수원형 &#62;</h4>
```c
ssize_t read(int fides, void *buf, size_t nbytes);
//윈도우에선 int형
```

* **read함수**는 파일에서 nbytes값의 크기만큼 바이트를 읽어서 buf에 저장합니다.
* 오류가 발생하면 -1을 반환하고 성공할 시 읽어온 바이트 수를 리턴합니다.

<h4 align="middle">&#60;함수원형 &#62;</h4>
```c
ssize_t read(int fides, void *buf, size_t nbytes);
//윈도우에선 int형
```
<br />
<h3 align="left">&#60; open함수 예시 &#62;</h3>
```c
#include <sys/stat.h>          // mode_t
#include <fcntl.h>
#include <unistd.h>            // 윈도우에선 <io.h>헤더
#include <stdio.h>
#include <stdlib.h>           // exit함수

#define BUFFER (10)

int main(void)
{
    int fd, n1, n2;
    mode_t mode;      // 윈도우에선 unsigned short 형식자로 바꿔서 사용
    char buf1[BUFFER];
    char buf2[BUFFER];

    mode = 0644;             // mode(권한옵션)을 8진수로 저장

    if(!(fd = _open("test.txt",O_RDONLY, mode)))
    {
        perror("Open");
        exit(1);
    }
    n1 = read(fd, buf, BUFFER - 1);     // 마지막에 '\0'을 넣어주기 위해 "BUFFER - 1"크기로 설정
    n2 = read(fd, buf2, BUFFER - 1);   // read함수의 오프셋이 이어짐을 확인하기위해 read()함수를 2번실행
    if (n == -1 || n2 == -1)
    {
        close(fd);
        perror("Read");
        exit(1);
    }
    buf[n1] = '\0';        //read()함수가 읽어들인 값을 반환함을 이용하여 '\0'값을 넣어준다
    buf2[n2] = '\0';
    
    printf("n = %d, buf = %s\nn2 = %d, buf = %s\n", n1, buf1, n2, buf2);
    close(fd);

    return (0);
}
/*---test.txt파일 내용---*/
abcdefghijklmn
/*---결과---*/
n1 = 9, buf1 = abcdefghi
n2 = 5, buf2 = jklmn
```
위의 코드를 보면 알듯이 read함수는 호출때마다 읽어온 크기만큼 오프셋이 이동하여 다음 읽어올 위치를 가르키고 있습니다. (프로그램이 종료하거나 EOF를 만나면 초기화)

* * *
<h2>6️⃣ write함수</h2>
<h4 align="middle">&#60;함수원형 &#62;</h4>
```c
ssize_t write(int fildes, const void* buf, size_t nbytes);
//윈도우에선 int형
```
* **write함수**는 buf에서 nbytes값의 크기만큼 바이트를 읽어서 파일 기술자(fd)에 작성합니다.
* 오류가 발생하면 -1을 반환하고 성공할 시 쓰기를 수행한 바이트 수를 리턴합니다.

<br />
<h3 align="left">&#60; 표준입력을 이용한 write함수의 간단한 예 &#62;</h3>
```c
#include <unistd.h>

int main(void)
{
    char str[] = "Hello";
    write(1, str, sizeof(str));
}
```

* * *
<h2>7️⃣ lseek함수</h2>
<h4 align="middle">&#60;함수원형 &#62;</h4>
```c
off_t lseek(int fildes, off_t offset, int whence);
//윈도우에선 long형
```
<h4 align="middle">&#60; whence &#62;</h4>

|값|설명|
|:--:|:--:|
|SEEK_SET|파일의 시작 기준|
|SEEK_CUR|현재 위치 기준|
|SEEK_END|파일의 끝 기준|

* **lseek함수**는 열린 파일 지정자(fd)로 부터 offset만큼 위치를 변경합니다.<br />이 때 whence의 값을 기준으로 offset을 계산합니다.
* 실패했을 경우 -1을 리턴하고 성공했을 경우 파일의 시작으로 부터 떨어진 byte만큼의 offset을 리턴합니다.
* 고수준파일 입출력함수에서 배운 `fseek함수`와 `파일스트림(stream)`을 받는지 `파일디스크립터(fd)`를 받는지의 차이만 있을뿐 동작하는 방식과 쓰임은 비슷합니다.