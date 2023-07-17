---
layout: post
title: '[Rxswift] RxCocoa를 이용해서 textfield 글자수 제한하기'
subtitle: ''
date: 2022-03-30 02:45:51 +0900
categories: ios
tags: swift
comments: true
---

<h1>1️⃣ 목표</h1>

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<span>
			<ol>
				<li><code>delegate</code>대신에 <code>RxCocoa</code>를 이용해 <b class="purple">UITextfield</b>의 글자수를 제한하는 기능을 만들고 최종적으로 <rd>MVVM패턴</rd>을 적용해볼 예정입니다.</li>
				<li> <code>RxCocoa</code>에 대해선 다음 블로그글을 참고하면 좋을 것 같습니다.<br> 👉🏻👉🏻 <a href="https://jusung.github.io/RxSwift-Section12/" target="blank">토미의 개발노트</a></li>
			</ol>
		</span>
	</div>
    <div class="explain-right">
        <img src="/assets/img/swift/limit_textfield/result.gif" width="100%" style="max-width:200px" alt="finished version">
    </div>
</div>

<h1 class="ksubject">2️⃣ 구현</h1>

- 아래의 코드를 사용하면 간단하게 글자수를 제한할 수 있습니다.

```swift
func limitNumberOfText(maxNumber: Int) {
  textField.rx.text.orEmpty
    .map { $0.count <= maxNumber }
    .observe(on: MainScheduler.instance)
    .subscribe(onNext: { [weak self] isEditable in
      if !isEditable {
        self?.textField.text = String(self?.textField.text?.dropLast() ?? "")
      }
    })
    .disposed(by: disposeBag)
}
```

<h2 class="ksubsubject">간단 코드 설명</h2>

- <b class="blue">.orEmpty</b>: <b class="purple">String?</b>옵셔널 타입을 <b class="purple">String</b>으로 바꿔주는 역할도 해서 사용하는 것이 좋을 것 같습니다.
- `.map { $0.count <= maxNumber }` 는 다음을 축약한 형태입니다.

  ```swift
  .map({ string -> Bool in
    if (string.count <= maxNumber) {
    	return true
    }
    return false
  })
  ```

- <b>subscribe의 onNext이벤트</b> <b class="blue">클로저</b>안에서 <b class="org">[weak self]</b>를 해준 이유는 <rd>reference count</rd>를 증가시키지 않게 하여 메모리릭(memory leak)이 발생하지 않게 하기 위함입니다.
- <b class="blue">.dropLast()</b>를 이용해서 String의 마지막글자를 잘라줍니다.
  <img src="/assets/img/swift/limit_textfield/1.png" width="100%" style="max-width:500px;" alt="document of .dropLast()">
  <b class="purple">SubString</b>타입으로 반환하기 때문에 <b class="purple">String()</b>으로 감싸서 형변환을 시켜서 사용합니다.<br>👉🏻👉🏻 <a href="https://developer.apple.com/documentation/swift/substring">SubString - Apple documentation</a>

<h1 class="ksubject">3️⃣ Signal 사용</h1>

- 위의 작업들은 기본적으로 <rd>UI</rd>를 변경하는 이벤트들입니다. 그러기 때문에 애플 정책상 <b class="purple">Main쓰레드</b>에서 처리하도록 만들어야 합니다. 그래서 위의 코드에서 다음과 같은 코드를 사용한 것입니다.

```swift
.observe(on: MainScheduler.instance)
```

- 여기서 <b class="purple">.instance</b> 대신에 <b class="purple">asyncInstance</b>을 사용하면 <rd>비동기</rd>적으로 처리할 수 있습니다.
  하지만 메인쓰레드에서 동시에 이벤트가 발생하더라도 순차적으로 처리해도 상관없다고 생각했기 때문에 굳이 사용하지 않았습니다.
- <b class="purple">Observable</b>은 에러를 이벤트도 방출해줍니다. 하지만 UI적인 입장에서 봤을땐 <rd>에러</rd>시에도 프로그램이 종료되지않는 것이 좋습니다. 그렇기 때문에 <b class="blue">RxCocoa</b>에서는 subject와 observable을 랩핑한 타입인 <b class="purple">Relay, Signal, Driver</b>를 제공해줍니다.<br>
  간단하게 다음과 같다고 생각하면 됩니다.

  - <b class="blue">PublishRelay</b> 는 <b class="green">error없는 PublishSubject</b>
  - <b class="blue">BehaviorRelay</b> 는 <b class="green">error없는 BehaviorSubject</b>
  - <b class="blue">Driver</b>는 <b class="green">error없는 Behavior같은 Observable</b>
  - <b class="blue">Signal</b>는 <b class="green">error없는 publishr같은 Observable</b>

- 또한 이 타입들은 <b class="green">Main쓰레드</b>에서 처리하도록 보장해줍니다. 즉 `.observe(on: MainScheduler.instance)`와 같은 코드를 사용하여 스케줄을 관리해줄 필요가 없어집니다.

