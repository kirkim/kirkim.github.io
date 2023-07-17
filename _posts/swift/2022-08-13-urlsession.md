---
layout: post
title: '[Swift] UrlSession사용하기'
subtitle: ''
date: 2022-08-13 12:45:51 +0900
categories: ios
tags: swift
comments: true
---

⛔️ 이번포스트는 <a href="https://developer.apple.com/documentation/foundation/urlsession">URLSession - Apple Documnetation</a>을 참고하여 정리한 글입니다.<br />
틀린내용에 대한 피드백은 메일로 보내주시면 감사하겠습니다🙏🏻

<kline></kline>

<h1>1️⃣ URLSession을 이용한 네트워킹 구현순서</h1>

1. URL 만들기
2. URLSession 구성하기
3. dataTask 만들기
4. 네트워크 요청완료 핸들러 처리하기

<h1 class="ksubject">1️⃣ URL 만들기</h1>

<b class="purple">URL(string:)</b>을 이용해서 String타입의 주소를 URL로 바로 만들어서 사용해도 되지만 String을 하드코딩해서 다루는 것은 단점이 많습니다. <b class="brown">REST API</b>의 url 설계구조를 감안하면 아래의 이미지의 구조로 나눠서 관리하는 것이 더 좋습니다.
<img src="/assets/img/swift/urlsession/1.png" width="100%">
<b class="blue">URLComponents</b>를 이용하면 좀 더 명확하게 관리를 해줄 수 있습니다.

```swift
struct NetworkAPI {
    static let schema = "https"
    static let host = "api.unsplash.com"
    static let path = "/photos"

    func getRandomImageAPI(page: Int) -> URLComponents {

        var components = URLComponents()
        components.scheme = NetworkAPI.schema
        components.host = NetworkAPI.host
        components.path = NetworkAPI.path

        components.queryItems = [
            URLQueryItem(name: "client_id", value: "xxxxxxxxx"),
            URLQueryItem(name: "count", value: "15"),
            URLQueryItem(name: "page", value: String(page))
        ]
        return components
    }
}
```

<b class="blue">URLComponents</b>의 <b class="purple">.url</b>요소에 접근하여 조립된 <b class="purple">URL</b>값을 **옵셔널형태**로 얻을 수 있습니다.

```swift
let url = api.getRandomImageAPI(page: page).url
```

<h1 class="ksubject">2️⃣ URLSession 구성하기</h1>
<b class="purple">URLSession</b>은 싱글톤(shared)으로 만들어 줄 수 있는데, 사용자 정의는 할 수 없기 때문에 간단한 기본 요청에 대한 처리로 사용하면 될 것 같습니다.<br />

```swift
URLSeeion.shared
```

다른 방법으로 직접 <b class="blue">URLSessionConfiguration</b>을 설정해서 만들어줄 수 있습니다.

1. <b class="purple">.default</b>: 싱글턴(share)과 비슷하게 작동하지만 delegate를 이용하여 데이터를 점진적으로 얻을 수 있습니다.
2. <b class="purple">.ephemeral</b>: 캐시, 쿠키 또는 자격증명을 디스크에 저장하지않을때 사용하는 임시세션입니다.
3. <b class="purple">.background(withIdentifier:)</b>: 앱이 실행되지 않는 동안 백그라운드에서 콘테츠를 업로드 및 다운로드작업을 수행할 수 있습니다.

이번 포스트에서는 기본세션인 <b class="purple">.default</b>를 이용해서 세션을 만들어 줬습니다.

```swift
class URLSessionManager {
    static let shared = URLSessionManager()
    private let session = URLSession(configuration: .default)
    private let api = NetworkAPI()

    private init() { }
	/* 코드 생략 */
}
```

<h1 class="ksubject">3️⃣ Task 만들기</h1>

위에서 만들어준 URLSession을 이용해서 <b class="purple">Task</b>를 만들 수 있습니다.

1. <b class="blue">Data Task</b>: NSData 객체를 이용해서 통신합니다. 짧은 대화형 요청을 위한 것입니다.(GET)
2. <b class="blue">Upload Task</b>: Data task와 비슷하지만 파일형태의 데이터도 보내며, 백그라운드 통신도 지원합니다.(POST, PUT)
3. <b class="blue">Download Task</b>: 데이터를 다운로드(파일형태도가능)를 하며, 백그라운드 통신도 지원합니다.
4. <b class="blue">WebSocket Task</b>: RFC 6455에 정의된 WebSocket프로토콜을 사용하여 TCP 및 TLS를 통해 메시지를 교환

이번 포스트에서는 간단한 <b class="purple">JSON타입으로 만들 data</b>이므로 <b class="blue">Data Task</b>를 이용하여 만들어줄 예정입니다.

<h2 class="ksubsubject">&#91;url vs request&#93;</h2>
Task는 URL or URLRequest로 만들어줄 수 있습니다.<br />
<b class="purple">URLRequest</b>를 이용하면 <rd>HttpMethod</rd>와 <rd>Http헤더</rd>를 설정해줄 수 있습니다.<br />
사실 <rd>HttpMethod</rd>의 기본값은 <b class="green">GET</b>으로 세팅되어 있고, 필수적인 <rd>Http헤더</rd>(Content-Length, Authorization, Connection, Host...)는 이미 세팅되어 있습니다.
그렇기 때문에 단순히 <b class="green">GET요청</b>일 경우 <b class="purple">URL</b>로 dataTask를 만들어 사용해도 됩니다.<br />
가끔, <b class="blue">Authorization</b>와 같이 인증키가 <b class="green">GET요청</b>을 할때 필요할 수 있습니다. 이때는 <b class="green">GET요청</b>일때도 URLRequest를 이용해서 dataTask를 만들어 세팅해주면 됩니다.
<b class="green">POST요청</b>의 경우 반드시 URLRequest로 Task를 만들어서 아래 코드와 같은 세팅이 필요합니다.

