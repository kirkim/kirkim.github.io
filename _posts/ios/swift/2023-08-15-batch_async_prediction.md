---
layout: post
title: '[Swift, MLModel] Sync & Batch & Async Prediction API'
subtitle: ''
date: 2023-08-15 02:45:51 +0900
categories: ios
tags: swift
comments: true
---

이번 포스트에서는 Sync, Batch Prediction API와 함께, 이번 iOS17에서 CoreML 프레임워크 API로 새롭게 나온 Async prediction API에 대해 알아볼 예정입니다.<br>
이번 포스트는 <a href="https://developer.apple.com/videos/play/wwdc2023/10049/">Improve Core ML integration with async prediction | WWDC2023</a>영상을 기반으로 작성되었습니다.

<h2 style="color:#0e435c;">기존 Prediction API의 한계 (iOS16 이하)</h2>
아래 이미지는 특정 모델(MLModel)의 변환 메서드(전처리 + prediction + 후처리)를 비동기적으로 실행했을 때 모습입니다.<br>
(좀 더 명확히 보기 위해, prediction, 후처리 부분을 각각 분리하여 병렬처리했습니다. 사실 prediction부분이 병렬처리 됐음에도 직렬처리됐음에 주목하면 됩니다.)

이 처럼 병렬로 Prediction메서드를 호출하여도 내부적으로 동기로 실행됩니다.<br>

<h4 align="middle">DeepLabV3에 내장된 Batch Prediction 메서드</h4>
<img src="/assets/img/swift/batch_async_prediction/1.png" width="100%">

<h2 style="color:#0e435c;">Batch Prediction API</h2>

위에서 살펴봤듯이 병렬처리를 이용하더라도 Prediction부분에서 여전히 동기적으로 처리되어 **병목현상**이 발생합니다.<br>
이를 해결하기 위해 고려해볼 수 있는 방법은 Batch Prediction 메서드를 이용하는 방법입니다.<br>
Batch Prediction이란, 말그대로 한모델에 대해서 여러 입력값(Input)을 한번에 일괄(batch)처리하여 효율을 높히는 추론방법입니다.<br>
이러한 Batch Prediction 메서드를 CoreML프레임워크에서 MLModel에 자동으로 만들어서 제공해줍니다.

<h4 align="middle">CoreML프레임워크가 만들어준 DeepLabV3 Batch Prediction 메서드</h4>
<img src="/assets/img/swift/batch_async_prediction/2.png" width="90%">

---

<h2 style="color:#0e435c;">단일 Prediction vs Batch Prediction</h2>

WWDC2023영상에서도 prediction 병목현상을 해결할 방법으로 Batch Prediction방법을 추천하고 있습니다.<br>
과연 기대만큼 성능향상을 가져올 수 있는지 테스트를 해보겠습니다. 다음의 조건으로 테스트를 진행하였습니다.<br>

- <b>모델:</b> 커스텀 Animegan모델(made in Anipen corp)
- <b>테스트폰 기종:</b> iphone13 proMax
- <b>Neural Engine 사용</b>
- <b>동시변환 인풋 갯수:</b> 4개

<h3 style="color:#0e435c;">단일 Prediction 테스트</h3>

<img src="/assets/img/swift/batch_async_prediction/3.png" width="100%">

<h3 style="color:#0e435c;">Batch Prediction 테스트</h3>

<img src="/assets/img/swift/batch_async_prediction/4.png" width="100%">

<h3 style="color:#0e435c;">단일 Prediction vs Batch Prediction 결과</h3>

기대이상의 성능입니다. Batch Prediction을 이용할 때, 약 0.15초 더 빠르게 변환되었습니다. 모델 load시간(npu caching)이 포함된 첫 변환뿐만 아니라 두번째 변환(Caching모델을 이용한 prediction)을 할때도 약 0.15초 더 빠르게 변환이 완료 되었습니다.<br>
한번에 변환하는 입력값(Input)의 갯수가 더 많아지면 그 차이가 더 커질 것으로 기대됩니다.

|                  | 첫 변환 | 두번째 변환 | 세번째 변환 | 네번째 변환 |
| :--------------: | :-----: | :---------: | :---------: | :---------: |
| 단일 Prediction  |  4.88   |    0.86     |    0.88     |    0.84     |
| Batch Prediction |  4.74   |    0.71     |    0.70     |    0.70     |

---

<h2 style="color:#0e435c;">Batch Prediction API의 한계</h2>

<a href="https://developer.apple.com/videos/play/wwdc2023/10049/">WWDC2023 영상</a>에서는 Batch Prediction API의 한계에 대해서 다음의 4가지를 언급하고 있습니다.

1. Fixed quantity of work
   : 수행할 작업의 양이 정해진 경우에 사용하면 좋지만, 처리해야할 작업의 양이 유동적이면 사용하기가 어려움.
2. Partial batches
   : batch의 사이즈를 마음대로 조정할 수 있지만, 해당 batch의 사이즈보다 적은 수의 인풋을 처리할 방법을 찾아야 한다.
