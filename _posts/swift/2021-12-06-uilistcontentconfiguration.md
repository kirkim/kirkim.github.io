---
layout: post
title: '[swift] textLabel, imageView 대신 UIListContentConfiguration을 써서 cell을 커스텀하기'
subtitle: ''
date: 2021-12-06 02:45:51 +0900
categories: ios
tags: swift
comments: true
---

<h1>1️⃣ textLabel, imageView의 삭제?</h1>
<h2 class="ksubsubject">(1) 기본 테이블셀 작성(구식)</h2>

- **테이블 뷰 셀**을 **스토리보드**에서 만들어서 **outlet변수**로 swift파일과 연결해준 뒤 사용할 수 있습니다.
- 그리고 **기본 테이블 셀**형태는 다음과 같이 코드를 작성하면 **스토리보드**에서 커스텀할 필요없이 만들 수 있습니다.

<details>
	<summary>예제코드출처: 꼼꼼한 재은 씨의 스위프트 실전편</summary>
	- 전편의 <b>기본편</b>을 가벼운 마음으로 봤다가 반해서 <b>실전편</b>까지 구입해서 공부하게 됐습니다. 나온지 2년이상 지난 책이지만 볼만한 가치가 확실히 있는 책인 것 같습니다.
</details>

```swift
override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let id = "sampleCell"
    let cell = tableView.dequeueReusableCell(withIdentifier: id)
            ?? UITableViewCell(style: .default, reuseIdentifier: id)

    cell.textLabel?.text = self.cellStorage[indexPath.row].title
    cell.textLabel?.font = UIFont.systemFont(ofSize: 40)
    cell.imageView?.image = self.cellStorage[indexPath.row].image

    return cell
}
```

<img src="/assets/img/swift/uilistcontentconfiguration/1.png" alt="viewTablecell_iphone11">

- 하지만 `textLabel`코드를 작성중에 다음과 같은 경고창이 나왔습니다. `imageView` 또한 같은 경고창이 나왔습니다.

<img src="/assets/img/swift/uilistcontentconfiguration/2.png" alt="warning using textLabel">

- 좀 더 자세히 보기위해 <kbd>cmd⌘</kbd> + <kbd>shift</kbd> + <kbd>0</kbd>를 입력해서 **문서**에서 살펴봤습니다.

<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; textLabel &gt;</h4>
        <img src="/assets/img/swift/uilistcontentconfiguration/3.png" alt="textLabel in document">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; imageView &gt;</h4>
        <img src="/assets/img/swift/uilistcontentconfiguration/4.png" alt="imageView in document">
    </div>
</div>

- **문서**에서도 <rd>Deprecated(더 이상 사용되지 않음)</rd>라고 말하고 있고 <b class="brown">defaultContentConfiguration()</b>을 기본 리스트 콘텐츠 구성을 가져와서 사용하라고 말하고 있습니다.
- 현재 <b class="brown">iOS15</b>기준 아직 사용이 가능하지만 <rd>삭제</rd>를 예고한 만큼 새로운 방법을 찾아야될 것 같습니다.

<kline></kline>

<h2 class="ksubsubject">(2) 기본 테이블셀 작성(최신)</h2>

- **문서**에서 대신 사용하라고 가르쳐준 <b class="brown">defaultContentConfiguration()</b>는 <b class="green">UIListContentConfiguration</b>를 반환해줍니다.
- **문서**에서 <b class="green">UIListContentConfiguration</b>의 사용법에 대한 <b class="blue">기본 예제</b>도 있어서 이해하기가 쉬웠습니다.

<img src="/assets/img/swift/uilistcontentconfiguration/5.png" width="80%" alt="UIListContentConfiguration in document">

- 이제 **문서**에서 가르쳐준 예제를 참고하여 수정해 보겠습니다.

```swift
override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    /* 생략 */

    var content = cell.defaultContentConfiguration()

    content.text = self.cellStorage[indexPath.row].title
    content.textProperties.font = UIFont.systemFont(ofSize: 20) // 폰트 사이즈
    content.image = self.cellStorage[indexPath.row].image
    content.imageProperties.maximumSize.height = 20 // 이미지 높이

    cell.contentConfiguration = content

    /* 셀 자체 커스텀은 cell에서 직접 접근 */
    cell.accessoryType = .detailDisclosureButton
    cell.backgroundColor = .brown

    return cell
}
```

- 위와 같이 작성하면 기본으로 제공해주는 테이블 셀 구성에 맞추어 만들어 줍니다.
- **셀**자체는 `cell`변수에 직접 접근하여 커스텀해줘야 합니다.
- 그냥 <b class="brown">contentConfiguration</b>에 직접 접근하여 변경하면 되지않을까 생각했지만 **프로토콜(protocol)**형태로 되어 있기 때문에 직접변경이 되지 않았습니다.
- 대신에 다음코드와 같이 <b class="yellow">defaultContentConfiguration</b>**()** 로 기본 **스트럭쳐(structure)**를 할당받아서 커스텀한 뒤 <b class="brown">cell.contentConfiguration</b>에 대입해서 사용합니다.

```swift
var content = cell.defaultContentConfiguration()
cell.contentConfiguration = content
```

