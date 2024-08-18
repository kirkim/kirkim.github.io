---
layout: post
title: '[Swift] Operation과 OperationQueue를 사용했던 이유'
subtitle: ''
date: 2024-08-18 02:45:51 +0900
categories: ios
tags: swift
comments: truebun
---

Swift에는 Concurrency관련 문법이 여럿 있는데, 그 중에서 OperationQueue에 대해 최근 사용한 경험이 있어, 내용을 정리하게 되었습니다.<br>

<h2 style="color:#0e435c;">Operation, OperationQueue 간단 정의 및 쓰임</h2>
<h3 style="color:#0e435c;">OperationQueue</h3>
<b>Operation</b> 객체들을 관리하여, 병렬 또는 직렬로 작업을 실행할 수 있게 하는 클래스입니다.

* 작업을 병렬 또는 직렬로 실행할 수 있음
* 큐에 추가된 작업의 우선순위 결정
* 작업을 취소
* 작업 최대 동시 작업 갯수를 제한할 수 있음

<h3 style="color:#0e435c;">Operation</h3>
단일 Task를 정의하고 관리하는 추상 클래스

* 단일 Task의 로직을 모듈화하여, 관리할 수 있음

<h4 align="middle">간단한 로직이라면, 굳이 모듈화할 필요없이, 아래와 같이 코드블럭내에 직접 선언하여 사용</h4>
```swift
let queue = OperationQueue()
...
queue.addOperation {
    // 작업            
}
```

---

<h2 style="color:#0e435c;">굳이 OperationQueue를? async-await, Task, TaskGroup사용하면 되지 않나?</h2>

Operation과 OperationQueue는 iOS 2.0부터 지원된 기능이며, async-await는 비교적(?) 최근에 도입된 문법입니다. 대부분의 경우 비동기작업을 처리할 때, async-await 및 Task, TaskGroup을 사용합니다. 때문에 굳이 OperationQueue를 사용할 필요가 있을까 생각이 듭니다.<br>
<br>
하지만 <b class="green">저의 경우 다음 상황에서 Operation/OperationQueue를 사용</b>한 경험이 있습니다.

<h3 style="color:#0e435c;">[1]최대 작업 갯수 제한이 필요한 경우</h3>

물론 TaskGroup이나 DispatchSemaphore를 사용하여 최대 작업 수를 제한하고, 병렬로 비동기 작업을 처리할 수 있습니다.<br>
하지만 아래의 예시 코드와 같이 로직을 직접 구현해야 합니다.

```swift
// TaskGroup 이용
await withTaskGroup(of: Void.self) { taskGroup in
    var activeTasks = 0

    for task in tasks {
        if activeTasks >= maxConcurrentTasks {
            await taskGroup.next() // 하나의 작업이 완료되기를 기다림
            activeTasks -= 1
        }

        taskGroup.addTask {
            await task()
        }
        activeTasks += 1
    }
        
    // 다른 작업 끝날 때까지 기다림
    while activeTasks > 0 {
        await taskGroup.next()
        activeTasks -= 1
    }
}

// Semaphore 이용
let semaphore = DispatchSemaphore(value: maxConcurrentTasks) // 최대 작업 갯수 지정
...
semaphore.wait() // 다른 작업 끝날 때까지 기다림
task()
semaphore.signal()
```

반면, OperationQueue를 이용하면 간단하게 최대 작업 갯수를 지정할 수 있습니다.

```swift
// OperationQueue 이용
let operationQueue = OperationQueue()
...
operationQueue.maxConcurrentOperationCount = maxConcurrentTasks // 최대 작업 갯수 지정
```

DispatchSemaphore 방식도 비교적 간단해 보이지만, 작업 취소나 순서관리와 같이 복잡한 작업 흐름을 처리하기에는 `OperationQueue`방식이 더 쉬울 것 같습니다.