```swift
var request = URLRequest(url: url)

request.httpMethod = "POST"
request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
request.setValue("application/json", forHTTPHeaderField: "Accept")
```

이번 포스트에서는 따로 헤더를 세팅할 필요가없는 <b class="green">GET요청</b>이기 때문에 아래와 같이 URL을 그대로 사용해서 dataTask를 만들어 줬습니다.

```swift
func getImageInfo(page: Int, completion: @escaping (Result<[ImageInfo], CustomError>) -> ()) {
    guard let url = api.getRandomImageAPI(page: page).url else {
        completion(.failure(CustomError.makeURLError))
        return
    }

    session.dataTask(with: url) { data, response, error in
        ...
    }.resume()
}
```

<h1 class="ksubject">4️⃣ 네트워크 요청완료 핸들러 처리하기</h1>

네트워킹이 끝나면 <b class="blue">completion(핸들러, 비동기)</b>형태로 응답값을 받을 수 있습니다. 읍답값은 다음과 같이 <b class="purple">Data, URLResponse, Error</b>의 옵셔널형태로 구성되어 있습니다.
<img src="/assets/img/swift/urlsession/2.png" width="100%">
다음일때 <rd>실패처리</rd>를 했습니다.<br />

1. error값이 존제할때
2. response의 상태코드값이 200번대가 아닐때
3. data값이 없을때

자세한 에러처리 방법은 <a href="https://kirkim.github.io/swift/2022/08/09/error_handling.html" target="blank">에러핸들링하기 포스트 - kirkim</a>를 참고해주세요.
<b class="blue">data</b>값이 존제하는 것을 최종적으로 확인하게 되면, <b class="blue">JSONDecoder()</b>를 이용해서 원하는 타입으로 디코딩을 해주면 됩니다.

```swift
session.dataTask(with: url) { data, response, error in
    guard error == nil else {
        completion(.failure(.error(error: error)))
        return
    }
    if let httpResponse = response as? HTTPURLResponse,
       !(200...299).contains(httpResponse.statusCode) {
        completion(.failure(.responseError(code:httpResponse.statusCode)))
        return
    }
    guard let data = data else {
        completion(.failure(.noData))
        return
    }
    /* 코드 생략 */
}.resume()
```

<h2 class="ksubsubject">&#91;Decodable 데이터 타입만들기&#93;</h2>
data(Data타입)이 nil값이 아닌 것 까지 확인하면 원하는 타입으로 디코딩(decoding)하는 과정이 필요합니다.
<b class="blue">Decodable</b>을 준수하면 디코딩이 가능한 타입이 됩니다.

- <b class="blue">Decodable</b>: 디코딩가능한 타입
- <b class="blue">Encodable</b>: 인코딩가능한 타입
- <b class="blue">Codable</b>: Decodable + Encodable

아래의 코드는 이번에 사용한 데이터 타입니다. 필요한 요소만 선택해서 구성할 수 있으며 **다계층구조**로도 구현할 수 있습니다.<br />
<b><rd>단, JSON타입의 key값과 데이터타입은 올바르게 적어야 합니다.</rd></b><br />
만약 원하는 변수명으로 사용하고 싶다면 <b class="green">CodingKey프로토콜</b> 을 이용하면 됩니다.이떄, enum 타입명도 반드시 CodingKeys로 만들어 줘야 합니다.

```swift
struct ImageInfo: Decodable {
    var updatedAt: String
    var imageURL: ImageURL
    var author: Author
    var likes: Int
    var width: Int
    var height: Int

    private enum CodingKeys: String, CodingKey {
        case updatedAt = "updated_at"
        case imageURL = "urls"
        case author = "user"
        case likes, width, height
    }
}
```

이제 다음과 같이 <b class="blue">JSONDecoder()</b>를 이용해여 디코딩을 해주면 됩니다. 실패시 <rd>Error를 throw</rd>하므로 try-catch문으로 만들어줍니다.

```swift
do {
    let hasData = try JSONDecoder().decode([ImageInfo].self, from: data)
    completion(.success(hasData))
} catch let error as NSError {
    completion(.failure(.decodingError(error: error)))
}
```

<h1 class="ksubject">5️⃣ NetworkManager 전체코드</h1>

```swift
import Foundation

final class NetworkManager {
    static let shared = NetworkManager()
    private init() { }

    private let api = NetworkAPI()
    private let session = URLSession(configuration: .default)

    func getImageInfo(page: Int, completion: @escaping (Result<[ImageInfo], CustomError>) -> ()) {
        guard let url = api.getRandomImageAPI(page: page).url else {
            completion(.failure(CustomError.makeURLError))
            return
        }

        session.dataTask(with: url) { data, response, error in
            guard error == nil else {
                completion(.failure(.error(error: error)))
                return
            }
            if let httpResponse = response as? HTTPURLResponse,
               !(200...299).contains(httpResponse.statusCode) {
                completion(.failure(.responseError(code:httpResponse.statusCode)))
                return
            }
            guard let data = data else {
                completion(.failure(.noData))
                return
            }
            do {
                let hasData = try JSONDecoder().decode([ImageInfo].self, from: data)
                completion(.success(hasData))
            } catch let error as NSError {
                completion(.failure(.decodingError(error: error)))
            }
        }.resume()
    }
}
```
