---
layout: post
title: '[swift] textField를 감지하는 버튼 만들기'
subtitle: ''
date: 2021-12-12 02:45:51 +0900
categories: ios
tags: swift
comments: true
---

<h1> 1️⃣ 목표</h1>

- **문자**가 있을 경우만 활성화되는 버튼을 구현할 예정입니다.

<img src="/assets/img/swift/enabledbutton/enabledButton.gif" width="40%" alt="enabled button">

- 크게 <b class="green">delegate패턴</b>, <b class="blue">이벤트감지 메서드</b> **두가지 방법**으로 나누어서 살펴보고,
- <b class="blue">이벤트감지 메서드</b>를 <b class="purple">addTarget</b>, <b class="purple">addAction</b> **두가지**방법으로 구현해볼 예정입니다.
- 두가지 방법 모두 다음과 같은 **outlet**변수를 만들어서 진행했습니다.

<img src="/assets/img/swift/enabledbutton/1.png" width="80%" alt="base code">

- button의 경우 프로퍼티 옵저버중 하나인 `didSet`을 이용하여 초기에 비활성화가 되도록 만들어 줬습니다.

<h1 class="ksubject">2️⃣ delegate패턴으로 처리하기</h1>

- swift에서는 여러가지 **delegate**를 지원하는데, **textField**에 관련된 **delegate**도 있습니다.

```swift
extension ViewController: UIViewController, UITextFieldDelegate {
	override func viewDidLoad() {
        super.viewDidLoad()
        self.textField.delegate = self
    }

    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange,
             replacementString string: String) -> Bool { return Bool }
}
```

- **textField**관련 delegate를 사용하기 위해서는 <b class="blue">UITextFieldDelegate</b>프로토콜을 채택해야 합니다.
- 그중에서도 `textField`메서드를 사용했는데, 키를 입력하는 순간 동작하며 텍스트가 입력되기 직전에 작업을 처리해줍니다. 우리가 직접 키를감지하는 코드를 작성할 필요가 없고 **UITextFieldDelegate**가 대신 그 일들을 해주는데 이것이 **delegate패턴**을 이용하는 이유중 하나입니다.

```swift
self.textField.delegate = self
```

- 위와 같이 **textField**아웃렛변수의 delegate를 **self**로 지정해주어 **이 클래스**에서 처리해주도록 합니다.
- 이제 본 목적으로 돌아와 `textField`메서드를 이용하여 **텍스트**가 있을 때만 활성화되도록 만들 수 있는지 생각해 보겠습니다.

<kline></kline>

<h2 class="ksubsubject">(1) backspace를 감지하여 처리하기 (안좋은 방법)</h2>

- `textField`메서드의 파라미터중 <b class="blue">textField</b>는 현재 텍스트, <b class="blue">string</b>현재입력된 키값 하나를 가리킵니다.<b style="font-size:90%">(키보드 버튼 하나씩 감지하므로 한글의 경우 자음,모음 단위로 감지)</b>
- 첫번째 방법으로 <b class="blue">textField</b>의 길이가 **1**인 상태에서 <b class="blue">string</b>값이 <b class="brown">backspace</b>이면 버튼이 비활성화 되는 방법을 생각했습니다.
- **swift**에서 <b class="brown">backspace</b>를 찾아봤는데 다음의 스택오버글을 찾았습니다.

👉🏻👉🏻👉🏻 <a href="https://stackoverflow.com/questions/29504304/detect-backspace-event-in-uitextfield" target="blank">stackoverflow 참고글 (Detect backspace Event in UITextField)</a><br>

```swift
func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
    if let char = string.cString(using: String.Encoding.utf8) {
        let isBackSpace = strcmp(char, "\\b")
        if (isBackSpace == -92) {
            print("Backspace was pressed")
        }
    }
    return true
}
```

