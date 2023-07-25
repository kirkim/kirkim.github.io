---
layout: post
title: '[Swift] CVPixelBuffer'
subtitle: ''
date: 2023-07-23 02:45:51 +0900
categories: ios
tags: swift
comments: true
---

Swift에서 이미지 데이터를 다루는 데 사용되는 형식이 생각 보다 많습니다. <b style="font-size:90%">(CGImage, CIImage, UIImage, VImage, CVPixelBuffer 등등..)</b><br>
모든 이미지 데이터 형식들이 쓰임에 따라 각각의 매력이 있는 것들이지만,<br>
최근에 비디오 프레임처리에 대해 관심이 있기 때문에, CVPixelBuffer타입에 대해 알아볼 계획입니다.<b style="font-size:90%">(그래픽 처리에 특화된 MTLTexture타입도 있지만, 아직 Metal보다는 좀 더 쉬운 것부터..)</b><br>
CVPixelBuffer타입의 경우 이미지 프로세싱 및 머신러닝 작업을 할때도 자주 사용하는 타입이기 때문에 ML관련 작업을 하시는 분이라면 반드시 알아둬야할 타입이지 않을까 생각이 듭니다.<br>

---

<h2 style="color:#0e435c;">CVPixelBuffer 명칭</h2>

우선 단순하게 CVPixelBuffer의 명칭을 파악해 본다면, <b class="blue">CV + Pixel + Buffer</b> 세부분으로 나눌 수 있을 것 같습니다.<br>
<br>
<b style="font-size:120%;">(1)</b> <b style="font-size:130%; color:green">CV</b>PixelBuffer

CVPixelBuffer에서 "CV"는 <a href="https://developer.apple.com/documentation/corevideo">Core Video</a>를 뜻합니다.<br>

<img src="/assets/img/swift/cvpixelbuffer/1.png" width="90%">

CoreVideo는 Apple에 내장된 비디오 처리관련 프레임워크입니다.<br>
위에 이미지에서 보면 알듯이 **비디오 프레임을 조작할 필요가 없는 앱은 직접 사용할 필요가 없는** 프레임워크라고 합니다. 때문에 **Core Video**프레임워크에 관한 자세한 내용은 비디오 프레임에 관해 다룰때 알아보도록 하겠습니다.<br>
CVPixelBuffer타입을 사용하기 위해 반드시 Core Video 프레임워크를 import할필요없으며, 다음의 프레임워크들만 import해도 사용할 수 있습니다.<br>

<swift_block>
<span class="import">import</span> CoreImage<br>
<span class="import">import</span> CoreML<br>
<span class="import">import</span> Vision<br>
<span class="import">import</span> AVFoundation<br>
<span class="import">import</span> MetalKit<br>
<span class="import">import</span> Photos<br>
</swift_block>

<b style="font-size:90%">(CVPixelBuffer타입을 사용하는 프레임워크들이 이렇게나 많다..)</b>
<br>
<br>
<b style="font-size:120%;">(2)</b> CV<b style="font-size:130%; color:green">Pixel</b>Buffer

Pixel은 Picture Element의 줄임말로, 이미지의 최소 단위를 나타냅니다.
CVPixelBuffer는 특정 이미지 데이터를 표현하기 위해 픽셀 데이터를 메모리에 저장하고, Pixel 단위로 접근 및 처리할 수 있는 형식으로 설계되어 있습니다.
<br>
<br>
<b style="font-size:120%;">(3)</b> CVPixel<b style="font-size:130%; color:green">Buffer</b>

버퍼는 데이터를 한 곳에서 다른 한 곳으로 전송하는 동안 일시적으로 그 데이터를 보관하는 메모리의 영역입니다. 다른 말로 큐(Queue)라고도 표현합니다.<br>
CVPixelBuffer는 이미지 데이터를 효율적으로 처리하기 위해 픽셀(Pixel)데이터를 메모리에 일렬로 배치하는 Buffer와 같은 역할을 합니다.<br>
이러한 버퍼 구조는 비디오 프레임 처리와 다양한 이미지 관련 작업에 도움이 됩니다.

---

<h2 style="color:#0e435c;">CVPixelBuffer 생성</h2>

<h3 style="color:blue">직접 생성할 일이 있을까..?</h3>

우리가 직접 CVPixelBuffer를 만드는 경우는 많지 않을 것 같습니다.<br>
CoreML에서 Vision관련 mlmodel의 Input타입을 생성할 때 CVPixelBuffer타입이 필요하지만, Vision API를 이용하면 이 과정없이 편리하게 모델 추론 기능을 사용할 수 있습니다.<br>
<br>
영상의 경우도, AVFoundation API를 이용하면 영상을 자동으로 CVPixelBuffer타입으로 이미지를 뽑아서 만들어 줍니다.<br>
이렇게 얻은 CVPixelBuffer를 이용하여 mlmodel변환을 하거나, CIImage로 변환하여 필터를 적용하는 등등.. 영상을 후처리하는 과정만 신경쓰면 될 것 입니다.<br>

