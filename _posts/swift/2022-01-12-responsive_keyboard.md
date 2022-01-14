---
layout: post
title: '[swift] 좀 더 자연스럽게 키보드에 반응해서 화면올리기'
subtitle: ''
date: 2022-01-12 02:45:51 +0900
categories: swift
tags: etc
comments: true
---

<h1>1️⃣ 목표</h1>

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>오른쪽과 같은 <b class="blue">반응형 키보드</b> 만들었습니다.</li>
			<li>하지만 만드는 방법은 구글 유튜브등 자료가 많이 있기 때문에 생략하겠습니다.<b style="font-size:90%">(본인은 <a href="https://www.youtube.com/watch?v=pBG66IYtKlk&list=PLgOlaPUIbynqRzpQBIdEDnjDdkVsjHqxK&index=24">정대리youtube - API 프로젝트</a>영상을 참고)</b> </li>
			<li>이번 포스터에서는 만드는 과정에서 생긴 <rd>문제점</rd>에 대해 정리할 예정입니다</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/responsive_keyboard/preview_responsive_keyboard.gif" width="100%" style="max-width:200px" alt="finished version">
    </div>
</div>
- 이렇게 키보드에 반응하여 <rd>입력창</rd>과 <rd>확인버튼</rd>을 보이게 하는 것은 <a href="https://developer.apple.com/design/human-interface-guidelines/ios/user-interaction/keyboards/">Apple-human-interface-guidelines</a>에도 나와 있듯이 **애플공식사이트**에서도 권장하고 있습니다.

<h1 class="ksubject">2️⃣ 문제발생</h1>
<h2 class="ksubsubject">(1) 문제점</h2>

- 기존에는 다음과 같이 <b class="blue">버튼의 frame.origin.y</b>값만큼 <b class="green">뷰 전체의 Y좌표</b>를 조절하는 식으로 구현했습니다.

```swift
if let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
    let distance = keyboardSize.height - (UIScreen.main.bounds.height - confirmBtn.frame.origin.y - confirmBtn.frame.height)

    if (self.view.frame.origin.y + distance > 0) {
        self.view.frame.origin.y -= distance
    }
}
```

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>하지만 생각했던 것 처럼 화면이 올라가지 않았습니다.</li>
			<li>추가적으로 <b>화면 전체</b>가 통째로 올라가다 보니 관련없는부분의 UI도 신경써야되는 불편함이 있었습니다. <b style="font-size:90%">(오른쪽 이미지에서 "메인 뷰"부분)</b></li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/responsive_keyboard/1.png" width="100%" style="max-width:200px" alt="frame problem">
    </div>
</div>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>추가로 <b>화면 전체</b>의 뷰를 이동시키면 키보드를 닫을 때 <b class="brown">검은부분</b>이 보이는데 이것도 부자연스럽게 보입니다. <b style="font-size:90%">(오른쪽 짤의 키보드가 사라지는 부분을 봐보자)</b></li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/responsive_keyboard/temp_responsive_keyboard.gif" width="100%" style="max-width:200px" alt="temp responsive keyboard">
    </div>
</div>

<h2 class="ksubsubject">(2) 원인</h2>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>생각했던 것 만큼 화면이 올라가지 않았던 것은 <rd>frame</rd>에 대한 개념을 잘못 알고 있었던 것이 원인이 였습니다.</li>
			<li><rd>frame</rd>은 상위뷰를 기준으로 잡히게 되는데 제대로된 거리를 구하기 위해서는 <b class="green">상위뷰의 frame좌표</b>를 모두 고려해서 계산해야 합니다.</li>
			<li>frame과 bounds에 대한 개념은 <a href="https://zeddios.tistory.com/203">https://zeddios.tistory.com/203</a>를 참고하면 될 것 같습니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/responsive_keyboard/2.png" width="100%" style="max-width:200px" alt="reason">
    </div>
</div>

<h1 class="ksubject">3️⃣ 해결방법</h1>

- 해결해야할 문제는 다음과 같습니다.
  1.  정확한 좌표로 버튼이 제대로 보이게 만들기
  2.  관련없는 부분의 UI를 고려하지않고 독립적으로 동작하도록하기
  3.  키보드가 사라질때 검은부분이 보이지 않게 하기

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>위의 <rd>세가지 문제점</rd>은 <b class="green">한가지 방법으로 모두 해결가능</b>합니다.</li>
			<li>입력에 관련된 부분만 <b class="blue">임시 뷰로 감싸는 것</b> 입니다.</li>
			<li>전체 화면의 좌표를 조절하는 것 대신에 임시 뷰의 좌표를 대신 조정하는 것 입니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/responsive_keyboard/3.png" width="100%" style="max-width:200px" alt="solution">
    </div>
</div>

- 이렇게 임시 뷰를 만들어 <b class="blue">스텍으로 감싸게 되면</b>다음과 같은 장점이 있습니다.
  1.  좀 더 가시적으로 좌표를 구할 수 있다.
  2.  임시 뷰안에서 마음껏 수정해도 **좌표**에 영향을 주지 않고, 관련없는 부분의 UI를 신경쓸 필요없다.(유연성)
  3.  키보드가 사라질때 검은부분이 보이지 않는다. (자연스러운 UI)
- 또한 다음과 같이 <rd>스크롤 뷰</rd>에서도 <b class="blue">임시 뷰로 감싸는 것</b>이 UI적으로 깔끔합니다.

<div class="explain-cover" style="padding: 0 20%">
    <div class="explain-left">
		<h4 align="middle">&lt; 스택 사용 X &gt;</h4>
		<img src="/assets/img/swift/responsive_keyboard/bad_example_in_scrollView.gif" width="100%" style="max-width:200px" alt="bad_example_in_scrollView">
	</div>
    <div class="explain-right">
		<h4 align="middle">&lt; 스택 사용 O &gt;</h4>
        <img src="/assets/img/swift/responsive_keyboard/good_example_in_scrollView.gif" width="100%" style="max-width:200px" alt="good_example_in_scrollView">
    </div>
</div>

- 다음은 <rd>스크롤뷰</rd>에서 사용시 <b class="green">키보드반응 좌표식</b> 입니다.

```swift
if let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
    let distance = keyboardSize.height
        - (UIScreen.main.bounds.height - self.myView.frame.origin.y
            - self.myView.frame.height - self.myScrollView.frame.origin.y
            + self.myScrollView.contentOffset.y)
    self.myView.frame.origin.y -= distance
}
```