- 위의 코드가 스택오버플로우의 한 글에서 제시한 방법인데 하나하나 살펴보겠습니다.
- 먼저, **string**변수를 `utf8`로 인코딩을 해주어 <b class="green">strcmp()</b>메서드를 이용하여 `\b`문자와 비교해주고 있습니다. <b style="font-size:90%">(swift에서 "\\"는 "\"문자를 가르킴)</b>
- `utf8`은 아스키코드가 나타낼 수 있는 범위내에서는 100%호환합니다.
- 아래의 아스키코드표를 보면 `\`는 아스키코드 **92**입니다.

<img src="/assets/img/swift/enabledbutton/2.png" width="80%" alt="base code">

- `strcmp()`메서드의 경우 매개변수 2개의 값을 앞문자부터 비교하여 차이값을 출력해줍니다. <b style="font-size:90%">(앞문자가 같으면 다음문자를 비교하고 모두 같을 경우 0을 출력)</b>
- 아스키코드에서 <b class="brown">backspace</b>의 값을 살펴보면 **8**입니다.
- 그렇기 때문에 위에서 제시한 스택오버플로의 코드에서 **isBackSpace**의 값이 **-84**가 아닌 **-92**와 비교했을까요.
- 다음의 코드로 실제로 **textFieldDelegate**의 `textField()`메서드가 <b class="brown">backspace</b>를 어떻게 받아들이는지 확인해 봤습니다.

```swift
if let char = string.cString(using: String.Encoding.utf8) {
    let isBackSpace = strcmp(char, "\\b")
    print("string: ", string)
    print("char: ", char)
    print("isBackSpace: ", isBackSpace)
}
```

<kkr>
<rmk>/* a 입력 */</rmk><br>
string:&nbsp;&nbsp;a<br>
char:&nbsp;&nbsp;[97, 0]<br>
isBackSpace:&nbsp;&nbsp;5<br>
<br>
<rmk>/* backspace 입력 */</rmk><br>
string:<br>
char:&nbsp;&nbsp;[0]<br>
isBackSpace:&nbsp;&nbsp;-92<br>
</kkr>

- 위의 출력값을 보면 알듯이 `textField()`메서드는 <b class="brown">backspace</b>를 공백으로 감지했습니다. <b style="font-size:90%">(char의 0은 문자의 끝을 나타내는 '\0'을 나타냄)</b>
- 그렇다면 굳이 `\b`와 비교할 필요가 있을까라는 생각이 들었습니다. 추가로 **utf8**로 변환할 필요없이 **string**값이 공백인지만 확인하면 될 것같습니다.
- 이와 비슷한 생각을하는 다음의 스택오버플로우글을 찾았습니다.

👉🏻👉🏻👉🏻 <a href="https://stackoverflow.com/questions/51577566/swift-why-strcmp-of-backspace-returns-92" target="blank">스택오버플우 참고글 (Swift why strcmp of backspace returns -92?)</a><br>

- 위의 스택오버플로우에서도 `\\b`와 비교하는 알고리즘을 왜 쓰는지 잘 모르겠다고 하는데, 아마 가독성을 위한 것이 아닐까 생각이 듭니다.
- 그렇다고 `strint == ""`이 꼭 **backspace**를 나타내는 것이 아니라고 말합니다. 실제로 입력값을 <rd>잘라내기</rd>하였을 때도 **string**값이 **공백**으로 출력됐습니다. 하지만 **아스키코드**도 동일하게 0이 출력됐기 때문에 **잘라내기**와 **backspace**를 비교할 방법이 없습니다.
- 하지만 굳이 비교할 필요가 없는 것이 이번에 구현할 **버튼**같은 경우 굳이 backspace임을 확인할 필요없기 때문에 **utf-8**로 인코딩할 필요없이, 다음과 같이`strint == ""`임을 확인하는 코드로 작성해도 될 것 같습니다.

```swift
extension ViewController: UITextFieldDelegate {

    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange,
            replacementString string: String) -> Bool {
        if string == "" && (textField.text?.count)! == 1{
            self.submitBtn.isEnabled = false
        } else {
            self.submitBtn.isEnabled = true
        }
        return true
    }
}
```

- 하지만 문제가 생겼습니다. 다음의 **움짤**을 보면 알듯이 블록단위로 지우게 되면 비활성화가 되지 않습니다.

<img src="/assets/img/swift/enabledbutton/bug1.gif" width="40%" alt="enabled button">

<kline></kline>

<h2 class="ksubsubject">(2) range 파라미터 이용하기 (좋은 방법)</h2>

- **textFieldDelegate**의 `textField()`메서드에는 <b class="blue">range</b>파라미터가 있습니다.
- 다음과 같이 <b class="blue">range</b>의 값을 확인해봤습니다.

```swift
func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange,
        replacementString string: String) -> Bool {
    print("range: ", range)
    return true
}
```

<img src="/assets/img/swift/enabledbutton/range.gif" width="50%" alt="enabled button">

- <b class="blue">range</b>의 타입은 다음과 같습니다.

```swift
typealias NSRange = _NSRange

