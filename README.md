# 목차

```
1. 배포링크
2. 프로젝트 실행 방법
3. 사용한 기술 스택
4. 구현한 기능 목록
5. 구현 방법 및 구현하면서 어려웠던 점
6. Prototype 소개(Figma)
```

## 배포링크

1. www.wachsenhaus.com
2. ![Apr-01-2022 20-31-42](https://user-images.githubusercontent.com/59411545/161255495-53ac9f9f-07b2-42e0-b039-5a519597c8c7.gif)


## 프로젝트 실행 방법

```
npm i --force --legacy-peer-deps // npm 패키지를 인스톨해주세요
npm run start // 프로젝트를 실행해주세요.
```

## 사용한 스택

* CSS 도구  
    + tailwincss
    + GrommetUi  
    + Framer.motion  
    + chart.js
* 자바스크립트 유틸도구
    + moment 
    + immer. 
    + uuid. 
    + classnames. 
*  주 사용 프레임워크 및 라이브러리
    + React. 
    + Typescript. 
    + Recoil. 
*  기타 도구
    + Notion
    + Figma

## 구현한 기능 목록
1. BTC,KALY,ZIL,ETH,XNO개의 원화 코인은 실시간 티커가 보여집니다.
2. 비트코인의 호가창이 실시간으로 보여집니다.
3. 실시간 체결내역이 보여집니다. 항상 최신으로 갱신됩니다.
4. 체결내역, 호가창, 티커가 연동되여 차트와 ui에서 알림이 직관적으로 보이게 구현하였습니다.

## 구현 방법 및 구현하면서 어려웠던 점
### 구현 방법
1. 웹소켓은 3개의 웹소켓을 생성하였습니다, ticker, transition, orderbook 3개의 웹소켓이 메세지를 수신하면 각 리코일 상태저장소로 데이터가 저장되게 구현하였습니다.
2. 위 3개 상태의 값들을 각각의 ui에서 섞어서 조회하고 사용하기 때문에 immer라이브러리를 적극적으로 사용하였습니다.

### 어려웠던 점
1. 해당 과제를 진행하면서 웹소켓과 리코일을 처음 사용 해보았는데 웹소켓을 통해 들어오는 데이터가 파편화 되어있고 ui에 표시하려면 데이터를 기다려야되는점에서 갈피를 못잡고 해맸습니다.
  * 해결 방법으로는 웹소켓 immer와 리코일을 적극적으로 사용하여 데이터를 state에 합쳐서 관리했습니다.
  * UI적으로는 처음 데이터가 없는 부분은 로딩 표시로 덮이도록 하였습니다. 
3. 리코일을 처음 사용하면서 특정 객체의 밸류값만 수정하려고하였으나 readonly에러를 만나면서 중요한 법칙인 state 불변성을 놓치고 시간을 소비했습니다.
  * JSON.Parse(JSON.Stringify())와 immer를 측정하여 테스트해보았으나 immer가 50%정도 더 느렸습니다. 하지만 JSON은 웹소켓 객체에 대한 복사가 끊겨지는것을 확인하였습니다.
  * immer도구를 사용하여 프로젝트를 진행하였습니다.

### 피그마 프로토타이핑 툴
https://www.figma.com/proto/Ft1BxA5Psn4bW1hGd0RAgy/codestates-bithumb-frontend-%EC%B5%9C%EC%98%81%ED%9B%88?node-id=6%3A177&scaling=contain&page-id=0%3A1&starting-point-node-id=2%3A2  

코딩하기전에 빗썸 홈페이지와 api를 구경하면서 프로토타입으로 만든 피그마입니다
개발을 진행하면서 구현해야할것과 많이 다르고 시간이 부족하여 피그마는 이후로 수정하지 못했습니다.

# 성능 최적화 고민
1. 객체 깊은 복사  
  1.1 https://bi9choi.notion.site
2. 정렬 속도  
  2.1 https://bi9choi.notion.site/sort-d35559931b604db0a26a8f8c8f2b9e75

노션 
3. https://bi9choi.notion.site/7f8eda0a78124414be50b52906833142


## 궁금한 점
### 웹소켓은 최대 몇개까지 가능한가???

### 빗썸이나 다른 거래소는 어떻게 빨리 데이터가 나오는가? 당연히 외부에 노출하는 api와 다른게 있겠지 ?
