---
layout: post
title: '[Swift] RxDataSources 사용해보기'
subtitle: ''
date: 2022-08-10 12:45:51 +0900
categories: swift
tags: etc
comments: true
---

⛔️ RxDataSources에 대해 개인적으로 공부한 것을 정리한 글입니다. 최대한 올바른 내용만 적기위해 노력하고 있지만 틀린내용이 있을 수 있습니다. 그렇기 때문에 글을 읽으실때 비판적으로 읽어주세요.<br />
틀린내용에 대한 피드백은 메일로 보내주시면 감사하겠습니다🙏🏻

<kline></kline>

<h1>1️⃣ RxDataSources 기본사용방법</h1>
RxDataSources깃허브사이트: 👉🏻 <a href="https://github.com/RxSwiftCommunity/RxDataSources" target="blank">RxDataSources - github</a>

<h2 class="ksubsubject">(1) 섹션모델 만들어주기</h2>

셀에 필요한 셀데이터(CustomData)는 유연하게 만들어주고, 하나의 섹션데이터를 나타내는 섹션모델타입을 <b class="purple">SectionModelType</b>을 준수해서 만들어주면 됩니다. <b class="green">items는 필수 요소</b>이며, <b class="brown">header, footer는 필수요소가 아닙니다.</b> 대신에 다음과 같이 옵셔널형태로 만들어주면 섹션별로 header와 footer를 선택적으로 만들어줄 수 있습니다.

```swift
struct CustomData {
    var name: String
    var age: Int
    var country: String
}

struct SectionOfCustomData {
    var header: String?
    var footer: String?
    var items: [Item]
}

extension SectionOfCustomData: SectionModelType {
  typealias Item = CustomData

   init(original: SectionOfCustomData, items: [Item]) {
    self = original
    self.items = items
  }
}
```

<kline></kline>

<h2 class="ksubsubject">(2) 옵저버형식의 셀데이터 만들어주기</h2>
위에 만들었던 **섹션모델타입**에 맞춰서 다음과 같이 <b class="purple">옵저버형식의 셀데이터</b>를 만들어줍니다.
이번 포스트에서는 미리 초기데이터를 지정해 주었습니다.<br />
옵저버형식으로 <b class="brown">셀데이터변수</b>를 만들어주면 별도의 **테이블뷰 갱신 메서드**를 만들필요없이 <b class="brown">셀데이터변수</b>가 변경되면 실시간으로 테이블뷰가 업데이트 됩니다.

```swift
private let datas = BehaviorRelay<[SectionOfCustomData]>(value: [
    SectionOfCustomData(header:"섹션 1 header", items: [
        CustomData(name: "kirim", age: 19, country: Country.america.korean),
        CustomData(name: "Jane", age: 24, country: Country.china.korean),
        CustomData(name: "케인", age: 29, country: Country.england.korean),
        CustomData(name: "요리스", age: 36, country: Country.france.korean)
    ]),
    SectionOfCustomData(header:"섹션 2 header",footer:"섹션 2 footer", items: [
        CustomData(name: "손흥민", age: 30, country: Country.korea.korean),
        CustomData(name: "Rooney", age: 36, country: Country.england.korean)
        ]),
    SectionOfCustomData(items: [
        CustomData(name: "침착맨", age: 40, country: Country.korea.korean),
        CustomData(name: "Body", age: 36, country: Country.england.korean)
        ])
])
```

<kline></kline>

<h2 class="ksubsubject">(3) RxTableViewSectionedReloadDataSource 만들어주기</h2>
<b class="blue">RxTableViewSectionedReloadDataSource</b>는 기존에 **UITableViewDataSource**에서 재사용셀을 관리해주는 메서드와 동일한 역할을, <b class="purple">RxCocoa</b>를 이용해 사용할 수 있게 만들어줍니다.<br />
필요에 따라 <b class="green">.titleForHeaderInSection</b>와 <b class="green">.titleForFooterInSection</b>를 정의하여 header와 footer를 만들어줄 수 있습니다. 옵셔널타입도 지정이 가능하기 때문에 섹션모델타입에 header, footer 요소만 있다면 에러걱정없이 자유롭게 만들어줘도 됩니다.

