---
layout: post
title:  "[ft-server]"
subtitle:   ""
date: 2021-05-08 02:45:51 +0900
categories: 42seoul
tags: server
comments: true 
---

* * *
<h1>1️⃣ ft_server과제</h1>
<h2 style="color:#0e435c;">(1) 목표</h2>

* <b><rd>"docker"</rd></b>라는 기술을 이용하여 완전한 웹서버를 구축하기
* 구축할 다중 서비스: Wordpress, phpMyAdmin, SQL 데이터베이스 등
<h2 style="color:#0e435c;">(2) 조건</h2>

* 서버 구성에 필요한 모든 파일을 <b>"srcs"폴더</b>안에 저장할 것
* <b>"Dockerfile"</b>파일은 repository 경로에 있어야합니다. 그것이 컨테이너를 빌드할 것이며 "docker-compose"를 사용할 수 없습니다.
* <b>"WordPress"</b>웹 사이트에 필요한 모든 파일은 <b>srcs폴더</b>에 있어야합니다.

<h2 style="color:#0e435c;">(3) Mandatory part(필수 파트)</h2>

* 오직 하나의 <b>docker 컨테이너</b>만 <b>Nginx</b>로 웹서버를 설정해야하며 그 컨데이너의 OS는 <b>데비안 버스터</b>여야 합니다.
* 웹서버가 동시에 실행할 수 있어야합니다.(WordPress, phpMyAdmin, MySQL)
* WordPress웹사이트, phpMyAdmin 그리고 MySQL이 작동하는지 확인해야 합니다.
* 서버가 <b>SSL protocol</b>을 사용할 수 있어야합니다.
* URL에 따라 서버가 올바른 웹 사이트로 <b>리디렉션</b>되는지 확인해야합니다.
* 비활성화 시킬 수있는 <b>autoindex(자동 색인)</b>옵션이 있는 서버를 만들 수 있어야하 합니다.
<br /><br />

* * *
<h1>2️⃣ Docker</h1>

* <b><rd>Docker</rd></b>는 새로운 환경에서의 개발환경구축에 있어서 큰도움을 줍니다. 또한 환경에 구애받지않고 원하는 웹사이트를 접속할 수 있도록 도와줍니다.
* VMWARE, virtual machine 등등 가상머신과도 같은 기능을 하지만 훨씬 효율적인 기능을 합니다.
* 다음의 영상을 보면 도커의 기능에 대해 쉽게할 수 있습니다.<br >
<h3 style="color:#0e435c;">(1) Docker 기본영상</h3>
<a href="https://www.youtube.com/watch?v=chnCcGCTyBg" target="blank">&gt;&gt;&gt;노마드 코더 - Docker 5분설명</a><br>
<a href="https://www.youtube.com/watch?v=tPjpcsgxgWc" target="blank">&gt;&gt;&gt;얄팍한 코딩사전 - 도커란?</a><br>
<h3 style="color:#0e435c;">(2) Docker 간단예제 구현영상</h3>
<a href="https://www.youtube.com/watch?v=Ei-uVxSBo1s" target="blank">&gt;&gt;&gt;닥코daqko - 도커 사용법</a><br>
<a href="https://www.youtube.com/watch?v=hWPv9LMlme8" target="blank">&gt;&gt;&gt;얄팍한 코딩사전 - 가장 쉽게 배우는 도커</a><br>
<h2 style="color:#0e435c;">&lt; Docker 명령어 &gt;</h2>
<img src="https://kirkim.github.io/assets/img/server/server2.png" width="100%" alt="docker_commandlist">
<br /><br />

* * *
<h1>3️⃣ 데비안 버스터</h1>

* 이번에 구현할 도커 컨테이너의 OS는 <rd>데비안 버스터</rd>입니다.
* <b><rd>데비안</rd></b>는 유닉스 계열의 운영체제로 <rd>버스터</rd>는 데비안의 버전중 하나입니다.
<h2 style="color:#0e435c;">(1) 데비안 버스터 이미지 생성</h2>

* 개인적으로 도커컨테이너에 필요한 파일과 설정값등을 포함하고 있는 설계도와 같은 역할을 하는 것이 <rd>image(이미지)</rd>입니다.
* 우리는 데비안 버스터OS의 이미지를 생성해 주어야합니다.
<kkr>
docker pull debian:buster<br />
</kkr>
* buster버전의 debian의 이미지가 생성되며 다음과 같은 명령어로 image(이미지)목록을 확인할 수 있습니다.
<kkr>
docker images<br />
</kkr>
<img src="https://kirkim.github.io/assets/img/server/server1.png" width="100%" alt="image_list">
<h2 style="color:#0e435c;">(2) 데비안 버스터 이미지를 사용한 컨테이너접속하기</h2>
<kkr>
docker run -it --name kir_debian -p 127.0.0.1:80:5000 debian:buster
</kkr>

* `run`: 새로운 컨테이너를 생성합니다.
* `-it`: -i옵션과 -t옵션을 사용한 것으로 터미널에서 표준입출력을 활성화 시킬 수 있습니다.
* `--name`: 컨테이너의 이름을 설정합니다.
* `-p [호스트의 포트]:[컨테이너의 포트]`: 호스트의 포트를 컨테이너포트로 포팅해주는 옵션입니다. 자세한 설명은 다음의 링크에서 '-p옵션'부분의 설명을 참고하시면 됩니다.<a href="https://docs.docker.com/network/links/#connect-using-network-port-mapping" target="blank">docker docs </a>
<kkr>
root@6d6ea18beb98:/#<br />
</kkr>

* 위와같이 사용자이름이 바뀐 것으로 <rd>현재열린터미널이 방금생성한 컨테이너 그자체로 설정됬음</rd>을 확인할 수 있습니다.
<kkr>
root@6d6ea18beb98:/# ls<br />
bin  boot  dev	etc  home  lib	media  mnt  opt  proc  root  run  sbin	srv  sys  tmp  usr  var<br />
</kkr>

* `ls`명령어를 쳐보면 <rd>debian buster</rd>운영체제안에서의 초기환경의 모습을 확인할 수 있습니다.
<h2 style="color:#0e435c;">(3) 컨테이너를 다루는 몇가지 명령어</h2>

* 이 터미널은 방금생성한 <rd>debian buster운영체제 컨테이너</rd> 그 자체이기 때문에 새로운 <b>docker명령어</b>를 수행하기 위해서는 새로운 터미널에서 진행해야 합니다.
* 다음과 같이 현재 열린 컨테이너 목록을 확인할 수 있습니다.
<kkr>
$>docker ps<br />
</kkr>
<img src="https://kirkim.github.io/assets/img/server/server3.png" width="100%" alt="container_list">

* 추가로 `-a`옵션을 주면 <b>닫혀있는 컨테이너</b>까지 포함한 목록을 보여주게 됩니다.
* 다음의 명령어로 컨테이너를 조작 할 수 있습니다.
<kkr>
docker kill 컨테이너이름<rmk>// 열린 컨테이너 종료</rmk><br />
docker start 컨테이너이름<rmk>// 중지된 컨테이너 시작</rmk><br />
docker restart 컨테이너이름<rmk>//열린 컨테이너 재시작</rmk><br />
docker attach 컨테이너이름<rmk>//열린 컨테이너 접속</rmk><br />
docker rm 컨테이너이름<rmk>//컨테이너 제거</rmk><br />
</kkr>

