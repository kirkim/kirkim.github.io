---
layout: post
title: '[swift] 비동기데이터를 처리하는 클래스(or 함수) 만들기 '
subtitle: ''
date: 2022-01-20 02:45:51 +0900
categories: swift
tags: etc
comments: true
---

<h1>1️⃣ 목표</h1>

- 이전 포스트에서 <b>swift</b>에서 <b class="blue">Json</b> 데이터를 받아오는 방법에 대해 알아 봤습니다.
- 이번에는 더 나아가 <b class="orange">비동기</b>적으로 데이터를 받아오는 다양한 방법에 대해 알아보도록 하겠습니다.
- 이전 포스트인 <a href="https://kirkim.github.io/swift/2022/01/17/getWebData.html">JSON데이터 받아오기</a>에서 구현한 코드를 **베이스**로 코드를 구현해 나갈 예정입니다.

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<ol>
				<li>각각의 데이터를 불러오는과정은 <rd>"sleep()"</rd>메서드를 이용하여 의도적으로 시간이 걸리도록 했습니다.</li>
				<li><b class="orange">비동기</b>적으로 데이터를 불러오는 것이 핵심 목표이기 때문에 오른쪽 짤과같이 데이터를 불러오는 과정에서도 화면의 다른 기능들이 정상적으로 동작하도록 구현 했습니다.</li>
				<li>또한 데이터를 받아오는 기능은 <rd>독립적인 클래스</rd>로 만들었습니다. <b style="font-size:90%">(같은 클래스에 만들면 해당 클래스변수를 직접 대입하면 끝이기 때문, 하지만 이렇게 만들면 클래스의 크기가 너무 커지고 가독성이 떨어짐)</b></li>
			</ol>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/async_getdata/result_async_tableView.gif" width="100%" style="max-width:200px" alt="finished version">
    </div>
</div>

<kline></kline>

<h2 class="ksubsubject">기본베이스가될 Http응답 클래스</h2>

- 이번에 다음과 같이 **다섯가지**방법을 알아볼 것입니다.

  <ol style="color:#081f56;font-weight:bold;font-size:90%;margin-left:5px">
    <li>  나만의 옵저버클래스(추천x)</li>
    <li>  클로져</li>
    <li>  델리게이트</li>
    <li>  노티피케이션</li>
    <li>  async/await</li>
  </ol>

- 위에서 <b class="green">async/await</b>를 제외한 모든 방법이 다음의 <b class="brown">베이스코드</b>를 확장하는 식으로 구현할 예정입니다.
- <b class="brown">베이스코드</b>는 <b class="green">URLSession</b>을 만들어 session의 **Task**안에서 데이터를 받아오는 식으로 구현됩니다.
- <b class="green">URLSession</b>은 다음 과 같이 <b class="blue">싱글턴</b> 혹은 <b class="purple">configuration</b>을 직접 지정해주는 식으로 생성할 수 있습니다.

  ```swift
  // 직접생성
  let session = URLSession(configuration:)

  // 싱글턴 사용
  let session = URLSession.shared
  ```

- 당연히 <b class="blue">싱글턴</b>을 사용하면 <rd>한계(limitations)</rd>가 있는데, 다음과 같습니다. <br><b style="font-size:75%">(출처: <a href="https://developer.apple.com/documentation/foundation/nsurlsession/1409000-sharedsession?language=objc" target="blank">sharedSession - Apple developer</a>)</b>

  1. You can't obtain data incrementally as it arrives from the server.
     <br><b style="color:#405a58;">서버에서 데이터가 들어오는 대로 점진적으로 데이터를 얻을 수 없다.</b>
  2. You can't significantly customize the default connection behavior.
     <br><b style="color:#405a58;">기본 연결동작의 커스터마이징에 제한이 있다.</b>
  3. Your ability to perform authentication is limited.
     <br><b style="color:#405a58;">인증 수행 능력이 제한된다.</b>
  4. You can't perform background downloads or uploads when your app isn't running.
     <br><b style="color:#405a58;">백그라운드에서 다운로드 또는 업로드를 수행할 수 없다.</b>

- 이번 포스트에서는 **기본 configuration**을 이용해서 **Session**을 만들어 줬습니다. 둘의 자세한 비교는 나중에 다루도록 하겠습니다.

