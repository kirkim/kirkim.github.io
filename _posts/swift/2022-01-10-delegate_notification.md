---
layout: post
title: '[swift] delegate와 notificationCenter을 이용해서 이벤트 전달하기'
subtitle: ''
date: 2022-01-10 02:45:51 +0900
categories: swift
tags: etc
comments: true
---

<h1> 1️⃣ 목표</h1>

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>오른쪽과 같이 <rd>팝업된 뷰</rd>에서 이벤트를 전달하여 웹사이트가 열리도록 만들 예정입니다.</li>
			<li>swift에서는 이벤트를 전달하는 방법이 여러가지가 있지만 그 중에서 <b class="green">델리게이트(delegate)</b>와 <b class="brown">NotificationCenter</b>을 이용하여 전달하는 방법에 대해서 알아볼 예정입니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/delegate_notification/finished_version.gif" width="100%" style="max-width:200px" alt="finished version">
    </div>
</div>

<h1 class="ksubject">2️⃣ Delegate를 이용하여 이벤트를 전달하기</h1>
<h2 class="ksubsubject">(1) protocol(프로토콜)로 구현된 delegate</h2>

- UIKit에는 내장된 <b class="green">delegate</b>들이 많이 있습니다. 이러한 delegate들은 다음과 같이 <rd>protocol(프로토콜)</rd>타입으로 선언되어 있습니다.
  <img src="/assets/img/swift/delegate_notification/1.png" width="80%" alt="delegate declaration example">

- <b><rd>protocol(프로토콜)</rd></b>은 **Java언어**에서 <b class="brown">interface(인터페이스)</b>와 비슷한 개념입니다.
- 즉, <rd>protocol(프로토콜)</rd>로 구현함으로써 해당 <b class="green">delegate</b>를 어떻게 이용할 수 있는지 **설계도**와 같은 역할을 해줍니다.
- 무조건 함수를 구현해야하는 <b class="brown">interface(인터페이스)</b>와 달리 다음과 같이 **옵셔널(optional)**을 이용하여 선택적으로 구현할 수 있도록할 수 있습니다.

```swift
protocol TempProtocol {
    optional func sumNumber(a: Int, b: Int) -> Int {
        return a + b
    }
}
```

- 또한 <rd>protocol(프로토콜)</rd>은 프로퍼티의 초기값을 지정해줄 수 없습니다.

<kline></kline>

<h2 class="ksubsubject">(2) 구현<b style="font-size:90%">(delegate 이용)</b></h2>

- 이제 아래와 같이 <rd>protocol(프로토콜)</rd>로 원하는 <b class="green">delegate</b>를 만들어 사용할 수 있습니다.
- 구현의 <rd>핵심</rd>은 다음과 같습니다.

  1.  이벤트를 전달해줄 뷰컨트롤러에서

      ```swift
      var myOpenWebDelegate: OpenWebDelegate?
      ```

      와 같이 delegate변수를 선언해준 뒤 **내장함수**를 사용하기

  2.  이벤트를 전달받는 뷰컨트롤러에서 **delegate의 내장함수의 동작**을 구현하기
  3.  이벤트를 전달받는 뷰컨트롤러에서

      ```swift
      openWebBundlerVC.myOpenWebDelegate = self
      ```

      와 같이 델리게이트를 이곳에서 처리하도록 선언하기

```swift
/* OpenWebDelegate.swift */
import Foundation

protocol OpenWebDelegate {
    func openWebPage(url: URL)
}

/* WebButtonBundlerView.swift */
import UIKit

class WebButtonBundlerView: UIViewController {
    var myOpenWebDelegate: OpenWebDelegate?

    private func setUrlAndDismiss(_ urlString: String) {
        guard let url = URL(string: urlString) else { return }
        myOpenWebDelegate?.openWebPage(url: url)
        self.dismiss(animated: true, completion: nil)
    }

    @IBAction func handleOpenGoogleBtn(_ sender: UIButton) {
        setUrlAndDismiss("https://www.google.co.kr")
    }
	/* 생략(다른 버튼들) */
}

/* MainViewController.swift */
import UIKit
import WebKit

class MainViewController: UIViewController, OpenWebDelegate {

    @IBOutlet weak var myWebView: WKWebView!

    @IBAction func handleOpenWebBundlerBtn(_ sender: UIButton) {
        guard let openWebBundlerVC = self.storyboard?
                .instantiateViewController(withIdentifier: "WebButtonBundlerView")
                as? WebButtonBundlerView else { return }
        openWebBundlerVC.myOpenWebDelegate = self // delegate를 이곳에서 처리
        self.present(openWebBundlerVC, animated: true, completion: nil)
    }

    /* OpenWebDelegate 내장함수를 구현 */
    func openWebPage(url: URL) {
        myWebView.load(URLRequest(url: url))
    }
}
```

<h1 class="ksubject">3️⃣ Notification을 이용하여 이벤트를 전달하기</h1>

- **이벤트를 전달받을 뷰컨트롤러**, **이벤트를 전달할 뷰컨트롤러** 총 2개의 swift 파일을 구현했습니다.
<h2 class="ksubsubject">(1) 이벤트를 전달받을 뷰컨트롤러(MainViewController.swift)</h2>

- **이벤트를 전달받는다고** 말했지만 엄밀히 말하면 **이벤트를 감시**합니다.
- 먼저 `NotificationCenter`를 이용하여 이벤트를 감시할 **옵저버**를 만들어 줍니다. **delegate**때와 마찬가지로 <rd>버튼</rd>을 누를 때 생성해주도록 만들어 줬습니다.

