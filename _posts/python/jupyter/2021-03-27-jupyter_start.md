---
layout: post
title:  "[Python]Jupyter notebook 개발환경 만들기"
subtitle:   ""
date: 2021-03-27 02:45:51 +0900
categories: python
tags: basic
comments: true
---

이번 포스트는 **Jupyter notebook 개발환경 만들기**에 관한 내용입니다.

* * *
<h2>1️⃣ Jupyter Notebook 다운로드</h2>

* <b>'주피터 노트북'</b>을 다운받고 사용하는 방법은 여러가지가 있지만 **아나콘다**를 이용하여 다운받고 사용하는 방법에 대해서 알아보겠습니다.

* * *
<h3 style="color:#0e435c;">(1) 아나콘다 다운로드</h3>

* 다운로드링크에서 아나콘다 install 파일을 받은 뒤 설치를 진행합니다.<br />
<a href="https://www.anaconda.com/products/individual" target="blank"> 아나콘다 다운로드</a><br />

* * *

* `PATH`(경로)를 자동으로 설정해주는 옵션을 체크하고 설치하면 됩니다.<b style="font-size:90%"> (직접 `PATH`를 지정해줘도 되지만 번거롭기 때문입니다.)</b><br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/download1.png" alt="anaconda_download_PATH_option" width="100%">

* * *
<h3 style="color:#0e435c;">(2) Jupyter Notebook 설치</h3>
* <b>Anaconda Navigator</b>를 실행한 뒤 <b>'Jupyter Notebook'</b>을 설치해 줍니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/download2.png" alt="Jupyter_install" width="100%">
<br /><br />

* * *
<h2>2️⃣ Jupyter Notebook 실행방법</h2>
<h3 style="color:#0e435c;">[방법1] 아나콘다 네비게이터로 실행</h3>
* 다음과 같이 **Anaconda Navigator**를 통해 **Jupyter Notebook**을 실행 시킬 수 있습니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/anaconda1.png" alt="anaconda_icon" width="100%">
<img src="https://kirkim.github.io/assets/img/python/jupyter/anaconda2.png" alt="jupyter_launch" width="100%">
<br /><br />

* * *
<h3 style="color:#0e435c;">[방법2] 주피터 노트북 직접 실행</h3>
* <b>'주피터 노트북'</b>아이콘으로 직접 접속이 가능합니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupyter1.png" alt="jupyter_icon" width="100%">

* * *
* 아이콘을 클릭하면 터미널과 함께 자동으로 웹사이트가 열리게 됩니다.<b style="font-size:90%"> (localhost로 접속을 하는 것이기 때문에 **터미널**을 종료하면 웹사이트 접속도 끊기게 됩니다.)</b><br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupyter2.png" alt="jupyter_terminal" width="100%">
<br /><br />

* * *
<h2>2️⃣ 코드를 구현할 파일 만들기</h2>

* 적절한 폴더로 들어간 뒤 `New`항목에서 `python3` 기반의 notebook파일을 만들어 줍니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupyter3.png" alt="jupyter_web" width="100%">

* * *
* 생성과 동시에 다음과 같이 코딩창이 열리게 됩니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupyter4.png" alt="jupyter_coding_screen" width="100%">

* * *
* 폴더 위치에 다음과 같이 `.ipynb`파일이 생성된 것을 확인할 수 있습니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupyter5.png" alt="jupyter_ipynb_file" width="100%">