```swift
func dataSource() -> RxTableViewSectionedReloadDataSource<SectionOfCustomData> {

    // Cell
    let dataSource = RxTableViewSectionedReloadDataSource<SectionOfCustomData>(
      configureCell: { dataSource, tableView, indexPath, item in
          let cell = tableView.dequeueReusableCell(for: indexPath, cellType: MainViewCell.self)
          cell.configure(item)
        return cell
    })

    // Header
    dataSource.titleForHeaderInSection = { dataSource, index in
      return dataSource.sectionModels[index].header
    }

    // Footer
    dataSource.titleForFooterInSection = { dataSource, index in
      return dataSource.sectionModels[index].footer
    }

    return dataSource
}
```

<kline></kline>

<h2 class="ksubsubject">(4) 테이블뷰와 바인딩해주기</h2>
지금까지만든 <b class="green">dataSource</b>, <b class="green">옵저버셀데이터변수</b>를 **RxCocoa**를 이용해서 <b class="purple">테이블뷰</b>와 연결해주면 됩니다.

```swift
let datasource = viewModel.dataSource()
viewModel.dataDriver
    .drive(tableView.rx.items(dataSource: datasource))
    .disposed(by: disposeBag)
```

<img src="/assets/img/swift/rxdatasources/1.png" width="100%" style="max-width:200px">

<kline></kline>

<h2 class="ksubsubject">(5)[번외] 끌어당기면 첫번째섹션에 데이터추가하기</h2>
만들어준 <b class="purple">옵저버셀데이터변수</b>만을 변경하는 것만으로 테이블뷰가 업데이트 되는지 확인해보도록하겠습니다.
다음과 같이 <b class="brown">첫번째섹션</b>데이터에 셀데이터를 하나추가해주는 메서드를 만들었습니다.

```swift
func addCellAtFirstSection(completion: @escaping ()->()) {
    var datas = datas.value
    let sectionOneData = datas[0] // 첫번째섹션 데이터
    var items = sectionOneData.items
    items.append(CustomData(name: "추가셀", age: 22, country: Country.korea.korean))
    let newDatas = SectionOfCustomData(header: sectionOneData.header, footer: sectionOneData.footer, items: items)

    datas[0] = newDatas // 첫번째섹션을 새로운섹션데이터로 변경
    self.datas.accept(datas)
    completion()
}
```

이제 다음과 같이 <b class="purple">UIRefreshControl()</b>를 만들어서 끌어당기면 <b class="green">첫번째 섹션에 셀이 한개 추가해주는 메서드를 호출</b>하도록 만들었습니다.<br />
기존과 다른점은 <rd>tableView의 reloadData()를 따로 호출해주지 않는다는 것 입니다.</rd>

```swift
private func attribute() {
    /* 코드 생략 */
    self.tableView.refreshControl = UIRefreshControl()
    self.tableView.refreshControl?.addTarget(self, action: #selector(didPullToRefresh), for: .valueChanged)
}

@objc private func didPullToRefresh() {
    DispatchQueue.global().async {
        self.viewModel.addCellAtFirstSection() { [weak self] in
            usleep(500000) // 임시로 지연시간 0.5초 주기
            DispatchQueue.main.async {
                self?.tableView.refreshControl?.endRefreshing()
            }
        }
    }
}
```

<img src="/assets/img/swift/rxdatasources/rxdatasources1.gif" width="100%" style="max-width:200px">

이렇게 <b class="purple">Rxdatasources</b>를 이용하면 <b class="brown">MVVM패턴</b>에 알맞게 셀데이터들을 관리해줄 수 있습니다.
<span style="font-size:90%">(기존의 경우 ViewController 클래스에서 UITableViewDatasource의 필수메서드를 구현하면서 어쩔 수 없이 셀데이터의 주입이 노출 되었습니다.)</span>

<h1 class="ksubject">2️⃣ RxDataSources 응용 (여러종류의 섹션)</h1>

