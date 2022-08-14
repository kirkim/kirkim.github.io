---
layout: post
title: '[Swift] FileManager 사용해보기'
subtitle: ''
date: 2022-08-14 02:45:51 +0900
categories: swift
tags: etc
comments: true
---

⛔️ FileManager에 대해 개인적으로 공부한 것을 정리한 글입니다. 최대한 올바른 내용만 적기위해 노력하고 있지만 틀린내용이 있을 수 있습니다. 그렇기 때문에 글을 읽으실때 비판적으로 읽어주세요.<br />
틀린내용에 대한 피드백은 메일로 보내주시면 감사하겠습니다🙏🏻

<kline></kline>

<h1>1️⃣ FileManager 인스턴스 생성하기</h1>
FileManager는 다음과 같이 <b class="purple">.default</b>를 이용해 **싱글턴인스턴스** 혹은 **기본인스턴스**로 생성할 수 있습니다.

```swift
let singleton = FileManager.default // 싱글턴
let instance = FileManager() // 기본생성
```

내부구현을 보면 기본생성을 <rd>private</rd>로 막지 않았기 때문에 **기본인스턴스**로 생성이 가능합니다.

<img src="/assets/img/swift/filemanager/1.png" width="100%">

하지만 아래의 Apple문서에서는 shared(싱글턴)을 사용하면 쓰레드안전하게 사용이 가능하다고 말하는데, 다른말로 기본인스턴스생성으로 사용하면 <rd>쓰레드 안전하지 않을 수 있다</rd>라고 들립니다.
굳이 **기본인스턴스생성**을 막지않은 이유는 인스턴스를 생성한 뒤 **delegate**로 기능을 구현할 수 있도록 만든 것 같습니다. 대신에 이경우도 **특별한 인스턴스**로 만들어서 관리하라고 합니다.
<img src="/assets/img/swift/filemanager/2.png" width="100%">
일단은 delegate를 사용하지 않을 것이기 때문에 <b class="purple">싱글턴 인스턴스</b>로 생성할 예정입니다. 그리고 앞으로 구현할 파일의 <b class="purple">CRUD</b>메서드를 담고있는 클래스 또한 싱글턴으로 만들어주는 것이 좋습니다. 그 이유는 <rd>Create 메서드</rd>의 경우 다른타입(ex: Data타입)의 저장 메서드를 이용할 수도 있기 때문입니다.

<h1 class="ksubject">2️⃣ 저장위치 지정해주기</h1>

파일을 관리할 폴더의주소를 지정해줄 수 있습니다. 애플이 지정해준 폴더를 사용하기 위해 <b class="blue">FileManager</b>클래스 내부에 구현된 <b class="purple">.url(for:,in:)</b>메서드를 이용해 폴더의 주소를 URL형태로 얻어오겠습니다.

```swift
let documentPath: URL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
```

첫번째 인자로 <b class="purple">FileManager.SearchPathDirectory</b>를 받아오는데, enum타입으로 <a href="https://developer.apple.com/documentation/foundation/filemanager/searchpathdirectory">(FileManager.SearchPathDirectory - Apple문서)</a>의 Topic 항목을 확인해보면 됩니다.<br />
두번째 인자로 <b class="purple">FileManager.SearchPathDomainMask</b>을 받아오는데, 이것 역시 enum타입으로 user, local, network, system 도메인을 보안상 가려주는(?)마스크 역할을 하는 것 같습니다. <b style="font-size:90%">(이부분은 좀 더 알아봐야할 것 같습니다.)</b>

<b class="blue">FileManager</b>의 내부구현을 살펴보면 <rd>적절한 도메인마스크를 지정</rd>해야 해당 폴더의 주소를 배열형태로 반환해줍니다.

<img src="/assets/img/swift/filemanager/3.png" width="100%">

다음과 같이 **4가지종류의 도메인마스크**를 사용하여 URL을 만들어서 출력해 보았습니다.

```swift
private let useUserMask: URL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
private let useSystemMask: URL = FileManager.default.urls(for: .printerDescriptionDirectory, in: .systemDomainMask)[0]
private let useLocalMask: URL = FileManager.default.urls(for: .developerDirectory, in: .localDomainMask)[0]
private let useNetworkMask: URL = FileManager.default.urls(for: .demoApplicationDirectory, in: .networkDomainMask)[0]
```

<img src="/assets/img/swift/filemanager/4.png" width="100%">

<kline></kline>

<h2 class="ksubsubject">인덱스 0 접근?</h2>

다시 이번에 사용할 URL주소를 확인해보면 배열의 <rd>인덱스 0</rd>을 가져오는데, 왜 그럴까요?

```swift
FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
```

