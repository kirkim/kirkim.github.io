---
layout: post
title: '[Swift] 셀의 재사용식별자(reuseIdentifier) 관리하기 + Reusable믹스인'
subtitle: ''
date: 2022-08-11 12:45:51 +0900
categories: ios
tags: swift
comments: true
---

⛔️ 셀의 재사용식별자를 관리하는 방법에 대해 개인적으로 공부한 것을 정리한 글입니다. 최대한 올바른 내용만 적기위해 노력하고 있지만 틀린내용이 있을 수 있습니다. 그렇기 때문에 글을 읽으실때 비판적으로 읽어주세요.<br />
틀린내용에 대한 피드백은 메일로 보내주시면 감사하겠습니다🙏🏻

<kline></kline>

<h1>1️⃣ 재사용식별자 기본사용</h1>

**Swift**에서는 **UITableView, UICollectionView**에서 셀들을 재사용셀큐에서 관리합니다. <b style="font-size:90%">(화면에 사라진셀을 큐에 넣고 화면에 나타나면 큐에서 셀을 꺼내 재사용)</b>
이렇게 셀을 재사용하기 위해서는 <rd>셀만의 고유 식별자</rd>가 필요합니다. 식별자는 다음과 같이 <b class="purple">String</b>타입으로 작성하며 보통 **클래스명**을 식별자로 많이 사용합니다.

```swift
// 식별자와 함께 셀등록
tableView.register(CustomCell.self, forCellReuseIdentifier: "CustomCell")

// 재사용셀큐에서 셀꺼내오기위해 식별자사용
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    guard let cell = tableView.dequeueReusableCell(withIdentifier: "CustomCell", for: indexPath) as? CustomCell else { return UITableViewCell() }
	/* 코드 생략 */
    return cell
}
```

<h2 class="ksubsubject"> 아쉬운점..</h2>
셀타입과 함께 식별자를 같이 등록했는데, 식별자를 이용해서 꺼내올때는 <b class="brown">셀타입을 유추하지 못합니다.</b> 그보다도 <rd>String타입의 식별자를 하드코딩하여 관리하는 것은 안좋아 보입니다.</rd>
**String타입**을 하드코딩으로 관리하면 다음과 같은 단점이 있습니다.

1. 1대1 대응이기 때문에 수정하기가 번거롭다.
2. 반복적으로 사용될때도 일리리 찾아서 작성하거나 변경해야된다.
3. 오타가날 가능성이 있다. (식별자나 고유키값의 경우 치명적)
4. 때에따라 디버깅하기가 힘들다.
5. 보안이 필요한 키값의 경우 그대로 노출된다.

<h1 class="ksubject">2️⃣ 식별자를 static변수로 만들어 주기</h1>

다음과 같이 셀자체에서 static한 변수로 식별자를 가지고 있으면 위의 단점들을 어느정도 해결할 수 있습니다.

```swift
class CustomCell: UITableViewCell {
    static let reuseIdentifier = "CustomCell"
	/* 코드생략 */
}

// 셀등록
tableView.register(CustomCell.self, forCellReuseIdentifier: CustomCell.reuseIdentifier)
```

하지만 매번 셀을 만들때마다 <b class="green">reuseIdentifier</b>변수를 만들어주는 것도 번거롭습니다.

<h1 class="ksubject">3️⃣ 프로토콜 extension 활용하기</h1>

이전에 <a href="https://kirkim.github.io/swift/2022/08/05/inheritance_protocol.html">프로토콜관련 포스트</a>에서도 언급한 방법인데,
프로토콜의 <b class="brown">extension</b>을 이용하는 방법입니다.<br />
👉🏻 <a href="https://medium.com/bleeding-edge/nicer-reuse-identifiers-with-protocols-in-swift-97d18de1b2df">참고사이트[클릭]</a><br />
이렇게 프로토콜 extension기능을 활용하면 **단순히 셀에 프로토콜을 지정해주는 것**만으로 고유식별자를 사용할 수 있게 됩니다.

```swift
protocol ReuseIdentifying {
    static var reuseIdentifier: String { get }
}

extension ReuseIdentifying {
    static var reuseIdentifier: String {
        return String(describing: self)
    }
}

// 사용
class CustomCell: UITableViewCell, ReuseIdentifying {
	/* 코드생략 */
}
tableView.register(CustomCell.self, forCellReuseIdentifier: CustomCell.reuseIdentifier)
```