<h3 style="color:#0e435c;">[2] async-await 미지원 기능일 경우</h3>
async-await를 지원하지 않는 기능이라도 메서드를 async 메서드로 랩핑하여 사용할 수 있지만, 이 경우 <rd>예상치 못한 에러가 발생</rd>할 수 있습니다.<br>
저의 경우 iOS17미만 버전에서 CoreML 추론기능을 사용할 때, <b>동시에 5개 이상의 작업을 동시에 진핼할시 크러쉬 나는 현상</b>이 발생했습니다.
<span style="font-size:90%">(iOS17 버전 부터 추론메서드의 async-await 기능 지원)</span><br>
이 경우에는 테스트를 통해 디바이스의 동시에 진행할 수 있는 테스크의 수를 파악한 후, OperationQueue를 이용해 최대 작업 갯수를 제한하여 처리하였습니다.<br>

<h3 style="color:#0e435c;">[3] 특정 작업 취소 로직을 구현하기가 간편</h3>
Operation 객체로 모듈화가 되어 있다보니, <b class="purple">id: UUID</b>과 같은 Hashable한 변수만을 이용해서 특정 작업을 취소할 수 있습니다.<br>
TaskGroup에서도 특정 작업을 취소시키게 할 수 있지만, OperationQueue보다 로직이 복잡 했습니다. <span style="font-size:90%">(Task전체를 딕셔너리형태로 보관하여 취소 작업을 컨트롤하도록 로직을 짜야됨, 아직 TaskGroup관련 문법을 잘 몰라서 일 수도 있음...)</span>

---

<h2 style="color:#0e435c;">Operation, OperationQueue 사용 예시</h2>

다음은 OperationQueue 사용의 간단한 예시입니다.<br>

```swift
// Operation 채택 클래스
final class CalculateCountOperation: Operation {
    let id: UUID
    var result: Int?
    private let image: UIImage
    
    init(id: UUID, image: UIImage) {
        self.id = id
        self.image = image
    }
    
    override func main() {
        guard !isCancelled, // 취소됐는지 확인
              let cgImage = image.cgImage,
              let calculatedCount = calculateCount(from: cgImage)
        else { return }
        
        result = calculatedCount
    }
    
}

// OperationQueue
let operationQueue = OperationQueue()
...
operationQueue.maxConcurrentOperationCount = 3

// 작업 추가
func add operation(id: id, image: CGImage) {}
    let operation = CalculateCountOperation(id: id, image: image)
            
    operation.completionBlock = {
        if let result = operation.result {
            print("결과: ", result)
        } else {
            print("작업 실패 id: ", id)
        }
    }
            
    operationQueue.addOperation(operation)
}

// 작업 취소
func cancelOperation(by id: UUID) {
    for operation in operationQueue.operations {
        if let detectFaceOperation = operation as? CalculateCountOperation,
           detectFaceOperation.id == id {
            detectFaceOperation.cancel()
        }
    }
}

// 작업 전체 취소
func cancelAllOperation() {
    operationQueue.cancelAllOperations()
}
```

---

<h2 style="color:#0e435c;">그래서 OperationQueue vs TaskGroup ?</h2>
OperationQueue는 iOS 2.0부터 지원되는 오랜 역사를 가진 기능으로, 안정성과 신뢰성이 높습니다.<br>
<br>
반면, TaskGroup은 최신 비동기 프로그래밍 모델인 async/await과 함께 발전하고 있으며, 계속해서 기능 개선과 업데이트가 이루어지고 있습니다. 이러한 발전 덕분에 언젠가는 OperationQueue를 완전히 대체할 수 있지 않을까 생각합니다.<br>
<br>
하지만 현재로서는 앱의 iOS 지원 버전 혹은 Swift버전에 따라 TaskGroup을 사용하는게 비효율적일 수 있습니다. 따라서, 앱이 지원하는 iOS 버전과 프로젝트의 요구 사항에 따라 적절한 도구를 선택하는 것이 중요하다고 생각합니다.<br>
<br>
<b>결론적으로, 비동기 작업을 처리할 때 어떤 기능을 사용하든 각 기능의 본질을 이해하고, 상황에 맞게 적절히 선택하여 사용하는 것이 좋다고 생각합니다.</b>

---

<h2 style="color:#0e435c;">참고 링크</h2>

<a href="https://developer.apple.com/documentation/foundation/operation">Operation | Apple Developer Documentation</a><br>
<a href="https://developer.apple.com/documentation/foundation/operationqueue">OperationQueue | Apple Developer Documentation</a><br>