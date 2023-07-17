---
layout: post
title: '[Swift] Swift에서 상속(Inheritance)과 프로토콜(Protocol)에 대한 고찰'
subtitle: ''
date: 2022-08-05 20:45:51 +0900
categories: ios
tags: swift
comments: true
---

⛔️ Swift에서 상속과 프로토콜의 활용에 대한 개인적인 생각을 적은 글입니다. 그렇기 때문에 가볍게 읽어주셨으면 좋겠습니다.<br />
틀린내용에 대한 피드백은 메일로 보내주시면 감사하겠습니다🙏🏻

<br>

<h1>1️⃣ Swift에서 상속</h1>
- 상속은 OOP(객체지향프로그래밍)의 4대요소중 하나로 코드중복을 줄여주는데 큰역할을 합니다.
- 다음의 이미지를 보면 알 수 있듯이 UiKit의 클래스들은 거의 상속으로 이루어져 있습니다.
	<img src="/assets/img/swift/inheritance_protocol/1.png" width="100%" style="max-width:500px" alt="UIClass-diagram">
	다음과 같이 뷰컨트롤러를 만들기위해 <b class="green">UIViewController</b>를 상속해야 합니다.

    ```swift
    class MainViewController: UIViewController {
    	...
    }
    ```

    테이블뷰의 셀을 만들기위해 <b class="brown">UITableViewCell</b>을 상속받아 구현해야 합니다. 더나아가 <b class="brown">UITableViewCell</b>은 <b class="green">UIView</b>를 상속받아 만들어진 클래스입니다.

    ```swift
    class TableViewCell: UITableViewCell {
    	...
    }
    ```

  <img src="/assets/img/swift/inheritance_protocol/2.png" width="100%" alt="UITableViewCell-definition">

이처럼 <b class="green">UIKit</b>에서 **상속**은 빼놓을 수 없는 존재입니다.
그러면 상속의 사용을 지향해야할까요?

<h1 class="ksubject">2️⃣ Swift에서 상속의 단점</h1>
<h2 class="ksubsubject">(1) 상속을 위해 캡슐화(Encapsulation)가 깨질 수 밖에 없다</h2>
상속의 장점은 <b class="brown">오버라이딩(overriding)</b>을 통해 <b class="green">다형성(Polymorphism)</b>을 구현할 수 있다는 것 입니다.<br />
하지만 상위클래스에서 오버라이딩을 하는 메서드의 경우 **Java언어**에서는 **protected** 키워드가 있어 자식클래스만 접근할 수 있어 그나마 외부클래스에서의 접근에서는 **캡슐화**를 유지할 수 있습니다.<br />
반면 **Swift언어**에는 **protected**키워드가 없습니다. 즉, <rd>오버라이딩을 할 메서드의 캡슐화가 전체적으로 깨질 수 밖에 없습니다.</rd>
<br />

<h2 class="ksubsubject">(2) 리스코프 치환 원칙을 위반할 가능성이 있다</h2>
상위클래스의 메서드를 잘못 오버라이딩을 하게 되면 SOLID의 5대원칙중 하나인 <b class="brown">리스코프 치환 원칙(Liskov Subsitution Principle)</b>을 위반할 가능성이 큽니다. <br />
자신이 직접 부모클래스를 구현하지 않은 이상 상속받을 부모클래스의 내부구현을 알기 힘듭니다. <br /><br />
다음의 코드예시는 **storage**에 새로운string값을 부모클래스에서 이미 담았지만 자식클래스에서 추가로 한번 더담아 총 두번 담도록 구현이 되었습니다. 극단적인 예시이기는 하나 이처럼 <rd>상위클래스에서 메서드를 구현목적과 다르게 동작하도록 오버라이딩할 가능성이 있습니다.</rd>

```swift
class ParentClass {
    var storage: [String] = []

    func addString(newString: String) {
        storage.append(newString)
    }
}

class ChildClass: ParentClass {

    override func addString(newString: String) {
        super.addString(newString: newString)
        storage.append(newString)
    }
}
```

<b class ="brown">상위클래스타입변수</b>에 <b class="green">자식클래스인스턴스</b>를 할당할 수 있지만 메서드<b class="green">호출은 자식클래스의 메서드를 우선순위로 호출</b>된다는점에서 **리스코프치환원칙**을 지키는 것은 중요합니다.

```swift
private func test() {
    let sampleClass:ParentClass = ChildClass()
    sampleClass.addString(newString: "aa")
    print(sampleClass.storage) // 출력: ["aa", "aa"]
}
```

<br />
<h2 class="ksubsubject">(3) 상위클래스의 구현에 따라 하위클래스의 동작이 달라질 수 있다</h2>
당연한 이야기이지만 상위클래스가 변경되면 하위클래스는 직접적으로 영향을 받게 됩니다.