<b class="blue">FileManager</b>의 내부구현을 살펴보면 아래의 두가지 케이스때문에 배열형태로 반환해준다는 것을 확인할 수 있습니다. 아래의 두가지 케이스를 제외하고 나머지 모든 케이스는 성공시 배열에 <b class="blue">URL주소를 1개만</b>넣어 반환 해줍니다.
<img src="/assets/img/swift/filemanager/5.png" width="100%">

<b><rd>도메인마스크</rd></b>를 잘못 지정해주면 <rd>빈배열</rd>을 반환해주기 때문에 위와 같이 인덱스값에 직접접근하는 방식은 위험할 수 있을 것 같습니다.
그래서 아래와 같이 **안전하게 인덱스에 접근**하는 방식으로 주소를 얻어오도록 했습니다.<b style="font-size:90%">( <a href="https://stackoverflow.com/questions/25329186/safe-bounds-checked-array-lookup-in-swift-through-optional-bindings/30593673#30593673">안전하게 배열인덱스 접근하게 만들기 - stackoverflow</a> )</b>

```swift
private let documentPath: URL? =
    FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[safe: 0]
```

<h1 class="ksubject">3️⃣ Create, Read, Delete 메서드 구현하기</h1>
<h2 class="ksubsubject">Create(파일 저장) 메서드 구현하기</h2>

이번 포스트에서는 이미지파일을 저장하는 것을 다룰예정입니다. 결과적으로 다음과 같이 <b class="green">Create메서드</b>를 구현했습니다.<br />
<b class="blue">Data타입</b>클래스에 있는 <b class="purple">.write(to:)</b>메서드를 이용하면 파일을 해당위치에 저장할 수 있습니다.<br />
좀 더 디테일하게 저장하고 싶으면 <a href="https://developer.apple.com/documentation/foundation/nsdata/writingoptions">NSData.WritingOptions</a>옵션이 포함된 <b class="purple">.write(to:options:)</b>메서드를 이용하면 됩니다.

```swift
func saveImage(filename: String, image: UIImage?) -> String? {
    guard let image = image else {
        return nil
    }
    guard let imageData = image.jpegData(compressionQuality: 1) ?? image.pngData() else { return nil }
    do {
        guard let documentPath = documentPath else {
            throw URLError(.badURL)
        }
        try imageData.write(to: documentPath.appendingPathComponent(filename + "png"))
        let locationString = filename + "png"
        return locationString
    } catch {
        print(error)
        return nil
    }
}
```

<b class="purple">UIImage</b>에는 jpeg 혹은 png파일로 변환해주는 메서드가 있는데, 이 메서드들을 이용해서 파일형태로 만든 뒤 저장해주면 됩니다.<br />
<b class="org">jpeg확장자</b>와 <b class="org">png확장자</b>에 대해서는 <a href="https://hello-imawesome.tistory.com/74">이 링크</a>를 읽어보시면될 것 같습니다. 맥에서 실험해본 결과 jpeg와 png파일간은 확장자만을 바꿔서 적어줘도 파일손상과 용량변화없이 변경이 잘 되는 것 같습니다. <br />
단 위의 코드에서도 확인할 수 있듯이 jpeg로 변활할때는 **0.0(퀄리티최소) ~ 1.0(퀄리티최대)**를 지정해서 변환시켜줄 수 있습니다.

```swift
.jpegData(compressionQuality: 1) // 0.0 ~ 1.0
```

<h2 class="ksubsubject">폴더생성하는 방법?</h2>
다음과 같이 <b class="blue">FileManager</b>클래스에 있는 <b class="purple">.createDirectory(atPath,withIntermediateDirectories:attributes:)</b>를 이용해서 폴더를 생성해줄 수도 있습니다. 파라미터를 간단히 살펴보면 다음과 같습니다.

- <b class="blue">atPath</b>: 경로
- <b class="blue">withIntermediateDirectories</b>: true이면 적어준 경로에서 상위경로가 존재하지 않으면 자동으로 디렉토리로 만들어줌
- <b class="blue">attributes</b>:딕셔너리형태로 소유자, 그룹번호, 파일권한, 수정날짜를 설정할 수 있음

```swift
try fileManager.createDirectory(atPath: filePath.path, withIntermediateDirectories: true, attributes: nil)
```

<kline></kline>

<h2 class="ksubsubject">Read(파일 읽기) 메서드 구현하기</h2>
결과적으로 다음과 같이 <b class="green">Read메서드</b>를 구현했습니다.
<b class="purple">UIImage(contentsOfFile:)</b>로 **확장자가 포함된 String경로**를 넣어 이미지를 반환해주도록 했습니다.