위의 기본적인 사용방법으로 **섹션모델**을 구현한다면 <rd>한가지 종류의 셀데이터</rd>만 사용할 수 있습니다.<b style="font-size:90%">(셀종류나 UI는 다르게 구현이 가능)</b><br />
다음과 같이 <b class="purple">enum타입</b>을 이용하면 <b class="purple">섹션마다 다른 셀데이터를 지정하도록 만들 수 있습니다</b>

<kline></kline>

<h2 class="ksubsubject">(1) 섹션모델 만들어주기</h2>

```swift
enum PresentMenuSectionModel {
    case SectionMainTitle(items: [PresentMenuTitleItem])
    case SectionMenu(header: String, selectType: SelectType, items: [PresentMenuItem])
    case SectionSelectCount(items: [PresentSelectCountItem])
}
```

위의 셀데이터타입들 PresentMenuTitleItem, PresentMenuItem, PresentSelectCountItem들은 동일한 프로토콜을 준수하도록 만듭니다.
다음과 같이 빈프로토콜을 만들어 사용했습니다.

```swift
protocol PresentMenuSectionItem {

}
```

이제 <b class="purple">enum타입</b>으로 구현한 섹션모델타입을 <b class="brown">extension</b>으로 확장하여 <b class="brown">SectionModelType</b>을 준수하도록 만들어줍니다.

```swift
extension PresentMenuSectionModel: SectionModelType {
    typealias Item = PresentMenuSectionItem

    init(original: PresentMenuSectionModel, items: [PresentMenuSectionItem]) {
        self = original
    }

    var headers: String? {
        if case let .SectionMenu(header, _, _) = self {
            return header
        }
        return nil
    }

    var selectType: SelectType? {
        if case let .SectionMenu(_, type, _) = self {
            return type
        }
        return nil
    }

  var items: [Item] {
      switch self {
      case .SectionMainTitle(let items):
          return items
      case .SectionMenu(_, _, let items):
          return items
      case.SectionSelectCount(let items):
          return items
      }
  }
}
```

<b class="green">headers</b>와 <b class="green">selectType</b>은 따로 규칙이 있는 변수가 아니며 **섹션모델타입**의 각각의 케이스에서 받게 되는 요소들입니다. 이러한 요소들은 유연하게 구성하시면 될 것 같습니다. 중요한 부분은 <b class="blue">Item</b>의 타입을 위에 만들어준 프로토콜타입으로 지정해주며 <rd>items변수</rd>는 제대로 지정해줘야 셀데이터를 잘 전달해줄 수 있습니다.

<kline></kline>

<h2 class="ksubsubject">(2) 셀데이터 주입방법</h2>

원하는 섹션을 선택해서 아래의 코드와 같은 원리로 **섹션데이터배열**을 구성해 주면 됩니다.
실제로 사용하기 위해선 최종적으로 <b class="purple">옵저버형태의 변수</b>로 만들어 줘야 합니다.

```swift
var data:[PresentMenuSectionModel] = []

// 케이스 1
self.data.append(.SectionMainTitle(items: [PresentMenuTitleItem(image: hasImage, mainTitle: self.title, description: hasData?.description)]))
// 케이스 2
self.data.append(.SectionMenu(header: section.title, selectType: sectionType, items: menuBundle))
// 케이스 3
self.data.append(.SectionSelectCount(items: [PresentSelectCountItem(count: 1)]))

```

<kline></kline>

<h2 class="ksubsubject">(3) RxCollectionViewSectionedReloadDataSource 구현 </h2>
이번에는 <b class="purple">콜렉션뷰</b>를 이용했습니다. 테이블뷰에 RxTableViewSectionedReloadDataSource가 있는 것 처럼 콜렉션뷰에도 <b class="purple">RxCollectionViewSectionedReloadDataSource</b>타입이 있습니다.
아래의 코드를 보면 **셀데이터**를 클로져에서 제공해주는 <b class="brown">item</b>에서 가져오지 않고 <b class="brown">case의 인자</b>에서 가져옵니다. 이유는 섹션모델타입을 만들때 셀데이터들을 하나의 프로토콜을 준수하도록 구현했기 때문에, 각각의 케이스에 맞는 셀데이터로 사용하기 위해서는 <b class="brown">item</b>을 guard문을 통해 타입을 확인하는 작업이 필요합니다. 그럴바에 <b class="brown">case의 인자</b>의 값을 그대로 사용하는 방법을 선택하였습니다. <b style="font-size:90%">(좀 더 나은 방법이 있으면 말해주세요)</b>