<br />
<h2 class="ksubsubject">(4) 결합도증가로 유연성과 확장성이 떨어진다</h2>
위의 **2,3번** 문제점을 생각한다면 <b class="green">클래스간 결합도</b>가 높아진다는 것을 느낄 수 있을 것입니다. 이로인해 유연성과 확장성을 증가시키기위해 사용한 **상속**이지만, **상속**의 깊이가 깊어질수록 오히려 코드의 유연성과 확장성이 떨어지게 됩니다.

<br />
<h2 class="ksubsubject">(5) 코드를 중복해서 사용할 가능성이 있다</h2>
상속의 깊이가 깊어질수록 상위클래스의 **추상화**의 정도가 커지게 됩니다. 다음의 코드예시는 <b class="purple">setImage()</b>메서드를 상속하는 과정에서 **최하위클래스에서 네트워크요청코드를 중복해서 사용**해버린 상황입니다. 극단적인 예시이지만 네트워크요청과 같은 코드가 중복된다면 비용적인 측면에서 치명적일 것 입니다.

```swift
struct NetworkData: Decodable {
    var summerTitle: String
    var springTitle: String
}

class NetworkManager {
    func load(completion: @escaping(NetworkData) -> ()) {
        /* 생략 */
    }
}

// 부모클래스
class ParentClass {
    var mainTitle:String = ""
    var data: NetworkData?
    let networkManager = NetworkManager()

    func setImage() {
        networkManager.load { data in
            self.data = data
            self.mainTitle = data.springTitle // 봄타이틀 지정
    }
}

// 자식클래스
class ChildClass: ParentClass {
    override func setImage() {
        super.setImage()
        guard let data = data else { return }
        mainTitle = data.summerTitle // 여름타이틀로 변경
    }
}

// 자식의 자식클래스
class ChildChildClass: ChildClass {
    // 네트워크요청하는 코드를 중복해서 다시사용하는 실수
    override func setImage() {
        super.setImage()
        let networkManager = NetworkManager()
        networkManager.load { data in
            self.mainTitle = data.springTitle // 봄타이틀로 다시 변경
        }
    }
}
```

<br />
<h2 class="ksubsubject">(6) SOLID원칙중 ISP를 위반할 가능성이 있다</h2>
상속의 깊이가 깊어져 상위클래스의 **추상화**가 커지면 SOLID원칙중 ISP(인터페이스 분리의 원칙)을 위반할 가능성이 커집니다. 상위클래스들을 자신이 모두 구현하고 관리하지 않는 이상 어떠한 메서드가 있는지 정확히 알기 힘듭니다. 상속의 깊이가 깊어질수록 더 힘들어질 것입니다. 이는 상속을 하는과정에서 하위클래스가 필요없는 기능을 가지고 있게될 수도 있습니다.

<h1 class="ksubject">3️⃣ 상속은 이럴때만 사용하자</h1>
<h3 class="ksubsubject">(1) 명확히 is-a 관계일때만 사용하자</h3>
<h3 class="ksubsubject">(2) 상속을 위한 클래스로 구현하자</h3>
<h3 class="ksubsubject">(3) 자신이 잘알고 관리하는 클래스만 상속하자</h3>

<h1 class="ksubject">4️⃣ 상속대신 Protocol 사용하기(with 컴포지션패턴)</h1>
<h2 class="ksubsubject">(1) 프로토콜의 확장기능 이용하기</h2>
프로토콜의 확장기능 이용하면 미리 코드를 구현하여 사용할 수 있습니다. 또한 해당프로토콜을 준수한 클래스에서 재정의도 가능합니다. **Java언어**에서 **추상클래스(abstract)**와 비슷해보이지만 다중상속이 가능하다는 점에서 다릅니다.<br />
이것을 Mixin, Traits패턴이라고 한다는데 다음의 블로그글을 참고하시면 될 것 같습니다.<br />
👉🏻 <a href="https://ios-development.tistory.com/806">[김종권의 iOS 앱 개발 알아가기] Mixin 패턴(mix-in), Traits 패턴 </a>

```swift
protocol Animal {
    func bark()
    func bite()
}

extension Animal {
    func bark() {
        print("bark!")
    }

    func bite() {
        print("bite!")
    }
}

class Dog: Animal {
    func bark() {
        print("멍멍!")
    }
}

let dog = Dog()
dog.bark() // "멍멍!"
dog.bite() // "bite!"
```

다음과 같이 응용하여 사용할 수 있습니다. ( <a href="https://medium.com/bleeding-edge/nicer-reuse-identifiers-with-protocols-in-swift-97d18de1b2df">참고사이트[클릭]</a> )<br />
Cell(셀)의 키를 매번 하드코딩할 필요없이 관리할 수 있습니다.

```swift
class SampleCell: UITableViewCell {
	static let reuseIdentifier = "Cell"
}
```

```swift
protocol ReuseIdentifying {
    static var reuseIdentifier: String { get }
}

extension ReuseIdentifying {
    static var reuseIdentifier: String {
        return String(describing: self)
    }
}

class SampleCell: UITableViewCell, ReuseIdentifying {
	...
}
```

