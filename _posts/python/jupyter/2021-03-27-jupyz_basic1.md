---
layout: post
title:  "[Python]Jupyter Notebook특징 및 numpy모듈 사용하기"
subtitle:   ""
date: 2021-03-27 03:45:51 +0900
categories: python
tags: jupyternotebook
comments: true
---

이번 포스트는 **Jupyter notebook특징 및 numpy모듈 사용하기**에 관한 내용입니다.

* * *
<h2>1️⃣ Jupyter Notebook특징</h2>

* **주피터 노트북**에서 **파이썬 커널**을 생성하면 `.ipynb`의 확장자명으로 생성됩니다.
* `.ipynb`는 **ipython**의 약자로 2001년 '페르난도 페레즈'가 대화형 방식의 분석 및 개발을 목적으로 개발한 것 입니다.
* 코딩결과를 한칸한칸 실시간으로 확인이 가능하고 Web의 접근이 가능한 장점이 있습니다.

* * *
<h3 style="color:#0e435c;">(1) 동작방식</h3>

* 다른 콘솔프로그램들은 코드들이 위에서부터 순차적으로 실행이 되지만 **주피터 노트북**에서는 **각각의 칸(cells)**들이 독립적으로 동작합니다.
* 하지만 **각각의 독립된 코드**들은 `Ctrl + Enter`키로 실행시킴과 동시에 **코드의 순번**이 매겨지게 됩니다.<b style="font-size:90%"> (순번이 낮을 수록 먼저 실행됩니다.)</b>
* 독립적인 칸들은 왼쪽의 `In [ ]`의 괄호안의 숫자가 순번을 의미합니다.
<h4 align="middle" style="color:#0e435c;">&lt; 실행되지않은 cell은 무시 &gt;</h4>
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupy_char2.png" alt="jupyter_character" width="80%">
<h4 align="middle" style="color:#0e435c;">&lt; 줄의 순서와 관계없이 실행순서로 적용 &gt;</h4>
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupy_char3.png" alt="jupyter_character" width="80%">

* * *
<h3 style="color:#0e435c;">(2) 마크다운 기능</h3>

* 중간중간 **마크다운**기능을 이용할 수 있습니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupy_char0.png" alt="jupyter_character" width="85%"><br />
<a href="https://dillinger.io/" target="blank"> [마크다운연습 사이트 1] Dillinger</a><br />
<a href="https://stackedit.io/app#" target="blank"> [마크다운연습 사이트 2] Stackedit</a><br />

* * *
<h3 style="color:#0e435c;">(3) 가시적인 출력</h3>

* **데이터 사이언스**에 많이 사용되는 툴이다보니 좀 더 **가시적**으로 출력해줍니다.
* `print`함수의 이용없이 소스가담긴 **변수**명을 직접 입력해주면 **'주피터 노트북'**방식으로 출력해줍니다.<br /><br />
<img src="https://kirkim.github.io/assets/img/python/jupyter/jupy_char1.png" alt="jupyter_character" width="80%">

* * *
<h2>2️⃣ numpy모듈 이용하기</h2>

* **Numpy**는 **numerical(숫자와 관련한) python**의 줄임말로 **파이썬**에서 복잡한 수치계산을 할 수 있게 도와줍니다.

* * *
<h3 style="color:#0e435c;">(1) n차원 배열만들기(array메소드)</h3>
<h4 align="middle" style="color:#0e435c;">&lt; array타입 &gt;</h4>
<img src="https://kirkim.github.io/assets/img/python/jupyter/array1.png" alt="jupyter_character" width="80%">

* `ndarray`는 <b>n-dimension-array</b>의 약자로 <b>"n차원 배열"</b>을 뜻합니다.

* * *
<h4 align="middle" style="color:#0e435c;">&lt; 1차원배열 &gt;</h4>
<img src="https://kirkim.github.io/assets/img/python/jupyter/array2.png" alt="jupyter_character" width="80%">
<h4 align="middle" style="color:#0e435c;">&lt; 2차원배열 &gt;</h4>
<img src="https://kirkim.github.io/assets/img/python/jupyter/array3.png" alt="jupyter_character" width="80%">

* * *
<h3 style="color:#0e435c;">(2) 파이참에서 기타 모듈 사용</h3>

* 위의 **주피터 노트북**에서는 **파이썬 커널**로 생성한 파일입니다.
* **주피터 노트북**을 설치하면 자동으로 설치되는 `numpy`나 `pandas` 모듈들을 **파이참**과 같은 파이썬관련 유명한 툴에서도 사용가능합니다.
<h4 align="middle" style="color:#0e435c;">&lt; 모듈 설치 명령어(파이참 터미널) &gt;</h4>

<kkr>
<b style="color: #999999; font-style: italic;">#---- numpy모듈 설치 ----#</b><br />
pip install numpy<br />

<b style="color: #999999; font-style: italic;">#---- pandas모듈 설치 ----#</b><br />
pip install pandas<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(3) full, zeros, ones 메소드</h3>
<br />

```python
import numpy

array1 = numpy.full(7, 3)
array2 = numpy.zeros(7, dtype=int)
array3 = numpy.ones(7, dtype=int)

print(array1)
print(array2)
print(array3)
```
<kkr>
<span style="color: #999988; font-style: italic;">&#35;-------출력-------&#35;</span><br />
[3 3 3 3 3 3 3]<br />
[0 0 0 0 0 0 0]<br />
[1 1 1 1 1 1 1]<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(4) arrange 메소드</h3>
<br />

```python
import numpy

array1 = numpy.arange(7)  # 범위(0 ~ 6)
array2 = numpy.arange(1, 7)  # 범위(1 ~ 6)
array3 = numpy.arange(3, 13, 3)  # 범위(3 ~ 12), 간격 3

print(array1)
print(array2)
print(array3)
```
<kkr>
<span style="color: #999988; font-style: italic;">&#35;-------출력-------&#35;</span><br />
[0 1 2 3 4 5 6]<br />
[1 2 3 4 5 6]<br />
[3 6 9]<br />
</kkr>

* * *
<h3 style="color:#0e435c;">(5) random 메소드</h3>
<br />

```python
import numpy

array1 = numpy.random.random(5)
array2 = numpy.random.random(5)

print(array1)
print(array2)
```
<kkr>
<span style="color: #999988; font-style: italic;">&#35;-------출력-------&#35;</span><br />
[0.17794199 0.4335636  0.978274   0.72053257 0.48554927]<br />
[0.70218865 0.27184869 0.08784331 0.41759282 0.36796319]<br />
</kkr>