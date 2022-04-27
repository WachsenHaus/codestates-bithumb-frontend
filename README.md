# 목차

```
0. 프로젝트 노션 링크
1. 배포링크
2. 프로젝트 실행 방법
3. 사용한 기술 스택
4. 구현한 기능 목록
5. 구현 방법 및 구현하면서 어려웠던 점
6. Prototype 소개(Figma)
```

## 프로젝트 노션 링크

1. 노션  
   https://bi9choi.notion.site/7f8eda0a78124414be50b52906833142

## 배포링크

1. www.wachsenhaus.com
2. ![Apr-01-2022 20-31-42](https://user-images.githubusercontent.com/59411545/161255495-53ac9f9f-07b2-42e0-b039-5a519597c8c7.gif)

## 프로젝트 실행 방법

```
npm i // npm 패키지를 인스톨해주세요
npm run start // 프로젝트를 실행해주세요.
```

## 사용한 스택

- CSS / UI 도구
  - tailwincss
  - Material UI
  - Framer.motion
  - chart.js
- 자바스크립트 유틸도구
  - moment
  - immer
  - uuid
  - classnames
- 주 사용 프레임워크 및 라이브러리
  - React
  - Typescript
  - Recoil
- 기타 도구
  - Notion
  - Figma

## 구현한 기능 목록

1. 체결내역, 호가창, 코인목록이 실시간으로 애니메이션과 함께 보여집니다.
2. 원화코인, 즐겨찾기 기능이 구현되었습니다. 즐겨찾기 정보는 쿠키로 보관되면 1일의 유효기간을 가집니다.
3. 초성 검색이 지원됩니다. 한글자음,코인 심볼,코인 영문이름으로 검색이 가능합니다.

## 구현 방법 및 구현하면서 어려웠던 점

### 구현 방법

1. 처음 시험용 과제는 주어진 API를 사용하여 개발하였다면, 이번 실습 1,2,3주차 과제는 `리버스 엔지니어`링 관점으로 접근하였습니다.
   실제 빗썸에서 사용하는 `웹소켓`과 `REST API`를 `분석`하고 최대한 동일한 기능으로 구현하였습니다.
2. Recoil을 사용하였고, HTTP Polling Request, WebSocket으로 들어오는 데이터를 Recoil `Atom에 저장`하여 해당 atom을 **구독** 후
   데이터가 변경된다면 자동으로 랜더링되게 구현하였습니다.
3.

### 어려웠던 점

1. TradingVeiew의 **LightWeight** 라이브러리를 사용하였는데, Coin의 `Volume` 을 차트에 표기하려고했지만. `Y축 Value가 Coin,Volume의 단위`가 각기 달라, 표기가 깨지는 증상을 발견했습니다.
   해당이슈를 무료버전으로 해결하려고했지만. 상위 등급의 라이브러리로 변경해야되는것을 알고 포기했습니다.

2. 리코일에서 비동기 통신을 사용하였지만, `SetInterval` 기능을 Recoil과 합치지 못해 Polling API 같은경우는 ReactHooks를 사용한 점이 아쉬웠습니다.
   최대한 API통신은 Recoil안에서 해결하려고 했지만. 방법을 찾지 못한 아쉬움이 남습니다.

3. 즐겨찾기 정보를 `Cookie`에 저장하는데 빗썸과 동일한 형태를 유지하려고 `암호화`, `복호화` 코드를 작성하는 부분이 어려웠습니다.

### 피그마 프로토타이핑 툴

https://www.figma.com/proto/Ft1BxA5Psn4bW1hGd0RAgy/codestates-bithumb-frontend-%EC%B5%9C%EC%98%81%ED%9B%88?node-id=6%3A177&scaling=contain&page-id=0%3A1&starting-point-node-id=2%3A2

코딩하기전에 빗썸 홈페이지와 api를 구경하면서 프로토타입으로 만든 피그마입니다
개발을 진행하면서 구현해야할것과 많이 다르고 시간이 부족하여 피그마는 이후로 수정하지 못했습니다.

# 성능 최적화 고민

1. 객체 깊은 복사  
   https://bi9choi.notion.site/CS-9838e5c82d9449b398728e4d4da2b2bc
2. 정렬 속도  
   https://bi9choi.notion.site/CS-sort-f4f658f6497c473ab170868a0689d49e
3. Loading 표시
   .
4. Slow 3G(인터넷 속도)
   .
5. React Map에서의 Key속성으로 인한 레이아웃 성능
   .

## 궁금한 점

1. trade-info api에서 넘어오는 buySellGb는 왜 사용하지 않을까?
   1. API에서 받는 buySellGb를 사용하지않고, 클라이언트에서 직접 이전 값과 비교하여 Up Dn을 구현하고있는걸로 추정되는데 이유가 궁금합니다.
2. 웹소켓에서 ticker와 transaction 데이터가 다른 이유가 뭘까?
   1. trransaction은 체결내역이고 ticker도 결국엔 transaction과 같은 거래 내용을 표기하는 데이터인데 왜 가격이 다를까?
