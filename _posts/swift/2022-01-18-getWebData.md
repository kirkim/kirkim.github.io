---
layout: post
title: '[swift] JSON데이터 받아오기1'
subtitle: ''
date: 2022-01-18 02:45:51 +0900
categories: swift
tags: etc
comments: true
---

<h1>1️⃣ 목표</h1>

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>이번 목표는 특정 <rd>Url</rd>을 통해 데이터를 가져오는 방법에 대해 알아볼 예정입니다.</li>
			<li>정상적으로 <b class="green">데이터</b>를 가져오는데 성공하면 오른쪽과 같이 출력 될 것 입니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/getWebData/1.png" width="100%" style="max-width:200px" alt="finished version">
    </div>
</div>

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li><b class="green">Node.js</b>를 이용해서 간단한 백엔드 서버를 만들었습니다.</li>
			<li><b class="blue">http://localhost:8080</b>에 <rd>get</rd>요청을 하면 10개의 유저정보를 얻어 올 수 있도록 구현했습니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/getWebData/2.png" width="100%" style="max-width:200px" alt="temp backend">
    </div>
</div>

<h1 class="ksubject">2️⃣ 기본 구현</h1>
<h2 class="ksubsubject">(1) 데이터 모델(DataModel.swift)</h2>

- 먼저 **받아올 데이터(JSON)**의 구조체를 잡아줍니다.
- **각각의 변수명**은 **받아올 데이터**의 <rd>key</rd>값과 정확히 <rd>일치</rd>해야 정상적으로 불러올 수 있습니다.

```swift
struct DataModel: Codable {
    let resultCount: Int
    let result: [Result]
}

struct Result: Codable {
    let username: String
    let age: Int
    let gender: String
}
```

- 혹은 다음과 같이 `CodingKey`를 이용하여 자신만의 변수명으로 설정할 수 있습니다.
- <b class="red">주의할 점</b>은 반드시 enum의 명을 <b class="blue">"CodingKeys"</b>로 해야하며, 변경이 없더라도 해당 구조체의 변수를 case로 모두 등록해 주어야 합니다.

```swift
struct DataModel: Codable {
    let cnt: Int
    let result: [Result]

    enum CodingKeys: CodingKey, String {
        case cnt = "resultCount"
        case result // 바꾸지 않는 변수도 선언
    }
}

struct Result: Codable {
    let username: String
    let age: Int
    let gender: String
}
```

<kline></kline>

<h2 class="ksubsubject">(2) 데이터 얻어오기(<b class="green" style="font-size:80%">Data(contentsOf:) 이용</b>)</h2>

- 다음과 같이 간단하게 <b class="green">Data(contentsOf:)</b>를 이용하여 데이터를 불러올 수있습니다.

```swift
class MainVC: UIViewController, UITableViewDataSource {
  private var myData: DataModel?
  @IBOutlet weak var mainTableView: UITableView!

  override func viewDidLoad() {
    /* 생략 */
    self.getDataSimple()
  }

  private func getDataSimple() {
    guard let url = URL(string: "http://localhost:8080") else { return }
    do {
      let data = try Data(contentsOf: url)
      self.myData = try JSONDecoder().decode(DataModel.self, from: data)
      self.mainTableView.reloadData()
    } catch {
      print(error)
    }
  }
  /* 테이블 뷰 데이터소스설정 메서드 생략 */
}
```

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li><b>유저정보가 10개</b>이기 때문에 문제없이 돌아가는 것 같습니다.</li>
			<li>그래서 이번엔 유저 데이터를 <b class="purple">1000000개</b>로 늘려서 다시 한번 실행해 봤습니다.</li>
			<li>오른쪽과 같이 <rd>모든 데이터</rd>를 불러올때까지 <b class="blue">메인 뷰</b>가 열리지 않습니다.</li>
			<li>그 이유는 <b class="green">Data(contentsOf:)</b>는 <rd>동기적</rd>으로 데이터를 받아오기 때문입니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/getWebData/sync_data.gif" width="100%" style="max-width:200px" alt="sync Data function">
    </div>
</div>

<h2 class="ksubsubject">(2 <b style="font-size:80%">- 2</b>) 멀티스레드를 이용해서 처리하기(<b class="green" style="font-size:80%">Data(contentsOf:) 이용</b>)</h2>

- 그렇다면 위의 문제를 어떻게 해결해볼 수 있을까요?
- 한가지 방법으로 <b class="green">DispatchQueue.global().async</b>를 이용해서 처리하는 것 입니다.
- 결과적으로 아래와 같이 작성하면 <rd>런타임 오류</rd>가 발생합니다. <span style="font-size:90%">(이유는 아래 설명)</span>

```swift
class MainVC: UIViewController, UITableViewDataSource {
  /* 생략 */

  private func getDataSimple() {
    guard let url = URL(string: "http://localhost:8080") else { return }
    DispatchQueue.global().async {
      do {
        let data = try Data(contentsOf: url)
        self.myData = try JSONDecoder().decode(DataModel.self, from: data)
        self.mainTableView.reloadData()
      } catch {
        print(error)
      }
	}
  }
  /* 테이블 뷰 데이터소스설정 메서드 생략 */
}
```

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<li>오류가 일어난 이유는 <b class="green">UI의 처리부분을 main쓰레드에서 처리하지 않았기 때문</b>입니다.</li>
			<li>위의 코드에서 <b class="brown">mainTableView를 리로드</b>하는 과정은 UI에 영향을 주는 부분입니다.</li>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/getWebData/3.png" width="100%" style="max-width:200px" alt="thread error">
    </div>
