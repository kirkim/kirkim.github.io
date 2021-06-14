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
* 어떻게 보면 VMWARE, virtual machine 등등 가상머신과 비슷한 기능을하지만 도커는 좀 더 특별합니다.(아래 영상 참고)
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
docker run -it --name kir_debian -p 80:80 -p 443:443 debian:buster
</kkr>

* `run`: 새로운 컨테이너를 생성합니다.
* `-it`: -i옵션과 -t옵션을 사용한 것으로 터미널에서 표준입출력을 활성화 시킬 수 있습니다.
* `--name`: 컨테이너의 이름을 설정합니다.
* `-p [호스트의 포트]:[컨테이너의 포트]`: 호스트의 포트를 컨테이너포트로 포팅해주는 옵션입니다. 자세한 설명은 다음의 링크에서 '-p옵션'부분의 설명을 참고하시면 됩니다.<a href="https://docs.docker.com/network/links/#connect-using-network-port-mapping" target="blank">docker docs </a>
<kkr>
root@0d7f2430dcf0:/#<br />
</kkr>

* 위와같이 사용자이름이 바뀐 것으로 <rd>현재열린터미널이 방금생성한 컨테이너 그자체로 설정됐음</rd>을 확인할 수 있습니다.
<kkr>
root@id#> ls<br />
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
docker kill 컨테이너이름&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<rmk>// 열린 컨테이너 종료</rmk><br />
docker start 컨테이너이름&nbsp;&nbsp;&nbsp;<rmk>// 중지된 컨테이너 시작</rmk><br />
docker restart 컨테이너이름<rmk>//열린 컨테이너 재시작</rmk><br />
docker attach 컨테이너이름<rmk>//열린 컨테이너 재접속</rmk><br />
docker rm 컨테이너이름&nbsp;&nbsp;&nbsp;&nbsp;<rmk>//컨테이너 제거</rmk><br />
</kkr>
<br /><br />

* * *
<h1> 4️⃣ nginx</h1>

* <b><rd>nginx</rd></b>는 웹서버 중 하나로 가볍고 빠른 웹서버입니다.<br />
참고하면 좋을 영상: <a href="https://www.youtube.com/watch?v=VfluK3D-fmQ" target="blank">생활코딩 - NGINX소개</a>
<h2 style="color:#0e435c;">(1) debian(데비안)에 nginx 설치</h2>
<kkr>
apt-get -y update <rmk>// 설치가능패키지리스트 업데이트</rmk><br />
apt-get -y upgrade <rmk>// 패키지리스트참고하여 최신 버전 업그레이드</rmk><br />
apt-get -y install nginx <rmk>//nginx 설치</rmk><br />
</kkr>

* `-y`는 설치확인을 스킵해주는 용도입니다.
<h2 style="color:#0e435c;">(2) nginx 연결</h2>

* `nginx`를 입력하거나 `service nginx start`를 입력하여 연결합니다.

|설명|Nginx명령어|service명령어|
|:--:|:--:|:--:|
|시작|nginx|service nginx start|
|중지|nginx -s stop|service nginx stop|
|재시작|nginx -s reload|service nginx restart 혹은 reload(약간다름)|

* 어떤 명령어를 사용하든 상관없지만 <b>service</b>명령어가 좀 더 가시적입니다.
<kkr>
root@id#> service nginx start<br />
[ <b style="color:#009926;">ok</b> ] Starting nginx: nginx.<br />
root@id#> service nginx status<br />
[ <b style="color:#009926;">ok</b> ] nginx is running.<br />
</kkr>

* localhost에 접속하여 다음과 같은 화면이 뜨면 성공
<img src="https://kirkim.github.io/assets/img/server/server4.png" width="100%" alt="conect_localhost">
<br /><br />

* * *
<h1>5️⃣ SSL</h1>

* SSL에 대한 내용은 다음의 <b>'생활코딩'</b>님의 영상을 통해서 쉽게 알 수 있습니다.
1. <a href="https://www.youtube.com/watch?v=0cfUVrQW_yg" target="blank">생활코딩 - https와ssl이란무엇인가</a>
2. <a href="https://www.youtube.com/watch?v=8R0FUF_t_zk" target="blank">생활코딩 - ssl 통신과정</a>

* 기존에 도커 컨테이너를 생성했을 때 `-p 80:80`옵션을 사용하여 80번포트만 배정했었는데 ssl인증서를 통한 https를 사용하기 위해 `-p 443:443`옵션을 사용하여 443포트도 배정해주어 컨테이너를 다시생성해 주었습니다. 그 이유에 대해서는 아래 링크의 사이트에서 자세히 알 수 있습니다.<br />
<a href="https://johngrib.github.io/wiki/why-http-80-https-443/" target="blank">http의 기본 포트가 80, https의 기본 포트가 443인 이유는 무엇일까?</a>