```swift
func readImage(named: String) -> UIImage? {
    guard let documentPath = documentPath else {
        return nil
    }
    let result = UIImage(contentsOfFile: URL(fileURLWithPath: documentPath.absoluteString).appendingPathComponent(named).path)
    return result
}
```

주의할점은 <b class="blue">doucumentPath.absoluteString</b>가 String타입인 점을 이용하여 그대로 사용하면 안됩니다.<br />
다음과 같이 <b class="purple">file://</b>가 추가되어 있기 때문에 잘못된 경로를 넘겨주게 됩니다.

```swift
URL(fileURLWithPath: documentPath.absoluteString).appendingPathComponent(named).path // /User/xxx/xxx.png
documentPath.absoluteString + named // file:///User/xxx/xxx.png
```

<kline></kline>

<h2 class="ksubsubject">Delete(파일 삭제) 메서드 구현하기</h2>
결과적으로 다음과 같이 <b class="green">Delete메서드</b>를 구현했습니다.

```swift
func deleteImage(at filename: String) throws {
    do {
        guard let documentPath = documentPath else {
            throw URLError(.badURL)
        }
        let urlString = documentPath.absoluteString + filename
        let url = URL(string: urlString)!
        try fileManager.removeItem(at: url)
    } catch {
        throw DBManagerError.failToRemoveImageFile
    }
}
```

<b class="purple">.removeItem()</b>메서드의 경우 경로의 타입으로 <b class="blue">String, Url</b> 모두 사용이 가능합니다.
하지만 위에서도 언급했듯이 <b class="blue">doucumentPath.absoluteString</b>값을 String경로로써 그대로 사용할 경우 <b class="purple">file://</b>가 앞에 추가될 수 있다는점을 주의해야 합니다.

<h1 class="ksubject">4️⃣ FileManager사용시 주의사항</h1>
<h2 class="ksubsubject">User 도메인마스크 사용시 주의사항</h2>

<b class="green">이번 주의사항은 다음의 상황이 (모바일에서 앱을 업데이트 = 시뮬레이터 재시작)하는 것과 같이 동작한다면 위험할 수도 있는 부분입니다.</b><br />
4가지 도메인마스크를 사용하여 주소에 접근하여 사용할 수 있습니다. 그중에서 시뮬레이터를 재시작할때마다 <b><rd>user도메인마스크를 이용한 주소는 계속 바꼈습니다.</rd></b>
먼저 다음과 같이 user도메인마스크를 이용한 예시를 만들어 출력해보도록 하겠습니다.

```swift
let documentPath: URL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
let documentPath2: URL = FileManager.default.urls(for: .preferencePanesDirectory, in: .userDomainMask)[0]
let documentPath3: URL = FileManager.default.urls(for: .desktopDirectory, in: .userDomainMask)[0]
let documentPath4: URL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
```

아래이미지의 <b class="green">녹색부분</b>이 시뮬레이터를 재실행할때마다 변경되었습니다. <b style="font-size:90%">(백그라운드나 종료할때는 그대로)</b>

<div class="explain-cover">
    <div class="explain-left">
		<h4 align="center">기존 주소</h4>
		<img src="/assets/img/swift/filemanager/6.png" width="100%">
	</div>
    <div class="explain-right">
		<h4 align="center">시뮬레이터 재시작 후</h4>
        <img src="/assets/img/swift/filemanager/7.png" width="100%">
    </div>
</div>

다행히 **폴더가 삭제된 뒤 새로 만들어지는 것이 아닌** <rd>폴더의 이름만 바뀌는 것</rd>입니다. 그렇기 때문에 내부의 파일들은 그대로 남아있으며 그대로 사용할 수 있습니다.<br />

```swift
let documentPath: URL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]

func ...() {
    let urlString = documentPath.absoluteString + filename

    savePathToCoreData(path: documentPath.absoluteString + filename) // ❌
    savePathToCoreData(path: filename) // ✅
}
```

결론적으로 주의할점은 파일의 이름, 경로등등.. 데이터를 **CoreData**형태로 저장할 때 "<rd>경로</rd>는 <rd>절대경로</rd>가 아닌 <rd>도메인경로를 제외한 경로</rd>만을 저장"하여 사용하는 것이 좋습니다.
물론 앱을 단순히 종료하거나 백그라운드상태에 있을때는 폴더명이 바뀌지 않습니다. 하지만 <rd>모바일앱을 업데이트했을때 시뮬레이터를 재시작했을때와 같이 동작한다면 문제가 될 수 있습니다.</rd> <b style="font-size:90%">(솔직히 이부분은 직접 앱을 출시해서 확인해보는게 좋을 것 같지만, 조심해서 나쁠 것이 없다고 생각합니다.)</b>