<h3 style="color:blue">그래도 알아보자</h3>

CVPixelBuffer를 우리가 직접 만들어서 사용하는 경우가 있을 수 있습니다.<br>
보통 CVPixelBuffer 직접 만들어서 사용하는 경우는 UIImage를 이용해서 생성하는 경우일 것 같습니다.<br>
UIImage, CGImage, CIImage간의 변환은 비교적 간단하기 때문에 CIImage를 이용해서 CVPixelBuffer를 생성하는 방법을 알아보겠습니다.<br>
<b style="font-size:90%">(UIImage, CGImage, CIImage에 대한 내용 및 상관관계는 나중에 기회가 되면 포스트를 작성하겠습니다.)</b><br>

<h3 style="color:blue">생각보다 쉬울 수도?</h3>

<img src="/assets/img/swift/cvpixelbuffer/2.png" width="90%">

XCode 미리보기에서 CIImage가 pixelBuffer변수를 가지고 있음을 발견..이렇게 쉽다고?<br>
<br>

```swift
let ciImage = CIImage(cvPixelBuffer: pixelBuffer)

print(ciImage) // 유효한 CIImage 출력
print(ciImage.pixelBuffer) // 유효한 CVPixelBuffer 출력
```

CVPixelBuffer를 이용해 생성한 CIImage의 경우 유효한 pixelBuffer변수를 가지고 있습니다.<br>
이처럼 이미지 데이터를 포함하고 있는 CVPixelBuffer는 CIImage로 변환이 쉽습니다.<br>
<b style="font-size:90%">(빈그릇상태CVPixelBuffer[픽셀데이터는 없는 빈껍데기]의 경우에도 유효한 CIImage로 변환되긴함)</b>
<br>
하지만 <rd>CVPixelBuffer를 이용하지 않고 생성한 CIImage</rd>의 경우 아래의 코드예시처럼 `nil`을 출력합니다.<br>

```swift
// UIImage를 이용하여 생성된 CIImage
guard let ciImage = CIImage(image: image) else {
  return
}

print(ciImage.pixelBuffer) // nil
```

UIImage의 이미지의 경우 `.cgImage` 변수가 유효한값이 였던 것의 함정에 빠졌던 것 같습니다.<br>
좀 더 설명하자면 CIImage의 경우 UIImage와 CGImage와 별개로 이미지 자체로써 직접적으로 사용되지 않으며 단순히 이미지 정보를 담고있는 데이터입니다.<br>
CIImage가 `.cgImage`, `.pixelBuffer`의 변수를 포함하고 접근할 수 있지만 어떻게 생성됐는지에 따라, 해당 변수가 nil일 수도 있고 유효할 값이 될 수 있습니다.<br>
UIImage, CGImage를 이용해 생성된 CIImage의 경우만 유효한 CGImage변수를 가지고 있으며,
결론적으로, <b class="green">CVPixelBuffer를 이용해 생성한 CIImage의 경우만 유효한 pixelBuffer를 가지고 있게 됩니다.</b><br>

<h3 style="color:blue">결론.. CIImage to CVPixelBuffer는 별도의 추가작업이 필요하다</h3>

다행히 CoreImage 프레임워크에서 제공해주는 <a href="https://developer.apple.com/documentation/coreimage/cicontext/1437853-render">render(\_:to:)</a> 메서드를 이용하면 비교적 쉽게 CVPixelBuffer타입으로 변환할 수 있습니다.<br>
render(\_:to:)메서드의 경우 인자로 픽셀데이터를 담을 버퍼역할을할 CVPixelBuffer가 필요한데,<br>
CoreVideo프레임워크에서 제공해주는 <a href="https://developer.apple.com/documentation/corevideo/1456758-cvpixelbuffercreate">CVPixelBufferCreate(\_:\_:\_:\_:\_:\_:)</a>메서드를 이용하면 픽셀데이터를 받을 수 있는 빈껍데기상태의 CVPixelBuffer를 만들 수 있습니다.<br>

```swift
func convertToPixelBuffer(from ciImage: CIImage) -> CVPixelBuffer? {
    let size = ciImage.extent.size
    var pixelBuffer: CVPixelBuffer?
    let width:Int = Int(size.width)
    let height:Int = Int(size.height)

    CVPixelBufferCreate(kCFAllocatorDefault,
                    width,
                    height,
                    kCVPixelFormatType_32BGRA,
                    nil,
                    &pixelBuffer)

    let context = CIContext()
    guard let pixelBuffer = pixelBuffer else {
        return nil
    }
    context.render(ciImage, to: pixelBuffer)

    return pixelBuffer
}
```

