---
layout: post
title: '[swift] JSON데이터 받아오기2'
subtitle: ''
date: 2022-01-20 02:45:51 +0900
categories: swift
tags: etc
comments: true
---

<h1>1️⃣ 목표</h1>

- 이전 포스트에서 <b>swift</b>에서 <b class="blue">Json</b> 데이터를 받아오는 방법에 대해 알아 봤습니다.
- 이번에는 더 나아가 <b class="orange">비동기</b>적으로 데이터를 받아오는 다양한 방법에 대해 알아보도록 하겠습니다.
- 이전 포스트인 <a href="https://kirkim.github.io/swift/2022/01/17/getWebData.html">JSON데이터 받아오기1</a>에서 구현한 코드를 **베이스**로 구현해 나갈 예정입니다.

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<ol>
				<li>각각의 데이터를 불러오는과정은 <rd>"sleep()"</rd>메서드를 이용하여 의도적으로 시간이 걸리도록 했습니다.</li>
				<li><b class="orange">비동기</b>적으로 데이터를 불러오는 것이 핵심 목표이기 때문에 오른쪽 짤과같이 데이터를 불러오는 과정에서도 화면의 다른 기능들이 정상적으로 동작하도록 구현하도록 했습니다.</li>
				<li>또한 데이터를 받아오는 기능은 <rd>독립적인 클래스</rd>로 만들었습니다. <b style="font-size:90%">(같은 클래스에 만들면 해당 클래스변수를 직접 대입하면 끝이기 때문, 하지만 이렇게 만들면 클래스의 크기가 너무 커지고 가독성이 떨어짐)</b></li>
			</ol>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/async_getdata/result_async_tableView.gif" width="100%" style="max-width:200px" alt="finished version">
    </div>
</div>

<kline></kline>

<h2 class="ksubsubject">기본베이스 Http GET 클래스</h2>

- 이번에 다음과 같이 **다섯가지**방법을 알아볼 것입니다.

  1.  나만의 옵저버클래스(추천x)
  2.  클로져
  3.  델리게이트
  4.  노티피케이션
  5.  async/await

- 위에서 <b class="green">async/await</b>를 제외한 모든 방법이 다음의 <b class="brown">베이스코드</b>를 확장하는 식으로 구현할 예정입니다.

<h3 align="middle" class="ksubsubject">&lt; 베이스 코드 &gt;</h3>

```swift
class HttpBase {
  static let shared = HttpUseCustomObserver()

  private init() { }

  public func readyData() {
    let session = URLSession.shared

    let components = URLComponents(string: "http://localhost:8080")
    guard let url = components?.url else { return }

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    session.dataTask(with: request) { data, response, error in
      guard let httpResponse = response as? HTTPURLResponse,
            httpResponse.statusCode == 200 else { return } // 응답검증
      guard let data = data else { return }
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
- 하지만 <b class="green">델리게이트, 노티피케이션</b>을 이용한 클래스는 <b class="blue">일반적인 클래스</b>로 만들어 줬습니다. 그 이유는 특정 delegate 혹은 notification키와 <b class="purple">결합도(coupling)</b>가 생기기 때문입니다.

<h1 class="ksubject">2️⃣ 나만의 옵저버클래스(추천x)</h1>

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
  1.  <b class="blue">readyData()</b>함수를 호출하여 비동기적으로 데이터를 받아옴
  2.  완료시 <b class="green">isReady</b>클래스변수를 <b class="purple">true</b>로 변경
  3.  <b class="purple">getData()</b>함수를 호출하면 **0.1초**의 간격으로 재호출
  4.  <b class="green">isReady</b>가 **true**가 되면 <rd>데이터를 반환</rd>
  5.  <b class="green">isReady</b>가 <b class="purple">true</b>인 상태라면 <b class="blue">readyData()</b>를 호출하더라도 데이터를 또다시 받아오지 않음

<img src="/assets/img/swift/async_getdata/result_customobserver.gif" width="100%" style="max-width:400px" alt="result custom observer">

- **최초로 호출**했을때만 데이터를 불러오고 **그 뒤**에는 <rd>호출스텍이 사라지더라도</rd> <b class="green">데이터를 다시 불러올 필요없이 바로 데이터를 불러올 수 있습니다.</b>
- <b class="green">싱글턴</b>으로 만들어진 클래스이기 때문에 <rd>클래스를 최초로 호출한 뷰의 스텍이 사라지더라도 데이터가 사라지지 않았기 때문</rd>
- 어떻게 보면 다시 데이터를 불러올 필요가 없기 때문에 좋아보입니다. 하지만 **데이터가 사라지지 않기 때문**에 오히려 메모리가 무거워지는 단점이 생길 수 있습니다.
- 그렇기 때문에 개인적인 생각으로는 <b class="green">싱글턴</b>으로 구현한 클래스 <rd>내부</rd>에 **직접적으로 데이터를 저장하지 않는 것**이 좋을 것 같습니다.
- 또한 위처럼 구현한 클래스는 **0.1초**간격으로 함수가 재호출되는 과정이 필요하며, <rd>처리가 완료되는 시점을 정확히 아는데 한계</rd>가 있습니다.

<h1 class="ksubject">3️⃣ 클로져(closure)</h1>

- 이번 포스트의 목표를 다시한번 말하자면 <b class="green">데이터받아오기가 끝난 시점에 다른곳에서 데이터를 처리하는 방법</b>을 찾는 것입니다.
- 사실 **클로져함수**의 사용법에 대해 잘 알고 있었더라면 위에서 "2️⃣"처럼 **호출함수**를 만들어줄 필요없가 없습니다. <b class="blue">클로져 파라미터를 만들어주는 방법</b>을 사용하면 쉽게 해결할 수 있습니다.

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
- 이렇게 만들어준 **클로져를 이용한 클래스**를 다음과 같이 사용합니다.

```swift
HttpUseClosure.shared.getData { data in
  self.myData = data
  DispatchQueue.main.async {
    self.myTableView.reloadData()
  }
}
```

- <b class="green">session.dataTask</b>의 클로져의 처리가 자동으로 <b class="brown">외부 스레드</b>에서 처리합니다. 그렇기 때문에 **UI**에 영향을 주는 테이블뷰의 **reloadData()**는 **메인스레드**에서 처리하도록 `DispatchQueue.main.async`로 감싸 주었습니다.