```swift
import UIKit
import WebKit

class MainViewController: UIViewController {

    @IBOutlet weak var myWebView: WKWebView!

    @objc func loadWebView(_ notification: Notification) {
        guard let url = notification.object as? URL else { return }
        myWebView.load(URLRequest(url: url))
    }

    @IBAction func openWebBtnBundlerView(_ sender: UIButton) {
        guard let openWebBundlerVC = self.storyboard?
                .instantiateViewController(withIdentifier: "WebButtonBundlerView")
                as? WebButtonBundlerView else { return }
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(loadWebView),
                                               name: NSNotification.Name("openWebNotification"),
                                               object: nil)
        self.present(openWebBundlerVC, animated: true, completion: nil)
    }
}
```

- 위의 코드에서 <rd>핵심</rd>적인 부분은 `NotificationCenter.default.addObserver()` 메서드 부분입니다.
- `NSNotification.Name()`로 원하는 옵저버명을 만들어 줍니다. <b style="font-size:90%">(나중에 옵저버를 식별할 때 사용)</b>
- 옵저버가 이벤트를 감지했을 때 실행해줄 `objc`형태의 `seletor`도 구현해줍니다.

<kline></kline>

<h2 class="ksubsubject">(2) 이벤트를 전달할 뷰컨트롤러(WebButtonBundlerView.swift)</h2>

- **메인뷰**에서 버튼을 클릭하면 **노티피케이션**의 **옵저버(observer)**가 생성됨과 동시에 **팝업창**이 열리도록 구현했었습니다.
- **팝업창**에서 원하는 사이트버튼을 누르면 다음과 같이 `post()` 메서드를 호출하도록 했습니다.

```swift
import UIKit

class WebButtonBundlerView: UIViewController {
    private func postUrlNotification(_ urlString: String) {
        guard let url = URL(string: urlString) else { return }
        NotificationCenter.default.post(name: NSNotification.Name("openWebNotification"), object: url)
        dismiss(animated: true, completion: nil)
        guard let presentingVC = self.presentingViewController as? MainViewController else {
            fatalError()
        }
        NotificationCenter.default.removeObserver(presentingVC, name: NSNotification.Name("openWebNotification"), object: nil)
    }

    @IBAction func handleOpenGoogleBtn(_ sender: UIButton) {
        postUrlNotification("https://www.google.co.kr")
    }
    /* 생략(다른 버튼들) */
}
```

- `post()`의 인자로 이벤트 신호 전달할 옵저버의 **이름**을 넣어줍니다.
- 또한 `object` 파라미터를 이용하여 **데이터**를 전달할 수도 있습니다.
- <b class="red">주의할 점</b>은 **옵저버**를 사용해준 뒤 `removeObserver()` 메서드를 이용해서 옵저버해제(메모리를 해제)를 해주어야 합니다.

<kline></kline>

<h2 class="ksubsubject">(3) 번외 - 만약 옵저버(메모리)를 해제하지 않는다면?</h2>

- 만약 **옵저버**를 해제하면 어떻게 될지 확인하기 위해 아래와 같이 `MainViewController`에 <b class="brown">임시버튼</b>을 생성해줬습니다.

<img src="/assets/img/swift/delegate_notification/2.png" width="90%" alt="finished version">

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>정상적이라면 <b class="brown">임시버튼</b>이 동작하지 않아야 합니다.</li>
			<li>처음에는 <b class="brown">임시버튼</b>을 눌러도 동작하지 않다가 <b class="green">왭번들러 버튼</b>을 누른 순간<span style="font-size:90%">(옵저버생성시점)</span>부터 계속 동작하게 됩니다.</li>
			<li>즉, 옵저버는 계속해서 <rd>감시상태</rd>에 있게 되고 이는 성능적으로 좋지않을 것 같습니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/delegate_notification/no_remove_observer.gif" width="100%" style="max-width:200px" alt="finished version">
    </div>
</div>
<br>
<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>물론 오른쪽의 짤을 보면 알듯이 <b class="blue">옵저버를 생성해주는 뷰자체를 나가버린다면</b><b style="font-size:90%">(뷰는 <b>스택</b>의 형태로 쌓이고 해제됨)</b> 옵저버가 <rd>자동으로 해제</rd>됩니다.</li>
			<li>그래도 습관적으로 메모리를 해제해 주어 옵저버를 필요할때만 사용하도록 하는 것이 좋을 것 같습니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/delegate_notification/auto_remove_observer.gif" width="100%" style="max-width:200px" alt="finished version">
    </div>
</div>

<h1 class="ksubject">4️⃣ delegate vs notification(개인적인 생각)</h1>

- 개인적으로 <b class="green">delegate</b>를 이용하는 편이 다음과 같은 이유 때문에 **유연**해 보였습니다.
  1.  여러가지 **처리함수**(이벤트)를 하나의 delegate로 처리하도록 만들 수 있고 **옵셔널**사용유무에 따라 강제할 수도 있고 **함수목록**을 쉽게 확인할 수 있음
  2.  **notification**의 파라미터`object`는 `Any` 타입으로 전달되기 때문에 전달받는 입장에서 타입을 파악하기가 쉽지않아 실수할 가능성이 있다.
  3.  **notification**은 **옵저버**의 메모리 생성과 해제를 직접관리해주어야 한다.
- **notification**의 장점을 생각해본다면
  1. **여러객체**의 **옵저버**에게 동시에 신호를 전달할 수 있다. <b style="font-size:90%">(delegate도 가능하지만 코드가 길어짐)</b>
  2. **옵저버**자체의 **식별자(이름)**으로 감시하는 장점이 분명 있을 것 같음
  3. **delegate**뿐만아니라 **notification**도 **UIKit**에 내장된 것이 있는데(ex. 키보드감지notification) 그 이유가 있을 것이다.
- 결국, 각각의 장단점을 잘 파악해서 사용하는 것이 좋을 것 같습니다.