<h2 class="ksubsubject">String(describing:)..??</h2>
String의 생성방법중 하나인 <b class="brown">.init(describing:)</b>을 이용했는데 들어온 인자를 그대로 String로 바꿔줍니다.
다음의 애플공식문서를 확인하면 더 이해가 잘 될 것입니다.<br />
👉🏻 링크: <a href="https://developer.apple.com/documentation/swift/string/init(describing:)-67ncf">init(describing:) - Documentation - Apple Developer</a>)<br />

<h2 class="ksubsubject">타입을 얻으려면 Self.self 같은데?</h2>
위의 reuseIdentifier메서드에서는 <b class="brown">.init(describing:)</b>인자로 <rd>self</rd>를 넘겨주고 있습니다. 기존의 알던바로는 <b class="green">클래스타입을 얻기위해서는</b> <rd>Self.self</rd>로 접근해야 됩니다.
하지만 이번에 구현한 식별자메서드의 경우 <b class="purple">static</b>로 구현하였습니다. 클래스안 <b class="purple">static</b>한 변수나 메서드에서 <rd>self</rd>는 인스턴스주소대신 클래스타입을 가리키게 됩니다. 이해가 되지 않는다면 <b class="purple">static</b>에 관해 더 공부해보시면 될 것 같습니다.

```swift
class AAA {
  func printInstance() {
	print("[instance]")
    print(self)
    print(Self.self)
  }

  static func printStatic() {
	print("[static]")
    print(self)
    print(Self.self)
  }
}

AAA().printInstance()
AAA.printStatic()
```

<kkr>
<rmk>/* 출력 */</rmk><br>
[instance]<br>
<xxxxxx.AAA: 0x1258085f0><br>
AAA<br>
<br>
[static]<br>
AAA<br>
AAA<br>
</kkr>

<h1 class="ksubject">4️⃣ Reusable 믹스인 이용하기</h1>
Reusable 깃허브링크 👉🏻 <a href="https://github.com/AliSoftware/Reusable">Reusable - Github </a><br />
믹스인에 관한 블로그글 👉🏻 <a href="https://ios-development.tistory.com/806">[김종권의 iOS 앱 개발 알아가기] Mixin 패턴(mix-in), Traits 패턴 </a><br />

<kline></kline>

아래 코드와 같이 <b class="purple">Reusable</b>프로트콜(믹스인)을 지정해주면 됩니다.
<b class="purple">Reusable</b>을 이용하면 이전에 **프로토콜+extension(->이것도 결국 믹스인)**으로 구현해준 것과 같이 <rd>일리리 셀에 static식별자를 만들어줄 필요가 없어집니다.</rd>

```swift
import UIKit
import Reusable

class CustomCell: UITableViewCell, Reusable {
	/* 코드 생략 */
}

// 셀등록
tableView.register(cellType: CustomCell.self)
```

내부구현을 살펴보면 <b class="purple">UICollection+extensin</b>에 기존의 register메서드를 한번 감싸는 형식으로 구현되어 있습니다.
<img src="/assets/img/swift/reuseidentifier/1.png" width="100%">
<br />
그리고 이전에 기본적인 방법으로 재사용셀큐에서 셀을 꺼내올때 <rd>타입유추가 되지않는 단점도 있었습니다.</rd>

```swift
// 재사용셀큐에서 셀꺼내오기위해 식별자사용
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    guard let cell = tableView.dequeueReusableCell(withIdentifier: "CustomCell", for: indexPath) as? CustomCell else { return UITableViewCell() }
    /* 코드 생략 */
    return cell
}
```

다음과 같이 <rd>클래스타입</rd>을 통해 재사용셀을 찾아오며 해당 클래스타입으로 타입유추도 해줌으로써 위와같은 단점을 해결해줄 수있습니다.

```swift
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(for: indexPath, cellType: CustomCell.self)
    return cell
}
```

이 부분도 내부구현을 살펴보면 <b class="purple">UICollection+extensin</b>에 기존의 dequeueReusableCell메서드를 한번 감싸는 형식이며, 내부에서 <rd>셀(Cell)의 타입유추</rd>도 해주고 있음을 알 수 있습니다.
<img src="/assets/img/swift/reuseidentifier/2.png" width="100%">