3. Different UI experience
   : batch의 사이즈 단위로 처리되다보니 UI적으로 어색할 수 있음.
4. Lack of cancellation support
   : batch Prediction이 진행중일 때 취소하기가 힘듬.

<br>

이에 더해 Batch Prediction API의 한계를 말하자면, 완벽하게 비동기로 처리하기가 힘들다는 것입니다.
단일 Prediction보다는 낫겠지만, 전처리, 후처리 과정에서 병목현상이 발생할 수 밖에 없습니다.<br>

<h4 align="middle">병목현상이 발생하는 비동기 batch prediction을 이용한 메서드</h4>

```swift
func batchPrediction(by model: CustomModel, from images: [UIImage]) async throws -> [UIImage] {
    let inputs = try await makeInputs(from: images) // 병목 1: 전처리(인풋 생성)

    let outputs = try model.predictions(inputs: inputs) // 병목 2: Batch 변환

    let results = try await afterProcessing(from: outputs) // 병목 3: 후처리

    return results

}
```

---

<h2 style="color:#0e435c;">Async Prediction API (iOS17 이상)</h2>

iOS17부터 Async Prediction API가 등장했습니다. Async Prediction API는 스레드로부터 안전하기 때문에, 동시성과 함께 CoreML을 사용하는 데 적합합니다.

<h4 align="middle">DeepLabV3모델의 Async Prediction 메서드</h4>
<img src="/assets/img/swift/batch_async_prediction/6.png" width="90%">

<h3 style="color:#0e435c;">Sync(단일) vs Batch vs Async 성능 비교 테스트</h3>

이 포스트를 작성했을 때 아직 iOS17가 정식으로 출시 되지 않았고, Beta버전의 Xcode를 이용해서 테스트를 진행 하였습니다.<br>
때문에 시뮬레이터를 이용해서 테스트를 진행 했으며, 시뮬레이터 특성상 Neural Engine을 사용하지 못하기 때문에, CPU만을 이용한 Prediction으로 테스트를 진행하였습니다.

- <b>모델:</b> 커스텀 Animegan모델(made in Anipen corp)
- <b>테스트폰 기종:</b> iOS 시뮬레이터(M1 Mac)
- <b>CPU 사용</b>
- <b>동시변환 인풋 갯수:</b> 5개

<img src="/assets/img/swift/batch_async_prediction/5.png" width="80%">

결론적으로, Async Prediction API의 성능은 Batch Prediction API 성능 보다 약간 더 좋았습니다.<br>
또한 Async Prediction API가 Batch Prediction API보다 더 유연하게 사용할 수 있기 때문에 더 나은 선택이라고 생각합니다.

---

<h2 style="color:#0e435c;">Async Prediction API 사용시 주의사항</h2>

Async Prediction을 이용하여 앱에 동시성을 추가할 때 염두에 두어야 할 중요한 사항은 메모리 사용량입니다.

<h4 align="middle">급격하게 증가하는 메모리의 양</h4>
<img src="/assets/img/swift/batch_async_prediction/7.png" width="80%">

이를 개선하는 방법은 동시에 예측할 수 있는 최대 양을 제한하는 논리로직을 추가하는 것 입니다.

<div class="explain-cover">
    <div class="explain-left" style="padding-top:1%">
		<h4 align="middle">무분별한 동시 예측 사용</h4>
        <img src="/assets/img/swift/batch_async_prediction/8.png" width="100%">
    </div>
    <div class="explain-right" style="padding-top:1%">
		<h4 align="middle">동시 예측 최대 양 제한</h4>
        <img src="/assets/img/swift/batch_async_prediction/9.png" width="100%">
    </div>
</div>

---

<h2 style="color:#0e435c;">Sync, Batch, Async Prediction API의 적절한 사용</h2>

<a href="https://developer.apple.com/videos/play/wwdc2023/10049/">WWDC2023 영상</a>에서 마지막으로 Sync, Batch, Async Prediction API의 적절한 사용을 언급합니다.<br>

1. <b>Sync Prediction:</b> 동기 컨텍스트에 있고 각 입력 사이의 시간이 모델 대기 시간에 비해 길 때
   <img src="/assets/img/swift/batch_async_prediction/10.png" width="90%">

2. <b>Batch Prediction:</b> 입력을 일괄적으로 사용할 수 있을 때
   <img src="/assets/img/swift/batch_async_prediction/11.png" width="90%">
3. <b>Async Prediction:</b> 비동기 컨텍스트에 있고 시간이 지남에 따라 많은 양의 유동적인 입력이 있는 경우
   <img src="/assets/img/swift/batch_async_prediction/12.png" width="90%">

---

<h2 style="color:#0e435c;">참고 링크</h2>

<a href="https://developer.apple.com/videos/play/wwdc2023/10049/">Improve Core ML integration with async prediction | WWDC2023</a><br>
<a href="https://developer.apple.com/documentation/coreml/mlmodel/4135000-prediction">prediction(from:options:) | Apple Developer Documentation</a>