public struct _NSRange {
  public var location: Int
  public var length: Int
}
```

- 즉, <b class="green">range.location</b>과 <b class="green">range.length</b>값을 잘 사용하면 될 것 같습니다.

<h3 align="middle">&lt; delgate패턴이용한 최종 코드 &gt;</h3>

```swift
func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    if range.location == 0 && range.length != 0 {
        self.submitBtn.isEnabled = false
    } else {
        self.submitBtn.isEnabled = true
    }
    return true
}
```

- 위아같이 **range**파라미터를 이용하면 **블록단위**로 지워도 잘 동작합니다. 또다른 버그가 있을 수 있지만 지금 선에서 적당한 해결방법인 것 같습니다.

<h1 class="ksubject">3️⃣ 이벤트감지함수로 처리하기</h1>

<h2 class="ksubsubject">(1)addTarget() 사용</h2>

- 다음으로 **delegate패턴**을 사용하지않고 **이벤트감지함수**로 처리해보겠습니다.

```swift
class NoDelegateVC: UIViewController {
    /* 중략 */
	@IBOutlet weak var textField: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()
        self.textField.addTarget(self,
		    action: #selector(textFieldDidChange), for: .editingChanged)
    }

    @objc func textFieldDidChange(sender: UITextField) {
        if sender.text?.isEmpty == true {
            self.submitBtn.isEnabled = false
        } else {
            self.submitBtn.isEnabled = true
        }
    }
}
```

- <b class="purple">UITextField</b>는 다음과 같이 <b class="purple">UIControl</b>를 상속하고 있습니다. 그렇기 때문에 각종 이벤트감지함수를 사용할 수 있습니다.

<img src="/assets/img/swift/enabledbutton/3.png" width="70%" alt="UITextField">

- 자바스크립트의 **이벤트리스너함수**와 비슷한 느낌의 함수 같습니다.
- **objective-c**의 런타임 환경에서도 **swift**함수를 사용할 수 있게 하기 위해 `@objc`키워드를 붙여줍니다.
- 그 중에서 <b class="brown">.editingChanged</b>는 **UIControl.Event**의 타입중 하나로 그중에서도 <b class="purple">UITextField</b>에서만 사용이 가능한 이벤트입니다. 위에서 delegate패턴에서 사용한 `textField()`메소드와 같이 문자단위로 이벤트를 감지하지만 이번에는 <rd>입력된 후</rd>에 처리합니다. 그렇기 때문에 생각보다 로직을 생각하기가 쉽습니다.

<h2 class="ksubsubject">(2) addAction(_:for:) 사용 (iOS14 이상)</h2>

- 다음의 **스텍오버플로우글**을 참고하면 **iOS14이상**부터는 <b class="green">addTarget()</b>메서드의 기능을 하는 <b class="green">addAction()</b>메서드를 사용할 수 있다고 합니다.

👉🏻👉🏻👉🏻 <a href="https://stackoverflow.com/questions/67218273/what-is-the-difference-between-addaction-and-addtarget" target="blank">stackoverflow 참고글 (what is the difference between addAction and addTarget)</a><br>

- <b class="green">addAction(\_:for:)</b>을 사용해서 **텍스트필드**의 입력값에 반응하여 **활성화 / 비활성화**되는 버튼을 만들어 보겠습니다.
- <b class="brown">addTarget()</b>메서드와 다른점은 **클로저**를 사용할 수 있습니다.

```swift
override func viewDidLoad() {
    /* 중략 */
    self.textField.addAction(UIAction(handler: { _ in
        if self.textField.text?.isEmpty == true {
            self.submitBtn.isEnabled = false
        } else {
            self.submitBtn.isEnabled = true
        }
    }), for: .editingChanged)
}
```

- 아래와 같이 따로 **핸들러함수**를 만들어서 사용할 수도 있습니다. (클로져함수의 응용)

```swift
override func viewDidLoad() {
    /* 중략 */
    self.textField.addAction(UIAction(handler: self.textHandler), for: .editingChanged)
}

func textHandler(_ a: UIAction) -> Void {
    if self.textField.text?.isEmpty == true {
        self.submitBtn.isEnabled = false
    } else {
        self.submitBtn.isEnabled = true
    }
}
```

- 이번에 **텍스트필드**의 입력값에 반응하여 **활성화 / 비활성화**되는 버튼을 구현해 보았습니다.
- 제가 아는 지식선에서도 여러가지 방법이 있었습니다. 개인적인 생각으로는 **delegate패턴**이 가독성면에서 좀 더 좋다고 생각했습니다. 그 이유로 **delegate**패턴으로는 입력이전에 처리할 수 있기 때문에 텍스트관련 기능(유효성 검사등등..)도 같이 해줄 수 있는데, 기능적으로 통일성이 있을 것 같기 때문입니다.
- 하지만 지금 구현한 코드는 매우 단순한 코드기 때문에 어떤 방법이 더 효율적인지 판단하기는 이른 것 같습니다.