<h3 align="middle" class="ksubsubject">&lt; 베이스 코드 &gt;</h3>

```swift
class HttpBase {
  static let shared = HttpUseCustomObserver()

  private init() { }

  public func readyData() {
    let sessionConfiguration = URLSessionConfiguration.default
    let session = URLSession(configuration: sessionConfiguration)

    let components = URLComponents(string: "http://localhost:8080")
    guard let url = components?.url else { return }

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    session.dataTask(with: request) { data, response, error in
      guard let httpResponse = response as? HTTPURLResponse,
            httpResponse.statusCode == 200,
            let data = data else {
              print(error.debugDescription)
              return
            } // 응답검증
      do {
        sleep(2) // 이곳에서 지연시간을 줌
        /* 데이터를 JSON형태로 받아오는 곳 */
      } catch {
        print(error)
      }
    }.resume()
    session.finishTasksAndInvalidate()
  }
}
```

- <b class="brown">베이스코드</b>를 <rd>싱글턴(singleton)</rd>을 사용해서 구현했는데 <b class="purple">Java</b>에서 싱글톤 사용시 **멀티쓰레드**에서 싱글턴의 인스턴스가 중복선언되는 문제가 있어서 클래스 안쪽에 <rd>lazy</rd>클래스를 만들어 의도적으로 **Thread-Safe**하도록 만들어줄 필요가 있습니다.
- 하지만 <b class="blue">swift</b>에서는 사용시점에 초기화되는 성질이 있기 때문에 의도적으로 **Thread-Safe**하도록 만들 필요가 없습니다. <br><b style="font-size:90%">(참고링크: <a href="https://babbab2.tistory.com/66">https://babbab2.tistory.com/66</a>)</b>
- 다음과 같이 생성시점에 호출되는 `init()`에 간단한 **print문**을 넣어 확인할 수 있습니다.

  ```swift
  class HttpUseCustomObserver {
    static let shared = HttpUseCustomObserver()

    private init() { print("싱글턴인스턴스 생성")}
  }
  ```

- <b class="green">델리게이트, 노티피케이션</b>을 이용한 클래스는 <b class="blue">일반적인 클래스</b>로 만들어 줬습니다. 그 이유는 특정 delegate 혹은 notification키와 <b class="purple">결합도(coupling)</b>가 생기기 때문입니다.

<h1 class="ksubject">2️⃣ 나만의 옵저버클래스를 이용한 방법(추천x)</h1>

- <b class="green">session.dataTask()</b>메서드의 **클로져 부분**이 비동기적으로 처리가 되다보니 <rd>데이터</rd>를 직접 **return하는 함수**를 만들더라도 `nil`값만을 반환했습니다.
- 그래서 데이터를 저장해둘 **클래스 변수(dataModel)**을 만들어 줬고 **변수(dataModel)**에 비동기적으로 데이터를 저장하는 함수 <b class="blue">readyData()</b>를 만들어 줬습니다.
- 또한 저장된 **클래스 변수(dataModel)**를 반환하는 함수 <b class="purple">getData()</b>함수를 <rd>재귀함수</rd>로 만들어 줬습니다.

```swift
class HttpUseCustomObserver {
  static let shared = HttpUseCustomObserver()
  private var dataModel: DataModel? // 데이터 임시 저장용
  private var isReady: Bool = false // 비동기처리 완료시 true
  private var count = 0 // 지연시간 확인용

  private init() { }

  public func readyData() {
    /* 생략 */

    guard isReady == false else { return } // 데이터가 있을 때 재호출 방지

    session.dataTask(with: request) { data, response, error
      guard let httpResponse =
	    response as? HTTPURLResponse,
        httpResponse.statusCode == 200 else {
          self.isError = true
          return
        }
      /* 생략 */
      do {
        sleep(2)
        self.dataModel = try JSONDecoder().decode(DataModel.self, from: data)
        self.isReady = true // 파싱완료시 true로 변경
      } catch {
        print(error)
      }
    }
    /* 생략 */
  }

  public func getData() -> DataModel? {
    self.count += 1
    print("Call getData() \(self.count) times")
	if (self.isError == true) {
      print("Fail Request")
      return nil
    }
    if (self.isReady == false) {
      usleep(100000) // 0.1초
      return getData()
    }
    return self.dataModel
  }
}
```

- 다음과 같이 동작합니다.
  1.  <b class="blue">readyData()</b>함수를 호출하여 비동기적으로 데이터를 받기를 시작
  2.  완료시 <b class="green">isReady</b>클래스변수를 <b class="purple">true</b>로 변경
  3.  <b class="brown">getData()</b>함수를 호출하면 **0.1초**의 간격으로 재귀적으로 <b class="brown">getData()</b>함수를 재호출
  4.  <b class="green">isReady</b>가 <b class="purple">true</b>가 되면 <b class="brown">getData()</b>함수에서 <rd>데이터를 반환</rd>
  5.  <b class="green">isReady</b>가 <b class="purple">true</b>인 상태라면 <b class="blue">readyData()</b>를 호출하더라도 데이터를 또다시 받아오지 않음

<img src="/assets/img/swift/async_getdata/result_customobserver.gif" width="100%" style="max-width:400px" alt="result custom observer">

- **최초로 호출**했을때만 데이터를 불러오고 **그 뒤**에는 <rd>호출스텍이 사라지더라도</rd> <b class="green">데이터를 다시 불러올 필요없이 바로 데이터를 불러올 수 있습니다.</b>
- <b class="green">싱글턴</b>으로 만들어진 클래스이기 때문에 <rd>클래스를 최초로 호출한 뷰의 스텍이 사라지더라도 데이터가 사라지지 않았기 때문</rd>
- 어떻게 보면 다시 데이터를 불러올 필요가 없기 때문에 좋아보입니다. 하지만 **데이터가 사라지지 않기 때문**에 오히려 메모리가 무거워지는 단점이 생길 수 있습니다.
- 그렇기 때문에 개인적인 생각으로는 <b class="green">싱글턴</b>으로 구현한 클래스 <rd>내부</rd>에 **직접적으로 데이터를 저장하지 않는 것**이 좋을 것 같습니다.
- 또한 위처럼 구현한 클래스는 **0.1초**간격으로 함수가 재호출되는 과정이 필요하며, <rd>처리가 완료되는 시점을 정확히 아는데 한계</rd>가 있습니다.
- 결과적으로 **비동기함수**를 다룰때 <b class="green">completion handler</b>(처리 후에 실행되는 클로져)가 왜 중요한지 알게 되었습니다.

<h1 class="ksubject">3️⃣ 클로져(closure)를 이용한 방법</h1>

- 이번 포스트의 목표를 다시한번 말하자면 <b class="green">"데이터받아오기가 끝난 시점에 다른곳에서 데이터를 처리하는 방법"</b>을 찾는 것입니다.
- 사실 **클로져함수**의 사용법에 대해 잘 알고 있었더라면 위에서 2️⃣처럼 **호출함수**를 만들어줄 필요없가 없습니다. <b class="blue">클로져 파라미터를 만들어주는 방법</b>을 사용하면 쉽게 해결할 수 있습니다.

```swift
class HttpUseClosure {
  static let shared = HttpUseClosure()

  private init() { }

  public func getData(completion: @escaping (DataModel?) -> Void) {
    /* 생략 */

    session.dataTask(with: urlRequest) { data, res, error in
      /* 생략 */
      do {
        sleep(2) // 의도적으로 딜레이를 줌
        let resultData = try JSONDecoder().decode(DataModel.self, from: data)
        completion(resultData)
      } catch {
        print(error)
      }
    }.resume()
    session.finishTasksAndInvalidate()
    completion(nil)
  }
}
```

- <b class="purple">completion</b>이란 이름의 **클로져** 파라미터를 만들어 줬습니다. 클로져처리가 끝나면 클로져 내부의 데이터들은 초기화 됩니다. 즉, 외부 변수에 저장하는 것이 불가능합니다. 하지만 <rd>@escaping</rd>키워드를 사용하면 외부에서 작업을 할 수 있는 <b class="blue">탈출 클로저</b>를 만들어 줄 수 있습니다.
- 위에 사용된 <b class="green">dataTask</b>함수의 클로져의 파라미터들은 <b class="blue">data, res, error</b> 3개로 도핑하여 사용했습니다. <b style="font-size:90%">(정확한 타입은 아래 이미지와 같다)</b>

<img src="/assets/img/swift/async_getdata/1.png" width="100%" style="max-width:500px" alt="finished version">

- 이중 **response(응답)**과 **error(에러)**처리는 함수 자체에서 처리하도록 구현했기 때문에 **탈출클로져**의 파라미터로는 <b class="purple">Data</b>만 있으면 됩니다. 추가로 <b class="purple">Data</b>값의 <b class="brown">JSON</b>파싱 또한 이 곳에서 처리할 것 이기 때문에 처리한 뒤의 타입인 <b class="green">DataModel</b>로 파라미터를 만들어줬습니다.

```swift
getData(completion: @escaping (DataModel?) -> Void)
```

- 일반적으로 **클로져**는 변수를 반환하지 않으므로 반환값을 **Void**로 적어 줍니다.
- 이렇게 만들어준 <b class="brown">클로져를 이용한 클래스</b>를 다음과 같이 사용합니다.

```swift
HttpUseClosure.shared.getData { data in
  self.myData = data
  DispatchQueue.main.async {
    self.myTableView.reloadData()
  }
}
```

- <b class="green">session.dataTask</b>의 클로져의 처리가 자동으로 <b class="brown">외부 스레드</b>에서 처리되는듯 합니다. 그렇기 때문에 **UI**에 영향을 주는 테이블뷰의 **reloadData()**는 **메인스레드**에서 처리하도록 `DispatchQueue.main.async`로 감싸 주었습니다.

<h1 class="ksubject">4️⃣ 델리게이트(delegate)를 이용한 방법</h1>

- 지금부터 다룰 <b class="green">델리게이트, 노티피케이션</b>을 이용한 방법은 이전 포스트에서 정리한 <a href="https://kirkim.github.io/swift/2022/01/09/delegate_notification.html" target="blank">&lt;delegate와 notificationCenter을 이용해서 이벤트 전달하기&gt;</a>의 방법을 이용했습니다.

- 다음과 같이 <b class="purple">DataModel</b>의 타입을 따르는 변수를 받아 처리하는 <b class="green">델리게이트 프로토콜(delegate protocol)</b>을 만들어 줬습니다.

```swift
protocol MyHttpDelegate {
  func getDataUseCustomDelgate(data: DataModel)
}
```

- **http**응답을 **delegate**를 이용하여 전달하는 클래스를 다음과 같이 구현했습니다.
- 클래스에 내장된 **delegate**는 각각의 사용하는 곳에서 <rd>독립적으로 존재</rd>해야 되야되기 때문에 <b class="purple">싱글턴</b>으로 구현하지 않았습니다.

```swift
class HttpUseCustomDelegate {
    var myHttpDelegate: MyHttpDelegate?

    func getData() {
        /* 생략 */

        session.dataTask(with: urlRequest) { data, res, error in
            /* 생략 */
            do {
                sleep(2) // 지연시간을 줌
                let resultData = try JSONDecoder().decode(DataModel.self, from: data)
                self.myHttpDelegate?.getDataUseCustomDelgate(data: resultData) // JSON으로 파싱한 데이터를 넘겨줌
            } catch {
                print(error)
            }
        }.resume()
        session.finishTasksAndInvalidate()
    }
}
```

- 이렇게 만들어준 <b class="brown">delegate를 이용한 클래스</b>를 다음과 같이 사용합니다.

```swift
override func viewDidLoad() {
  /* 생략 *//
  let httpUseDelegate = HttpUseCustomDelegate()
  httpUseDelegate.myHttpDelegate = self
  DispatchQueue.global().async {
    httpUseDelegate.getData()
  }
}

func getDataUseCustomDelgate(data: DataModel) {
  self.myData = data
  DispatchQueue.main.async {
    self.myTableView?.reloadData()
  }
}
```

<h1 class="ksubject">5️⃣ 노티피케이션(notification)을 이용한 방법</h1>

- **delegate**를 이용한 방법과 마찬가지로 <b class="green">노티피케이션(notification)</b>을 이용한 클래스를 <b class="purple">싱글턴</b>으로 만들어주지 않았습니다.
- **생성시점**에서 <b class="brown">Notification이름</b>을 지정해줄 수 있도록 만들어 줬습니다.

```swift
class HttpUseNotification {
  private var notificationName: NSNotification.Name

  init(_ notificationName: NSNotification.Name) {
    self.notificationName = notificationName
  }

  func getData() {
    /* 생략 */

    session.dataTask(with: urlRequest) { data, res, error in
      /* 생략 */
      do {
        sleep(2)
        let resultData = try JSONDecoder().decode(DataModel.self, from: data)
        NotificationCenter.default.post(name: self.notificationName, object: resultData)
      } catch {
          print(error)
      }
    }.resume()
    session.finishTasksAndInvalidate()
  }
}
```

- 이렇게 만들어준 <b class="brown">notification을 이용한 클래스</b>를 다음과 같이 사용합니다.
- **notifiaction의 observer를 사용한 후**에 반드시 <rd>메모리해제</rd>를 해야한다는 것을 잊으면 안됩니다.

```swift
override func viewDidLoad() {
  /* 생략 */
  let notificationName = NSNotification.Name("getDataNotification")
  NotificationCenter.default.addObserver(self, selector: #selector(getDataUseNotification), name: notificationName, object: nil)
  let httpUseNotification = HttpUseNotification(notificationName)
  httpUseNotification.getData()
}

@objc func getDataUseNotification(_ notification: Notification) {
  guard let data = notification.object as? DataModel else { return }
  self.myData = data
  DispatchQueue.main.async {
    self.myTableView?.reloadData()
  }
  NotificationCenter.default.removeObserver(self, name: NSNotification.Name("getDataNotification"), object: nil)
}
```

<h1 class="ksubject">6️⃣ async/await를 이용한 방법</h1>

- <b class="blue">data(for:)</b>메서드를 이용하면 <b class="purple">async/await</b>의 비동기적인 방법으로 데이터를 받아올 수 있습니다.
- 약간의 성능향상(?)을 위해서 <b class="blue">data(for:)</b>를 <b class="purple">async let</b>키워드를 사용해서 비동기적으로 선언해 줬으며 **변수**를 사용하는 시점에서 <b class="purple">await</b>키워드를 사용하여 동기적으로 처리하도록 했습니다.
- <b class="brown">싱글턴</b>으로 작성된 클래스이기 때문에 데이터를 저장하는 변수 <b class="green">resultData</b>는 **함수 내부**에 선언해주어 사용후에 메모리가 해제되도록 했습니다.
- 이런식으로 코드가 복잡한 곳에서 <b class="purple">async/await</b>을 사용하면 <rd>콜백 지옥(클로저 지옥)</rd>에서 벗어나 코드를 좀 더 깔끔하게 사용할 수 있습니다.

```swift
class HttpUseAsyncAwait {
  static let shared = HttpUseAsyncAwait()

  private init() { }

  public func getData() async -> DataModel? {
      /* 생략 */

      let request = urlRequest
      async let (data, response) = session.data(for: request)

      var resultData: DataModel?
      do {
          sleep(2)
          guard let httpResponse = try await response as? HTTPURLResponse,
                httpResponse.statusCode == 200 else { return nil }
          resultData = try await JSONDecoder().decode(DataModel.self, from: data)
      } catch {
          print(error)
      }
      return resultData
  }
}
```

- 이렇게 만들어준 <b class="brown">async/await를 이용한 클래스</b>를 다음과 같이 사용합니다.

```swift
let httpUseAsyncAwait = HttpUseAsyncAwait.shared
Task {
  self.myData = await httpUseAsyncAwait.getData()
  DispatchQueue.main.async {
    self.myTableView?.reloadData()
  }
}
```

- 여기서 <b class="purple">Task</b>의 클로저 안에 작업을 작성해줍니다. 아래의 **경고메시지**를 보면 <b class="purple">Task.init</b>는 기존의 <b class="green">async(priority:operation:)</b>를 대체한다고 말하고 있습니다.

<img src="/assets/img/swift/async_getdata/2.png" width="100%" style="max-width:600px" alt="soon dispatch async">

- <b class="purple">Task</b>대신에 <b class="green">디스패치큐(dispatchQueue)</b>를 만들어 처리해보려했지만 다음과 같은 에러가 발생하였습니다. **asyn/await**를 최종적으로 처리할 때는 <b class="purple">Task</b>로 감싸야하는데 그 이유에 대해서는 좀더 공부해봐야할 것 같습니다.

<img src="/assets/img/swift/async_getdata/3.png" width="100%" style="max-width:600px" alt="error use dispatchqueue at asyn/await">

- 그리고 <rd>주의할 점</rd>이 있는데 <b class="purple">Task</b>클로저 안쪽에서 변수를 선언해주면 앱이 멈추는 현상이 발생합니다.

```swift
let httpUseAsyncAwait = HttpUseAsyncAwait.shared
Task {
  let a = "apple" // Task안쪽에 변수 선언
  self.myData = await httpUseAsyncAwait.getData()
  DispatchQueue.main.async {
    self.myTableView?.reloadData()
  }
}
```

- 그렇기 때문에 앱이 멈추지 않도록 <b class="blue">클래스</b>를 **Task**밖에서 **초기화** 해주었습니다.
- 만약 <rd>초기화</rd>를 **Task**안쪽에서 하면 다음과 같이 <rd>Task안쪽의 업무가 끝날때까지 앱이 멈춰 있게 됩니다.</rd> <b class="font-size:90%">(<b class="blue">싱글턴</b>클래스 뿐만아니라 일반클래스 또한 같은 문제가 발생)</b>
- `print()`과 `sleep()` 같은 단순한 코드도 **앱을 멈추게 했는데** 아마 <b class="bronw">Task클로저</b> 안에 <rd>동기적인 처리를 하면 멈추게 되는 것</rd> 같습니다.

```swift
Task {
  let httpUseAsyncAwait = HttpUseAsyncAwait.shared
  /* 생략 */
}
```

<div class="explain-cover" style="padding: 0 20%">
    <div class="explain-left">
		<h4 align="middle">&lt; viewDidLoad()에서 사용 &gt;</h4>
		<img src="/assets/img/swift/async_getdata/didload_await.gif" width="100%" style="max-width:200px" alt="bad_example_in_scrollView">
	</div>
    <div class="explain-right">
		<h4 align="middle">&lt; viewDidAppear()에서 사용 &gt;</h4>
        <img src="/assets/img/swift/async_getdata/appear_await.gif" width="100%" style="max-width:200px" alt="good_example_in_scrollView">
    </div>
</div>

- <b class="blue">viewDidLoad()</b>에서 위와같이 사용시 **Task**업무가 끝날때까지 <rd>화면이 나타나지 않습니다.</rd>
- <b class="brown">viewDidAppear()</b>에서 사용시 화면은 나타나지만 그 후의 동작들이 멈춰있게 됩니다.
- 당연한 결과이지만 <b class="green">라이프사이클</b>로 해결할 수 있는 문제가 아닙니다. 그렇기 때문에 <b class="green">Task안쪽에는 비동기처리코드만 작성하는 것이 좋을 것</b> 같습니다.
- <b class="brown">Task</b>의 <b class="purple">priority</b>옵션을 주어 <b class="blue">비동기 처리의 우선순위</b>를 지정해줄 수 있습니다.

<img src="/assets/img/swift/async_getdata/4.png" width="100%" style="max-width:400px" alt="Task option">

- 여기까지 봤을때 <b class="brown">Task</b>는 <b class="blue">DispatchGroup(디스패치그룹)</b>과 같은 기능을 하는데 좀 더 **가시적으로 보여주는 역할**을 하는 것이 아닌가 생각이 듭니다.

<h3 class="ksubsubject">포스트를 마치며</h3>

- 비동기 관련 내용은 <b class="org">Javascript</b>에서도 공부해본적이 있지만 <b class="red">swift</b>에서의 **비동기**는 색다르게 다가오는 것 같습니다. 이번 포스트에서도 아직 완벽하게 파악하지 못한부분도 있고 **구글링**을 통해봤을 때 아직 접해보지 못한 비동기관련 수많은 기능들과 개념들이 있습니다. **iOS개발자**는 결국에 자연스러운 UI구현이 목표이기 때문에 꾸준히 **비동기처리**관련해서 생각할 필요가 있을 것 같습니다.