* 무료인증서의 종류가 몇가지 있지만 비교적 인터넷에 정보가 많은 `openssl`인증서를 사용했습니다.
* 다음 명령어로 `openssl`을 인스톨해줍니다.
<kkr>
apt-get -y install openssl<br />
</kkr>

* `openssl`을 이용하는 방법은 다음 사이트를 참고했습니다.<br />
<a href="https://blog.hangadac.com/2017/07/31/%ED%99%88%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95%EA%B8%B0-ssl-%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EC%97%B0%EC%8A%B5/" target="blank">[홈서버 구축기] SSL 인증서 만들기</a><br />
<a href="https://namjackson.tistory.com/24" target="blank">[[SSL]HTTPS통신을 위한 SSL인증서 발급하기(OpenSSL)</a><br />

* 이번에 이용할 인증서를 만드는 순서를 간단하게 말한다면 다음과 같습니다.
    1. 개인키를 만든다
    2. CSR(인증서명요청.Certificate Signing Request)를 만들어 개인키를 넣는다.
    3. CSR을 명시적으로 넣어 인증서를 생성
* 위의 순서를 바탕으로 다음과 같이 진행했습니다.
    1. 먼저 <rd>개인키</rd>를 생성합니다.
    <img src="https://kirkim.github.io/assets/img/server/server5.png" width="100%" alt="ssl1">

    2. <b><rd>개인키</rd></b>를 이용하여 <rd>공개키</rd>도 생성할 수 있습니다.
    <img src="https://kirkim.github.io/assets/img/server/server6.png" width="100%" alt="ssl2">

    3. <b><rd>개인키(private.key)</rd></b>를 이용하여 .csr파일(Certificate Signing Request,인증 서명 요청)파일을 생성합니다.(정보입력창이 자동 생성)
    <img src="https://kirkim.github.io/assets/img/server/server7.png" width="100%" alt="ssl3">

    4. <b><rd>.csr파일</rd></b>을 <rd>.crt확장자 파일</rd>로 만들어줍니다.
    <img src="https://kirkim.github.io/assets/img/server/server8.png" width="100%" alt="ssl3">

    5. <b>공개키와 crt파일을 적절한 위치로 옮겨준 뒤 권환을 다음과 같이 바꿔줍니다.
    <img src="https://kirkim.github.io/assets/img/server/server9.png" width="100%" alt="ssl3">

* 이번에 인증서를 처음 생성해보기 때문에 하나하나의 과정을 거쳐보았습니다. 그러나 훨씬 더 간단하게 생성하는 방법도 있습니다.
* 인증서의 종류, 생성방법들이 다양하기 때문에 상황에 따라서 인증서를 적절히 선택하고 자신에게 편한 방법을 찾아서 생성하는 것이 좋을 것 같습니다.
<br />

* <b>생성한 ssl인증서</b>를 nginx에 경로를 카르쳐줘야 합니다.
<kkr>
apt-get -y install vim<br />
vim etc/nginx/sites-available/default<br />
</kkr>
<br />
<kkr>
server {<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;listen 80 default_server;<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;listen [::]:80;<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 301 https://$host$request_uri;<br />
}<br />
<br />
server {<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;listen 443;<br />
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ssl on;<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ssl_certificate /etc/ssl/certs/private.crt;<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ssl_certificate_key /etc/ssl/private/private.key;<br />
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root /var/www/html;<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;. . .<br />
</kkr>

* `service nginx reload`를 해준 뒤 `localhost`주소로 들어가면 다음과 같이 바꼈음을 확인할 수 있습니다.
<img src="https://kirkim.github.io/assets/img/server/server10.png" width="100%" alt="ssl4">

* 위의 사이트위에서 `thisisunsafe`를 입력하시면 경고를 무시하고 사이트를 출력해줍니다.
* 인증서가 사이트에 정상적으로 등록되었음을 확인할 수 있습니다.
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <img src="https://kirkim.github.io/assets/img/server/server11.png" width="100%" alt="ssl5">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <img src="https://kirkim.github.io/assets/img/server/server12.png" width="100%" alt="ssl6">
    </div>
</div>
<br /><br />

* * *
<h1>6️⃣ autoindex추가하기</h1>

* 다시 다음파일에 들어가서 내용을 추가해줍니다.
<kkr>
vim etc/nginx/sites-available/default<br />
<br />
<rmk>/* default */</rmk><br />
server_name _;<br />
<br />
location / {<br />
&nbsp;&nbsp;&nbsp;&nbsp;<rmk># First attempt to serve request as file, then</rmk><br />
&nbsp;&nbsp;&nbsp;&nbsp;<rmk># as directory, then fall back to displaying a 404.</rmk><br />
&nbsp;&nbsp;&nbsp;&nbsp;autoindex on; // <rmk>// 추가</rmk><br />
&nbsp;&nbsp;&nbsp;&nbsp;try_files $uri $uri/ =404;<br />
}<br />
</kkr>

* 그리고 `val/www/html/`경로에 임시로 만들어져있던 `index.nginx-debian.html`파일을 삭제해 줍니다.
* `default`파일에 `index`항목에서도 제거해줍니다.
<kkr>
index index.html index.htm index.nginx-debian.html<rmk> //index.nginx-debian.html 지워줍니다.</rmk><br />
</kkr>

* `service nginx reload`로 재로드 후 <a href="https://localhost/">localhost주소</a>에 접속하면 <rd>autoindex</rd>된 화면을 볼 수 있습니다.
<br /><br />

* * *
<h1>7️⃣ php-fpm 설치</h1>

* 다음의 명령어를 입력하여 `php-fpm`을 설치해준 뒤 nginx에 경로를 가르쳐 줍니다.
<kkr>
apt-get -y install php-fpm<br />
vim /etc/nginx/sites-available/default<br />
</kkr>
<img src="https://kirkim.github.io/assets/img/server/server13.png" width="100%" alt="php1">

* 주석처리되어 있느부분에서 필요한부분의 주석을 제거해주면 됩니다.
<kkr>
index index.html index.htm index.php;
</kkr>

* 그리고 위쪽에 `index`항목에 `index.php`을 추가해 줍니다.
* 다음의 명령어로 `mariaDB`를 설치해줍니다.(<a href="https://dololak.tistory.com/766" taget="blank">사이트: mariaDB란?)</a>
<kkr>
apt-get -y install mariadb-server php-mysql<br />
</kkr>
<br /><br />

* * *
<h1>8️⃣ phpmyadmin 설치</h1>
<h4><a href="https://yeosong1.github.io/ftserver-%ED%92%80%EC%9D%B4%EA%B8%B0%EB%A1%9D#-%EB%8F%84%EC%BB%A4-x-%EB%8D%B0%EB%B9%84%EC%95%88-%EB%B2%84%EC%8A%A4%ED%84%B0-x-nginx-x-php-fpm%EC%97%90--mariadbmysql-%EC%84%A4%EC%B9%98" target="blank">(참고: yeosong1위키블로그)</a></h4>

* <b>debian</b>에서 <rd>phpmyadmin</rd>을 설치하기 위해서는 왭에서 다운을 받아야되는데 그 도구로 `wget`을 사용합니다.
<kkr>
apt-get install -y wget<br />
<br />
wget https://files.phpmyadmin.net/phpMyAdmin/5.0.2/phpMyAdmin-5.0.2-all-languages.tar.gz<br />
</kkr>

* 압축을 풀고 `/var/www/html/`에 위치시킵니다.
<kkr>
tar -xvf phpMyAdmin-5.0.2-all-languages.tar.gz<br />
<br />
mv phpMyAdmin-5.0.2-all-languages phpmyadmin<br />
<br />
mv phpmyadmin /var/www/html/<br />
</kkr>

* 다음의 `php config`샘플 파일표본을 그대로 복사하여 수정해줍니다.
<kkr>
cp -rp var/www/html/phpmyadmin/config.sample.inc.php var/www/html/phpmyadmin/config.inc.php<br /> 
<br />
vim var/www/html/phpmyadmin/config.inc.php<br />
</kkr>

* <b>다음의 사이트</b>에서 암호를 생성하여 <b>다음 부분</b>에 붙여넣습니다.<a href="https://phpsolved.com/phpmyadmin-blowfish-secret-generator/?g=5cecac771c51c" target="blank">암호생성사이트</a>
<kkr>
$cfg['blowfish_secret'] = ' <rd>이 부분에 복붙</rd> '; <rmk>/* YOU MUST FILL IN THIS FOR COOKIE AUTH! */</rmk><br />
</kkr>

* 다음으로 `nginx`리로드 후 `create_tables.sql`테이블을 이용해서 `phpMyAdmin`테이블을 생성합니다.
<kkr>
service nginx reload<br />
service mysql start<br />
mysql < var/www/html/phpmyadmin/sql/create_tables.sql -u root --skip-password<br />
mysqladmin -u root -p password<rmk> // 첫질문엔터(기존패스워드 없음) 후 새로운암호설정</rmk>
</kkr>

* 그 후 `mysql`에 들어가서 워드프레스용 DB를 생성합니다.
<kkr>
root@id#> mysql<rmk> // mysql로 접속</rmk><br />
MariaDB [(none)]><rmk> // MariaDB(mysql)에 접속된 모습</rmk><br />
MariaDB [(none)]> CREATE DATABASE IF NOT EXISTS wordpress;<br />
</kkr>

* 다음처럼 데이터베이스에 추가된 것을 확인할 수 있습니다.

<img src="https://kirkim.github.io/assets/img/server/server14.png" width="80%" alt="mysql">

* `exit`을 입력하거나 `ctrl + c`키를 눌러서 mysql모드에서 나옵니다.
* `service nginx reload`, `service mysql restart`, `service php7.3-fpm start`를 하여 재로드해준다음 다음의 사이트에 접속하여 `phpMYAdmin`이 잘 접속되나 확인합니다.<br />
<a href="https://localhost/phpmyadmin/" target="blank">https://localhost/phpmyadmin/</a><br />

> 사용자명: root, 암호: (위에서 설정한 암호)
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; phpMyAdmin로그인화면 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/server/server15.png" width="80%" alt="mysql">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; phpMyAdmin홈 화면 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/server/server16.png" width="100%" alt="mysql">
    </div>
</div>
<br /><br />

* * *
<h1>9️⃣ Wordpress 설치</h1>

* `Wordpress`또한 `wget`툴을 이용하여 설치해줍니다.
<kkr>
wget https://wordpress.org/latest.tar.gz<br/>
tar -xvf latest.tar.gz<br/>
mv wordpress/ var/www/html/<br/>
chown -R www-data:www-data /var/www/html/wordpress<br/>
</kkr>

* `wordpress config`샘플파일을 복사하여 내용을 수정해 줍니다.
<kkr>
cp var/www/html/wordpress/wp-config-sample.php var/www/html/wordpress/wp-config.php<br />
vim var/www/html/wordpress/wp-config.php<br />
<br />
<rmk>// ** MySQL settings - You can get this info from your web host ** //</rmk><br />
<rmk>/** The name of the database for WordPress */</rmk><br />
define( 'DB_NAME', 'wordpress' );<rmk> // "wordpress"입력</rmk><br />
<br />
<rmk>/** MySQL database username */</rmk><br />
define( 'DB_USER', 'root' );<rmk> // 위에서 지정한 아이디 "root"입력</rmk><br />
<br />
<rmk>/** MySQL database password */</rmk><br />
define( 'DB_PASSWORD', '****' );<rmk> // 위에서 지정한 phpMyAdmin 암호입력</rmk><br />
</kkr>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <br />
        ▪️ <b><rd>service nginx reload</rd></b>로 재로드 후 다음<a href="https://localhost/wordpress" target="blank">https://localhost/wordpress</a>에 들어가서 다음의 화면이 정상출력되면 됩니다.
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; Wordpress홈 화면 &gt;</h4>
        <img src="https://kirkim.github.io/assets/img/server/server17.png" width="100%" alt="mysql">
    </div>
</div>
<br /><br />

* * *
<h1>1️⃣0️⃣ </h1>

* `https`로 정상출력되는지 확인하기위해 `curl`을 다운받습니다.
* `CURL`란? 클라이언트에서 커맨드 라인이나 소스코드로 쉽게 웹 브라우저처럼 활동할 수 있도록 해주는 커맨드
<kkr>
apt-get install -y curl<br />
</kkr>
<h2 style="color:#0e435c;">(1) 도커컨테이너 외부에서 curl 사용</h2>
<h3 align="middle" style="color:#0e435c;">&lt; http &gt;</h3>

* `http`로는 접속이 됩니다.
<img src="https://kirkim.github.io/assets/img/server/server18.png" width="100%" alt="curl1">
<h3 align="middle" style="color:#0e435c;">&lt; https &gt;</h3>

* `https`로 접속하면 오류가 뜹니다.
<img src="https://kirkim.github.io/assets/img/server/server19.png" width="100%" alt="curl2">
<h2 style="color:#0e435c;">(2) 도커컨테이너 안에서 curl 사용</h2>

* 컴테이너 안에서는 `https`로 접속이 가능했습니다.
<img src="https://kirkim.github.io/assets/img/server/server20.png" width="80%" alt="curl3">
<h3 align="middle" style="color:#0e435c;">&lt; 주의할 점 &gt;</h3>

* 인증서의 <rd>사용자명</rd>과 컨테이너의 웹페이지의 <rd>localhost</rd>명이 다르면 다음과 같이 `https`에 접속을 못하고 오류가 출력됩니다.
<img src="https://kirkim.github.io/assets/img/server/server21.png" width="100%" alt="curl4">