- 또하나 주의할 점은 **구식의 방법**으로 작성한 코드는 **이미지**와 **텍스쳐**의 높이가 동일한 비율을 유지하지만 **신규 방법**은 **이미지**와 **텍스쳐**의 크기가 독립적으로 적용됩니다.
- 그렇기 때문에 좀 더 신경써서 커스텀설정을 해줘야할 것 같습니다.

<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 이미지만 키울때 &gt;</h4>
        <img src="/assets/img/swift/uilistcontentconfiguration/6.png" width="80%" alt="big image">
    </div>
    <div class="explain-right" style="padding-top:1%">
        <h4 align="middle" style="color:#0e435c;">&lt; 텍스쳐만 키울때 &gt;</h4>
        <img src="/assets/img/swift/uilistcontentconfiguration/7.png" width="80%" alt="big text">
    </div>
</div>

<kline></kline>

<h2 class="ksubsubject">(3) 굳이 왜 없앨까?</h2>

- 굳이 기존의 돌아가는 코드를 삭제하고 새로운 방법을 만들 필요가 있었나?하는 생각이 들었습니다.
- 공부를 더 하고 왜 그런결정을 하게 됐는지 다시한번 고민해봐야할 것 같습니다. 지금 아무리 다른 블로그 글이나 외국문서를 봐도 이해가 안됨...
- **swift언어**가 나온지 얼마되지않았기 때문에 이러한 변경되는 것들이 많은 것 같습니다. 그나마 다행인 것은 **애플 문서**가 친절하게 설명해준다는 것입니다. 하지만 **모바일기기**가 발전함에 따라 (**appdelegate**의 기능을 몇개 이어받은 **scenedelegate**가 생겨난 것처럼) 큰폭으로 변하는 것들이 앞으로도 많을 것 같습니다. 버전별로 호환이 되면 모를까, 안되는 것도 꽤 많이 본 것 같습니다. 결국 버전별로 **코드**를 다르게 짜야되는 경우가 **IOS개발**에서는 많을 것 같습니다.<b style="font-size:90%">(다른 프론트엔드 프레임워크에 비해서는 약과일 수도?, react만 가볍게 본정도라 비교는 못하겠다.)</b>
- 앞으로 **ios개발**공부를 하다보면 어떤 끔찍한 것들이 있을지 두렵기도하고 설레기도 합니다. <b style="font-size:85%">(레거시코드를 읽기위해 objective-c와 최근에 만들어진 swiftUI 공부는 덤..)</b>

<kline></kline>

<h2 class="ksubsubject">(4) 기본 테이블뷰 말고 내 마음대로 테이블뷰 커스텀하기</h2>

- 기본으로 제공해주는 테이블 셀은 <b class="green">이미지</b>다음에 <b class="green">텍스트</b>가 고정적으로 오는 형태 였습니다.
- **스토리보드**를 이용해서 직접 커스텀을 해줄 수 있지만 다음과 같이 코드만으로도 다른 형태로 **커스텀**해줄 수 있습니다.

```swift
 override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "sampleCell")
                ?? UITableViewCell(style: .default, reuseIdentifier: "sampleCell")

    let textView = UITextView(frame: CGRect(x: 60, y: 5, width: 200, height: 50))
    textView.text = self.cellStorage[indexPath.row].title
    textView.font = UIFont.systemFont(ofSize: 20)

    let imgView = UIImageView(image:self.cellStorage[indexPath.row].image)
    imgView.frame = CGRect(x: 5, y: 5, width: 50, height: 50)

    cell.addSubview(imgView)
    cell.addSubview(textView)

    return cell
}
```

- 위에서 **좌표**용으로 사용된 <b class="purple">CGRect()</b>의 x,y위치는 **부모뷰**가 기준이 됩니다.
- 위의 코드도 결과적으로 **기본 테이블뷰**처럼 출력되지만, 이 방식을 응용하면 다양한 형태로 테이블셀을 커스텀할 수 있게 됩니다.

<kline></kline>

<h2 class="ksubsubject">(5) SwiftUI는 뭘까?</h2>

- 자세한 코드는 아직 보지 못했지만 <b class="brown">SwiftUI</b>가 **스토리보드**형식의 개발을 대체할 것이라는 말은 **유튜브영상**이나 **글** 심지어 **주위**에서도 많이 들은 것 같습니다.
- 기존에 **웹**을 공부하면서 <b class="blue">html, css, js</b>를 이용하여 화면을 만들다가 **스토리보드**방식을 처음에 접했을 때는 신세계를 접한 것 같았습니다. 하지만 **스토리보드** 인터페이스만으로는 설계하지 못하는 것들이 있고 결국에 코드로 설정을 추가 해줘야 하는 것들도 종종 있었습니다. 아직 크게 느끼진 못했지만 가독성이 떨어진다는 말도 있습니다.
- **SwiftUI**는 코드로만 UI를 작성하는 방식이라는 것은 알고 있는데 위의'테이블뷰 커스텀하기' 코드와 비슷하지 않을까 하는 생각이 들었습니다.
- 기존에 **Swift언어**를 어느정도 공부하고 **SwiftUI**를 배우고자했는데, 지금 타이밍에 한번 **SwiftUI**를 공부해봐야할때 인 것 같습니다.
