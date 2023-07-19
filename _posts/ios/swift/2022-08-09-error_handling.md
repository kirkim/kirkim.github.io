---
layout: post
title: '[Swift] 에러 핸들링하기'
subtitle: ''
date: 2022-08-09 20:45:51 +0900
categories: ios
tags: swift
comments: true
---

⛔️ 에러 핸들링에 대해 개인적으로 공부한 것을 정리한 글입니다. 최대한 올바른 내용만 적기위해 노력하고 있지만 틀린내용이 있을 수 있습니다. 그렇기 때문에 글을 읽으실때 비판적으로 읽어주세요.<br />
틀린내용에 대한 피드백은 메일로 보내주시면 감사하겠습니다🙏🏻

<h1>1️⃣ Boolean이용하기</h1>

에러를 핸들링하는 방법은 여러가지방법이 있습니다. 그중에서 가장 단순하게 만들 수 있는 방법은 <b class="purple">Boolean타입</b>을 반환하도록 만드는 것 입니다.

```swift
func doNotGiveMeAnAppleOrOrange(fruit: String) -> Bool {
    switch fruit {
    case "apple","사과":
        return false
    case "orange", "귤", "오렌지":
        return false
    default:
        break
    }
    return true
}
```

하지만 다음과 같은 단점이 있습니다.

1. 성공했을때 <b class="purple">true</b>만을 반환하기 때문에 다른 반환값을 반환하기가 애매해집니다.
2. 에러가 일어났을때 **원인**을 알기가 힘들다. (위의 예시의 경우 사과, 오렌지 모두 똑같이 false를 반환합니다)

<h1 class="ksubject">2️⃣ throws 이용하기</h1>
<b class="purple">Boolean타입</b>대신에 <rd>throws</rd>를 이용하여 구현해 보겠습니다.
<b><rd>throws</rd></b>를 이용하면 실패했을때 에러처리를 하면서도 성공했을때는 원하는 반환값을 반환하도록 만들 수 있습니다.<br />
먼저, throws 로 넘겨줄 에러는 <rd>Error</rd>프로토콜을 준수해야 합니다.
다음과 같이 enum타입으로 **Error**프로토콜을 준수하는 **CustomError**를 만들었습니다.

```swift
enum CustomError: Error {
    case appleError
    case orangeError
	var description:String {
        switch self {
        case .appleError:
            return "error: 사과를 주지마세요!"
        case .orangeError:
            return "error: 오렌지를 주지마세요!"
        }
    }
}
```

실패했을 경우 위의 CustomError를 throws하도록 메서드를 구현해줬습니다.
성공할경우 별도의 반환값을 넘겨줄 수 있습니다.

```swift
func doNotGiveMeAnAppleOrOrange(fruit: String) throws -> String {
    switch fruit {
    case "apple","사과":
        throw CustomError.appleError
    case "orange", "귤", "오렌지":
        throw CustomError.orangeError
    default:
        break
    }
    return "\(fruit)를 줘서 고마워"
}
```

<b><rd>throws</rd></b>로 에러를 던져주는 메서드를 호출할 때는 <rd>try-catch</rd>문을 이용하면 됩니다. swift언어에서는 다음과 같이 do문 안에서 try로 메서드를 호출하고, catch문으로 에러를 캐치하게 됩니다.

```swift
do {
    let answer = try doNotGiveMeAnAppleOrOrange(fruit: "apple")
    print(answer)
} catch let error {
    guard let error = error as? CustomError2 else {
        print(error)
        return
    }
    print(error.description)
}
```

<img src="/assets/img/swift/error_handling/error_handling2.gif" width="100%" style="max-width:400px">

<h1 class="ksubject">3️⃣ Result 이용하기</h1>

다음과 같이 비동기로 처리되는 네트워크요청의 경우 <rd>throw로 처리하기 애매합니다.</rd>
<img src="/assets/img/swift/error_handling/1.png" width="100%">

그렇다고 아래와 같이 클로져에 <rd>nil</rd>값을 주는 방식으로 처리하는 방법은 위에서 <rd>어떤 에러인지 파악하기가 힘들어 집니다.</rd>

```swift
func loadImage(urlString: String, completion: @escaping (UIImage?) -> ()) {
   guard let url = URL(string: urlString) else {
       completion(nil)
       return
   }
   session.dataTask(with: url) { data, response, error in
       guard error == nil else {
           completion(nil)
           return
       }
       guard let httpResponse = response as? HTTPURLResponse,
             (200..<300).contains(httpResponse.statusCode) else {
           completion(nil)
           return
       }
       guard let hasData = data,
             let image = UIImage(data: hasData) else {
           completion(nil)
           return
       }
       completion(image)
   }.resume()
}
```

다음과 같이 <b class="green">Result타입</b>을 이용하면 비동기처리 메서드에서도 에러핸들링을 손쉽게 할 수 있습니다.

```swift
func loadImage(urlString: String, completion: @escaping (Result<UIImage, CustomError>) -> ()) {
    guard let url = URL(string: urlString) else {
        completion(.failure(.badURL))
        return
    }
    session.dataTask(with: url) { data, response, error in
        guard error == nil else {
            completion(.failure(.urlSessionError))
            return
        }
        guard let httpResponse = response as? HTTPURLResponse else {
            completion(.failure(.responseError))
            return
        }
        guard (200..<300).contains(httpResponse.statusCode) else {
            completion(.failure(.responseCodeError(code: httpResponse.statusCode)))
            return
        }
        guard let hasData = data,
              let image = UIImage(data: hasData) else {
            completion(.failure(.noImageData))
            return
        }
        completion(.success(image))
    }.resume()
}
```

Result타입을 반환하는 메서드는 사용할때 <b class="purple">성공과 실패</b>를 명확하게 할 수 있습니다.

```swift
// 방법1
enum CustomError: Error {
    case badURL
    case urlSessionError
    case responseError
    case responseCodeError(code: Int)
    case noImageData
}

NetworkManager.shared.loadImage(urlString: url) { result in
    switch result {
    case .success(_):
        print("성공")
    case .failure(let error):
        switch error {
        case .noImageData:
            print("noImageData!")
        case .responseError:
            print("responseError!")
        case .urlSessionError:
            print("urlSessionError!")
        case .badURL:
            print("badURL!")
        case .responseCodeError(code: let code):
            print("responseCodeError code: \(code)")
        }
    }
}

// 방법2
enum CustomError: Error {
    case badURL
    case urlSessionError
    case responseError
    case responseCodeError(code: Int)
    case noImageData

    var description:String {
        switch self {
        case .badURL:
            return "잘못된 URL주소입니다."
        case .urlSessionError:
            return "URLSession 에러입니다."
        case .responseError:
            return "리스폰스에러입니다."
        case .responseCodeError(code: let code):
            return "리스폰스코드에러 응답코드:\(code)"
        case .noImageData:
            return "이미지데이터를 받는데 실패했습니다."
        }
    }
}

NetworkManager.shared.loadImage(urlString: url) { result in
    switch result {
    case .success(_):
        print("성공")
    case .failure(let error):
        print(error.description)
    }
}
```

<img src="/assets/img/swift/error_handling/error_handling1.gif" width="100%" style="max-width:400px">