</div>
<br>

- 위의 문제는 <b class="brown">mainTableView를 리로드</b>를 처리하는 부분을 다음과 같이 메인쓰레드에서 처리하도록 해주면 해결 됩니다.

```swift
DispatchQueue.main.async {
  self.mainTableView.reloadData()
}
```

- 한가지 의문이 드는 것이 `DispatchQueue.global().async` 에서 `async`는 <b class="blue">asynchronous(비동기)</b>의 약자일 것입니다. 하지만 위의 에러를 봤듯이 **다른 스레드**에서 처리해서 에러가 발생한 것을 알 수 있습니다.
- <b class="blue">비동기 처리</b>와 <b class="green">멀티쓰레드 처리</b>는 비슷한 것 같지만 다른개념입니다. <b class="brown">OKKY 커뮤니티</b>의 어느분께서 이것에 대해서 아래와 같이 쉽게 설명해 주셨습니다.

<img src="/assets/img/swift/getWebData/4.png" width="100%" style="max-width:300px" alt="async vs multithread">

- 그렇다면 **멀티스레드 - 비동기**가 동시에 적용되는 것인가 의문이 들었습니다.
- 먼저 다음과 같은 간단한 예시를 이용했습니다.

```swift
DispatchQueue.main.async {
  sleep(2)
  print("first")
}
DispatchQueue.main.async {
  print("second")
}
```

<kkr>
<rmk>/* 출력 */</rmk><br>
first<br>
second<br>
</kkr>

- 동일한 **메인쓰레드**에서 처리하도록 해봤습니다. 기대와 다르게 <rd>동기적</rd>으로 처리 되었습니다.
- 그러면 다음과 같이 **메이쓰레드**가 아닌 다른 동일한 쓰레드에서 처리한다면 어떻게 될까요.

```swift
let kirQueue = DispatchQueue(label: "kirkim")
kirQueue.async {
    sleep(2)
    print("first")
}
kirQueue.async {
    print("second")
}
```

<kkr>
<rmk>/* 출력 */</rmk><br>
first<br>
second<br>
</kkr>

- 이것도 <rd>동기적</rd>으로 처리 되었습니다.
- **위의 정보들**을 종합해 봤을 때 멀티쓰레드처리 방식인 것 같습니다. 혹은 <b class="yellow">자바스크립트</b>에서의 **비동기**와는 다른개념이거나 아니면 **위의 예시**들이 잘못됐을 수도 있을 것 같습니다.
- 이 부분에 대해서는 **좀 더 공부해봐야할 것 같습니다.**
- 아무튼 `DispatchQueue`의 사용법에 대해 좀 더 알고 싶다면 <a href="https://zeddios.tistory.com/516" target="blank">GCD - Dispatch Queue사용법(1) - Zedd0202</a>포스트를 참고하면 좋을 것 같습니다.

<kline></kline>

<h2 class="ksubsubject">(3) 데이터 얻어오기(<b class="green" style="font-size:80%">URLSession을 이용</b>)</h2>

- <a href="https://wlgusdn700.tistory.com/57" target="blank">[iOS] Image를 URLSession / Kingfisher를 통해 가져오기 - 나무's블로그</a>글을 참고해보면 **이미지**나 **큰 데이터**를 받아올 떄는 위에서 사용해본 `Data()`메서드를 이용하지 말라고 합니다. **Apple documentation**을 봐도 간단한 데이터를 처리한다고 언급하고 있습니다.

<img src="/assets/img/swift/getWebData/5.png" width="100%" style="max-width:300px" alt="Data documentation">

- <a href="https://developer.apple.com/documentation/foundation/nsurlsession?language=objc" target="blank">NSURLSession - Apple documentation</a>에서도 길게 설명하는데 <b class="blue">URLSession</b>을 이용해서 구현하는 방법을 익히는 것이 좋을 것같습니다. <b style="font-size:90%">(URLSession이 왜 큰 데이터를 처리하는데 유리한지에 대해 꼭 다시 공부해봐야 겠다.)</b>
- 일단 **다른 블로그글**들을 참고하여 다음과 같이 <b class="blue">URLSession</b>을 활용하여 데이터를 받아오는 코드를 구현했습니다.

```swift
class MainVC: UIViewController, UITableViewDataSource {
  /* 생략 */

  private func getDataUseSession() {
    let session = URLSession.shared
    let components = URLComponents(string: "http://localhost:8080")
    guard let url = components?.url else { return }
    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    session.dataTask(with: request) { data, res, error in
      if let hasData = data {
        do {
          self.myData = try JSONDecoder().decode(DataModel.self, from: hasData)
          DispatchQueue.main.async { // UI에 관여하는 작업은 메인쓰레드에서 처리
            self.mainTableView.reloadData()
          }
        } catch {
          print(error)
        }
      }
    }.resume()
    session.finishTasksAndInvalidate()
  }
  /* 테이블 뷰 데이터소스설정 메서드 생략 */
}
```