<br />
<h2 class="ksubsubject">(2) SOLID원칙중 ISP를 준수하기가 용이하다</h2>
클래스가 프로토콜을 채택하는 방식이고 다중상속이 가능하기 때문에 SOLID원칙중 ISP(인터페이스분리원칙)를 준수하기가 용이합니다. 대신에 프로그래머가 신경을 써서 설계할 필요가 있습니다.

```swift
protocol Animal {
    func bark()
    func bite()
    func fly()
}
```

위의 프로토콜을 아래와 같이 기능에 따라 분리시키는 것이 좋습니다.

```swift
protocol Barkable {
    func bark()
}

protocol Bitable {
    func bite()
}

protocol Flydable {
    func fly()
}
```

<br />
<h2 class="ksubsubject">(3) 클래스간 결합도를 낮춰줘 유연성이 높아진다</h2>
다음처럼 프로토콜만 준수한다면 어떤 클래스든지 유연하게 받아 사용할 수 있습니다. 이러한 특성을 이용하여 상속대신에 <b class="brown">컴포지션 패턴</b>으로 구현하여 사용할 수 있습니다.

```swift
protocol Engine {
    func start()
}

class Car {
    private let engine: Engine

    init(engine: Engine) {
        self.engine = engine
    }

    func move() {
        engine.start()
    }
}

class SpecialEngine: Engine {
    func start() {
    }
}

class DragonEngine: Engine {
    func start() {
    }
}

let car1 = Car(engine: SpecialEngine())
let car2 = Car(engine: DragonEngine())
```

<br />
<h2 class="ksubsubject">(4) UI요소에도 컴포지션패턴을 적용하여 사용이 가능하다</h2>
위의 3번에서 UIKit의 클래스를 상속받지않는 클래스들을 손쉽게 컴포지션패턴으로 구현이 가능했습니다.
하지만 다음과 같은 상황이 있을 수 있습니다.

> 웹사이트를 만드는데 노란색검색바(YellowSearchBar)를 재사용하여 웹사이트에 적용할 계획이다.(UISearchBar상속필요)<br />
> 더나아가 이 웹사이트는 다양한 검색바(SearchBar)로 교체할 수 있게 구현하고 싶다.(protocol필요)

먼저 다음과 같이 단순하게 <b class="brown">SearchBar</b>프로토콜을 만들어 사용한다면 레이아웃 설정 기능을 사용할 때 에러가 발생할 것 입니다.

```swift
class WebSite: UIViewController {
    private var searchBar: SearchBar!

    init(searchBar: SearchBar) {
        super.init(nibName: nil, bundle: nil)
        self.searchBar = searchBar
        layout()
    }

	...

    private func layout() {
        self.view.addSubview(searchBar) // 이곳에서 에러가난다
        searchBar.translatesAutoresizingMaskIntoConstraints = false
        /* searchBar 레이아웃 적용 코드 생략 */
    }
}
```

다행히 프로토콜은 <rd>채택을 받을 수 있는 타입을 지정해줄 수 있습니다.</rd> 프로토콜을 채택하는 클래스에서 해당타입의 기능을 사용하도록 구현할 수 있습니다.

```swift
protocol SearchBar: UISearchBar {
    func search()
}
```

다음과 같이 <b class="brown">UISearchBar</b>를 상속받는 클래스에서만 채택이 가능해집니다.

```swift
class YellowSearchBar: UISearchBar, SearchBar {

    init() {
        super.init(frame: CGRect.zero)
        self.backgroundColor = .yellow
    }

    ...

    func search() {
        print("search!")
    }
}
```

이런식으로 프로토콜을 사용하면 **UI요소**에도 유연성을 가진 컴포지션패턴으로 구현할 수 있게 됩니다.<br />
이제 <b class="purple">상속</b>의 대부분을 프로토콜로 대체가 가능할 것 같습니다.

<br />
<h2 class="ksubsubject">(5) weak(unknown)키워드 사용가능<b style="font-size:80%">(delegate패턴에서 사용)</b></h2>
프로토콜자체에서 채택가능한 타입을 지정하는 기능은 꽤 유용합니다.<br />
먼저 다음처럼 delegate패턴을 <b class="green">AnyObject(클래스타입)</b>에서만 채택이 가능하도록 구현합니다.

```swift
protocol SampleDelegate: AnyObject {
	...
}
```

그러면 다음과 같이 <b class="blue">weak 키워드</b>를 프로퍼티에 적용시킬 수 있습니다.<br />
**delegate패턴**에서 delegate에 상위클래스를 할당하기 때문에 자칫하면 <rd>메모리누수(memory leak)</rd>를 발생시킬 수 있습니다.<br />
그렇기 때문에 **delegate패턴**에서 다음과 같이 <b class="blue">weak 키워드</b>는 거의 필수입니다.

```swift
class SampleClass: UIView {
	weak var delegate: SampleDelegate?
	...
}
```