CIImage는 CIContext를 사용해서 랜더링을 하는데, CIContext는 CGContext와 다르게 스레드 안전한 클래스이며 GPU 가속을 지원합니다. 이렇다보니 CGImage를 다룰때보다 CIImage를 커스텀하는 부분에 대해서는 다소 한정적이며, 내부적으로 자동으로 처리해주는 부분이 많은 것 같습니다. CVPixelBufferCreate의 각각의 옵션들을 살펴보더라도 CGImage보다 CIImage랑 사용했을 때 옵션들이 제한적입니다, 하지만 기본값으로 설정해주어도 잘 랜더링을 해주고 안전하게 사용할 수 있기 때문에 오히려 더 편한점도 있습니다.<br>
<b class="green">CIContext를 이용한 랜더링을 할때, CVPixelBufferCreate메서드를 사용할때도 대부분 기본옵션들만 지정해주어도 됩니다. 랜더링의 메인은 CIContext개체의 `.render()`메서드입니다.</b><br>
위에 예시코드에서사용한 CVPixelBufferCreate메서드 인자들에 대해 간단히 살펴보자면,<br>
<b class="green">첫번째 인자</b>로 CFAllocator를 받는데, CVPixelBuffer에 필요한 메모리를 할당하거나 해제하는 역할을 합니다. Swift언어 자체가 메모리관리를 알아서 해주기 때문에, 메모리관리에 대해서 낯선부분일 수 있습니다. 애매하게 알고 사용하기 보다는 기본옵션인 KCFAllocatorDefault을 이용해서 기본 메모리 할당자를 사용하겠습니다.(`nil`을 넣어도 기본값으로 설정됨). 만약 다른 미리 선언된 Alloctor에 대해 알고 싶은 분들은 <a href="https://developer.apple.com/documentation/corefoundation/cfallocator/predefined_allocators">Predefined Allocators | Apple Developer</a>를 참고하시면 될 것 같습니다.<br>
다음으로 <b class="green">두번째, 세번째 인자</b>로 랜더링할 CIImage 크기와 같게 버퍼사이즈를 지정해주기 위해 width, height값을 넣어줍니다.<br>

<h4 align="middle">(랜더링할 이미지 사이즈와 다르게 하면 이렇게 그려짐..)</h4>
<img src="/assets/img/swift/cvpixelbuffer/5.png" width="90%">

<br>
<b class="green">네번째 인자</b>로, 다양한 이미지 속성과 컬러 포멧형식을 결정하는 인자입니다. `CIImage`의 랜더링용으로 사용하기 위해 32비트 ARGV형식을 뜻하는 'kCVPixelFormatType_32BGRA'옵션을 지정해줬습니다. (사실 CIImage는 대부분의 옵션이 호환이 안됨)<br>
<b class="green">다섯번째 인자</b>로 픽셀 버퍼에 대한 속성을 CFDictionary형식으로 지정하면 되는데, 이 옵션 역시 CIContext를 사용할 경우 따로 지정해줄 필요가 없습니다.<br>
<b class="green">여섯번째 인자</b>로 pixelBuffer의 참조를 넣어주면 됩니다.<br>
CVPixelBufferCreate의 각각의 옵션들을 조작하면서 랜더링을 해보고싶은 분들은 CIImage, CIContext보다는 **CGImage, CGContext**와 함께 사용해보면 될 것 같습니다.<br>
<br>

<img src="/assets/img/swift/cvpixelbuffer/4.png" width="90%">
<h4 align="middle">(CGContext를 이용하면 이런 재밌는 놀이(?)를 할 수 있음.., 이마저도 CIFilter를 이용하면 더 안정적으로 다양한 필터링을 적용할 수 있음)</h4>

<h3 style="color:blue">결론에 결론</h3>

뭔가 위에서 예시코드에 대해서 오기가 생겨서 주저리주저리 설명을 한 것 같지만..<br>
<b class="purple">"결론은 CVPixelBuffer를 직접만들지말고 Swift에서 만들어주는 것을 사용하자"</b> 입니다.<br>
굳이 **CVPixelBuffer타입 만들어 사용하고 싶다면 CIImage를 이용해서** 만드는게 좋을 것 같습니다.<br>
CIImage, CIContext가 스레드안전하면서 GPU를 지원하도록 설계된 만큼 내부적으로 최적화되어 자동으로 처리해주는데, 이런 것들이 오히려 개발자입장에서 안전하고 간단하게 랜더링할 수 있도록 도와준다고 생각합니다.

---

<h2 style="color:#0e435c;">참고 링크</h2>

- <a href="https://developer.apple.com/documentation/corevideo">Core Video | Apple Developer</a><br>
- <a href="https://developer.apple.com/documentation/corevideo/cvpixelbuffer-q2e">CVPixelBuffer | Apple Developer</a><br>
- <a href="https://ko.wikipedia.org/wiki/%EB%B2%84%ED%8D%BC_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99)">Buffer | 위키백과</a><br>
- <a href="https://rockyshikoku.medium.com/ciimage-to-cvpixelbuffer-93b0a639ab32">CIImage to CVPixelBuffer | MLBoy</a><br>
- <a href="https://developer.apple.com/documentation/corevideo/1456758-cvpixelbuffercreate">CVPixelBufferCreate(_:_:_:_:_:_:) | Apple Developer</a><br>
- <a href="https://developer.apple.com/documentation/coreimage/cicontext/1437853-render">render(\_:to:) | Apple Developer</a>