```swift
func dataSource() -> RxCollectionViewSectionedReloadDataSource<PresentMenuSectionModel> {
    let dataSource = RxCollectionViewSectionedReloadDataSource<PresentMenuSectionModel>(
        configureCell: { dataSource, collectionView, indexPath, item in
            switch dataSource[indexPath.section] {
            case .SectionMainTitle(items: let items):
                let cell = collectionView.dequeueReusableCell(for: indexPath, cellType: MagnetPresentMainTitleCell.self)
                let item = items[indexPath.row]
                cell.setData(image: item.image, title: item.mainTitle, description: item.description)
                return cell
            case .SectionMenu(header: _, selectType: _, items: let items):
                let cell = collectionView.dequeueReusableCell(for: indexPath, cellType: MagnetPresentMenuCell.self)
                cell.setData(data: items[indexPath.row])
                return cell
            case .SectionSelectCount(items: _):
                let cell = collectionView.dequeueReusableCell(for: indexPath, cellType: MagnetPresentCountSelectCell.self)
                cell.bind(self.countSelectViewModel)
                return cell
            }
        })

    return dataSource
}
```

<b class="blue">콜렉션뷰의 RxCollectionViewSectionedReloadDataSource</b>는 아래의 코드와 같이 <b class="blue">header(헤더)</b> 또한 <rd>커스텀헤더뷰를 만들어 지정해줄 수 있습니다.</rd><br />
반면, **테이블뷰(UITableView)**는 커스텀헤더뷰를 만들어줄 수 있는 기능이 없는 것 같습니다. <b style="font-size:90%">(이유는 모르겠습니다..)</b>

```swift
func dataSource() -> RxCollectionViewSectionedReloadDataSource<PresentMenuSectionModel> {

	/* 코드 생략 */

    dataSource.configureSupplementaryView = {(dataSource, collectionView, kind, indexPath) -> UICollectionReusableView in
        switch dataSource[indexPath.section] {
        case .SectionMenu(header: let headerString, selectType: let type, items: let items):
            let header = collectionView.dequeueReusableSupplementaryView(ofKind: UICollectionView.elementKindSectionHeader, for: indexPath, viewType: MagnetPresentMenuHeaderView.self)
            header.setData(header: headerString, type: type, itemCount: items.count)
            return header
        default:
            let header = collectionView.dequeueReusableSupplementaryView(ofKind: UICollectionView.elementKindSectionHeader, for: indexPath, viewType: MagnetPresentMenuHeaderView.self)
            return header
        }
    }
    return dataSource
}
```

아래의 짤은 위에서 구현한 **섹션모델타입의 데이터**를 이용해서 만든 화면입니다.<br />
이번에 <b class="brown">3가지 종류의 케이스</b>를 만들었는데, 아래의 짤은 다음과 같이 섹션이 이루어져 있습니다.<br />

<div class="explain-cover">
    <div class="explain-left" style="padding-top:2%">
		<img src="/assets/img/swift/rxdatasources/rxdatasources2.gif" width="100%" style="max-width:400px">
	</div>
    <div class="explain-right">
		<br /><br />
        <b class="blue">사진섹션(케이스1)</b><br />
		<br />
		<b class="green">메뉴섹션(케이스2)</b><br />
		<b class="green">메뉴섹션(케이스2)</b><br />
		<b class="green">메뉴섹션(케이스2)</b><br />
		<b class="green">메뉴섹션(케이스2)</b><br />
		<br />
		<b class="purple">가격섹션(케이스3)</b><br />
    </div>
</div>

원한다면 섹션의 순서를 바꿀 수도있고, 갯수를 조정해줄 수도 있습니다. 또한 옵저버형태로 셀데이터가 관리되고 있기 때문에 <b class="green">메뉴선택항목</b>과 같은 상태값처리도 구현하기가 훨씬 간편해집니다.
