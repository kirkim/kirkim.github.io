---
layout: post
title: '[Swift] Operation, OperationQueue'
subtitle: ''
date: 2024-08-18 02:45:51 +0900
categories: ios
tags: swift
comments: truebun
---

<h2 style="color:#0e435c;">Operation, OperationQueue 간단 정의 및 쓰임</h2>
<h3 style="color:#0e435c;">OperationQueue</h3>
여러 <b>Operation</b>채택 개체를 큐에 넣어 관리하는 클래스 입니다.

* 작업을 병렬 또는 직렬로 실행 가능
* 큐에 추가된 작업의 우선순위 결정
* 작업을 취소
* 작업 최대 동시 작업 갯수를 제한할 수 있음

<h3 style="color:#0e435c;">Operation</h3>
단일 Task를 정의하고 관리하는 추상 클래스

* 단일 Task로직을 모듈화하여, 관리할 수 있음

<h4 align="middle">간단한 로직이라면, 굳이 모듈화할 필요없이, 아래와 같이 코드블럭내에 직접 선언하여 사용</h4>
```swift
let queue = OperationQueue()
...
queue.addOperation {
    // 작업            
}
```

---

<h2 style="color:#0e435c;">async-await, Task, TaskGroup사용하면 되지 않나?</h2>

Operation, OperationQueue는 iOS2.0부터 지원된 문법이며, async-await는 비교적(?) 최근에 사용되기 시작한 문법입니다.<br>
대부분의 경우 비동기작업을 처리할 때, async-await 및 Task, TaskGroup을 사용합니다.<br>
<br>
하지만 <b class="green">저의 경우 다음 상황에서 Operation/OperationQueue를 사용</b>하고 있습니다.

<h3 style="color:#0e435c;">[1]최대 작업 갯수 제한이 필요한 경우</h3>

물론 TaskGroup이나 DispatchSemaphore을 이용하면, 최대 작업 갯수를 제한하여 병렬로 비동기작업으로 하도록 만들 수 있습니다.<br>
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
async-await 미지원하는 기능이라도 메서드 자체를 async메서드로 만들면 되지 않나 생각할 수 있지만,<br>
<b>비동기기능이 지원되지 않은 기능을 억지로 async메서드로 랩핑하여 사용시, 예상치 못한 에러가 발생</b>할 수 있습니다.<br>
저의 경우 iOS17미만 버전에서 CoreML 추론기능을 사용할 때, <b>동시에 5개 이상의 작업을 동시에 진핼할시 크러쉬 나는 현상</b>이 발생했습니다.
<span style="font-size:90%">(iOS17 버전 부터 추론메서드의 async-await 기능 지원)</span><br>
이 경우에는 테스트를 통해 디바이스의 동시에 진행할 수 있는 테스크의 수를 파악한 후, OperationQueue를 이용해 최대 작업 갯수를 제한하여 처리하였습니다.<br>

---

<h2 style="color:#0e435c;">Operation, OperationQueue 사용 예시</h2>

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

<h2 style="color:#0e435c;">참고 링크</h2>

<a href="https://developer.apple.com/documentation/foundation/operation">Operation | Apple Developer Documentation</a><br>
<a href="https://developer.apple.com/documentation/foundation/operationqueue">OperationQueue | Apple Developer Documentation</a><br>