- <b class="purple">Signal</b>을 이용하여 코드를 다시 작성하면 다음과 같습니다.

```swift
textField.rx.text.orEmpty
  .map { $0.count <= maxNumber }
  .asSignal(onErrorJustReturn: false)
  .emit(onNext: { [weak self] isEditable in
    if !isEditable {
      self?.textField.text = String(self?.textField.text?.dropLast() ?? "")
    }
  })
  .disposed(by: disposeBag)
```

<h1 class="ksubject">4️⃣ 스트림재사용 (.share())</h1>

- 이제 현재 글자수를 감지하는 <b class="purple">옵저버</b>도 만들어 주겠습니다.

```swift
func limitNumberOfText(maxNumber: Int) {
  textField.rx.text.orEmpty
    .map { $0.count }
    .asSignal(onErrorJustReturn: 0)
    .emit { [weak self] nb in
      let currentNumber = nb > maxNumber ? nb - 1 : nb
      self?.limitNumberLabel.text = "글자수: \(currentNumber) 최대글자수: \(maxNumber)"
    }
    .disposed(by: disposeBag)

  textField.rx.text.orEmpty
    .map { $0.count <= maxNumber }
    .asSignal(onErrorJustReturn: false)
    .emit(onNext: { [weak self] isEditable in
      if !isEditable {
        self?.textField.text = String(self?.textField.text?.dropLast() ?? "")
      }
    })
    .disposed(by: disposeBag)
}
```

- 하지만 위의 코드에서 다음의 코드를 재사용 합니다.

  ```swift
  textField.rx.rext.orEmpty
  ```

  이런식으로 사용하는 것은 또하나의 스트림을 할당하게 되어 <rd>메모리 낭비</rd>가 됩니다.

- 다행히 <b class="green">.share()</b>를 사용하면 스트림을 재사용할 수 있습니다.

```swift
func limitNumberOfText(maxNumber: Int) {
  let textObservable = textField.rx.text.orEmpty.share()

  textObservable
    .map { $0.count }
    .asSignal(onErrorJustReturn: 0)
    .emit { [weak self] nb in
      /* 코드 생략 */
    }
    .disposed(by: disposeBag)

  textObservable
    .map { $0.count <= maxNumber }
    .asSignal(onErrorJustReturn: false)
    .emit(onNext: { [weak self] isEditable in
      /* 코드 생략 */
    })
    .disposed(by: disposeBag)
}
```

<h1  class="ksubject">5️⃣ MVVM패턴 적용하기</h1>

- 코드간결화를 위해 `ViewController` 나 `View` 에서는 왠만하면 <b class="purple">UI</b>적인 부분만 처리하는 것이 좋습니다.
- 그래서 <b class="purple">UI</b>에 필요한 데이터 처리부분은 <rd>ViewModel</rd>를 만들어서 처리하도록 했습니다.

<h3 align="middle" class="ksubsubject">&lt; SampleViewModel &gt;</h3>

```swift
struct SampleViewModel {
  //View -> ViewModel
  let textObservable = BehaviorRelay<String>(value: "")

  //ViewModel -> View
  let currentLength: Signal<String>
  let isEditable: Signal<Bool>

  init(maxNumber: Int) {
    let textObservable = textObservable.share()

    currentLength = textObservable
      .map { $0.count }
      .map({ nb in
        let currentNumber = nb > maxNumber ? nb - 1 : nb
        return "글자수: \(currentNumber) 최대글자수: \(maxNumber)"
      })
      .asSignal(onErrorJustReturn: "")

    isEditable = textObservable
      .map { $0.count <= maxNumber }
      .asSignal(onErrorJustReturn: false)
  }
}
```

- <b><rd>ViewModel</rd></b>를 만들어줌에 따라 기존 ViewController에서는 데이터를 처리할 필요없이 <rd>ViewModel</rd>의 옵저버들만 구독하여 데이터를 얻어올 수 있습니다.
- 코드의 길이가 짧기때문에 <b class="purple">MVVM패턴</b>을 적용 전후의 차이가 별로 느껴지지 않습니다. 하지만 명확한 업무 분할로 규모가 커질 수록 가독성과 코드수정이 용이해질 것 같습니다.

<h3 align="middle" class="ksubsubject">&lt; SampleVC &gt;</h3>

```swift
class SampleVC: UIViewController {

	/* 코드 생략 */

  func bind(viewModel: SampleViewModel = SampleViewModel(maxNumber: 6)) {
    textField.rx.text.orEmpty
      .bind(to: viewModel.textObservable)
      .disposed(by: disposeBag)

    viewModel.currentLength
      .emit { [weak self] str in
        self?.lengthLabel.text = str
      }
      .disposed(by: disposeBag)

    viewModel.isEditable
      .emit(onNext: { [weak self] isEditable in
        if !isEditable {
          self?.textField.text = String(self?.textField.text?.dropLast() ?? "")
        }
      })
      .disposed(by: disposeBag)
  }
}
```
