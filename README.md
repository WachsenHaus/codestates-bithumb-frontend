# 목차

```
0. 프로젝트 노션 링크
1. 배포링크
2. 프로젝트 실행 방법
3. 사용한 기술 스택
4. 구현한 기능 목록
5. 구현 방법 및 구현하면서 어려웠던 점
6. Prototype 소개(Figma)
7. 성능최적화
8. 과제를 통해 얻고자 했던점
9. ETC
```

## 프로젝트 노션 링크

1. 노션 [링크](https://bi9choi.notion.site/7f8eda0a78124414be50b52906833142)  
   

## 배포링크

1. www.wachsenhaus.com
![0429_last](https://user-images.githubusercontent.com/59411545/165927077-74a6c1b1-11c4-48f1-b671-18e32beaf0a3.gif)




## 프로젝트 실행 방법

```
npm i --force // npm 패키지를 인스톨해주세요
npm run start // 프로젝트를 실행해주세요.
```

## 사용한 스택
- CSS / UI 도구
  - tailwincss
  - Material UI
  - Framer.motion
  - lightweight-charts
- 자바스크립트 유틸도구
  - moment
  - immer
  - lodash
  - uuid
  - classnames
  - hangul-js
- 주 사용 프레임워크 및 라이브러리
  - React
  - Typescript
  - Recoil
- 기타 도구
  - Notion
  - Figma

## 구현한 기능 목록

1. 체결내역, 호가창, 전체코인목록에 가격반영내용이 실시간으로 애니메이션과 함께 보여집니다.
2. 원화코인, 즐겨찾기 기능이 구현되었습니다. 즐겨찾기 정보는 쿠키로 보관되면 1일의 유효기간을 가집니다.
3. 초성 검색이 지원됩니다. 한글자음,코인 심볼,코인 영문이름으로 검색이 가능합니다.

## 구현 방법 및 구현하면서 어려웠던 점

### 구현 방법

1. 처음 시험용 과제는 주어진 API를 사용하여 개발하였다면, 이번 실습 1,2,3주차 과제는 `리버스 엔지니어`링 관점으로 접근하였습니다.
   실제 빗썸에서 사용하는 `웹소켓`과 `REST API`를 `분석`하고 최대한 동일한 기능으로 구현하였습니다.

2. Recoil을 사용하였고, `atom`과 `selector`의 기능을 적극 활용하여 `데이터가 변경(구독)`된다면 자동으로 랜더링되게 구현하였습니다.

3. 컴포넌트의 **데이터 플로우 그래프**를 설계하며 진행하였습니다.  


### 어려웠던 점

1. 리액트의 **선언형 패러다임**을 따르려고 노력했습니다. 함수화하고 변수명을 짓는 부분에서 고민이 많이 되었습니다.

선언형 프로그램이란 ? 문제를 해결할때 어떻게 하는것보다 무엇을 해야되는지에 중점을 두면서 프로그램을 만드는 방법
![image](https://user-images.githubusercontent.com/59411545/165925987-54b71807-e263-48b0-97ff-a4ede885210f.png)


2. TradingVeiew의 **LightWeight** 라이브러리를 사용하였는데, Coin의 `Volume` 을 차트에 표기하려고했지만. `Y축 Value가 Coin,Volume의 단위`가 각기 달라, 표기가 깨지는 증상을 발견했습니다.
   해당이슈를 무료버전으로 해결하려고했지만. 상위 등급의 라이브러리로 변경해야되는것을 알고 포기했습니다.

3. 즐겨찾기 정보를 `Cookie`에 저장하는데 빗썸과 동일한 형태를 유지하려고 `암호화`, `복호화` 코드를 작성하는 부분이 어려웠습니다.


**최영훈 쿠키**  
![image](https://user-images.githubusercontent.com/59411545/165926172-b8f96b8d-93d3-4e06-8fed-b0d7f04c6670.png)  

**빗썸의 쿠키**  
![image](https://user-images.githubusercontent.com/59411545/165926265-b825b591-c2ca-4480-b82f-aaad0455daa8.png)  


4. **성능 이슈 recoil의 selecotr와 promise 이슈가 어려웠습니다.**

### 피그마 프로토타이핑 툴
[피그마 프로젝트 링크](https://www.figma.com/file/Ft1BxA5Psn4bW1hGd0RAgy/codestates-bithumb-frontend-%EC%B5%9C%EC%98%81%ED%9B%88?node-id=86%3A322)

컴포넌트와 초기 UI디자인을 그릴 때 사용한 툴입니다.
데이터플로우를 그리는 용도로도 사용하였습니다.
<img src="https://user-images.githubusercontent.com/59411545/165928263-3fec1b85-6c76-47dd-a055-0626ae4f3439.png" width="400" height="400">
<img src="https://user-images.githubusercontent.com/59411545/165928146-5bc8b2e6-8f11-449b-81fb-296928cb30a1.png" width="400" height="400">


# 성능 최적화 고민

1. 객체 깊은 복사  [객체깊은복사](https://bi9choi.notion.site/CS-9838e5c82d9449b398728e4d4da2b2bc)
   
2. 브라우저에서 비동기는 멀티 스레딩일까 아닐까?
   1. `promise,setTimeout`의 진짜 정체
   2. 마이크로 `태스크큐는 바쁘면 안된다.`
   3. 리코일 selector의 성능이슈  
   [노션](https://bi9choi.notion.site/3ec8074e516b4d1ca7c8d3d3f41721df)
      
3. react.memo로 성능 최적화  
   [노션](https://bi9choi.notion.site/React-memo-67dc4828e9584a5e8b3e28632f0268fd)
4. 리코일 메모리 누수  
   [노션](https://bi9choi.notion.site/eeeaae13fba142488f4ec171effdb5cd)
5. Web worker를 사용

## 개인 과제를 통해 얻고자 했던 점

| *페이스북이 만든 리액트와 리코일을 사용하면서 최적화에 집중하여 숙련도를 높여 보고싶었고, 리액트의 패러다임 선언형 프로그래밍적으로 개발하는 습관을 갖고자 하였습니다*

## 아쉬웠던 점

1. 리코일로 리액트스럽게 설계하는게 재밌었지만. 익숙치않아 오래걸렸던 점이 아쉬웠고, 참고자료가 부족한점이 아쉬웠습니다. 개발모드일때 메모리가 넘쳐나는거는 빠른시일내의 해결되었으면 좋겠습니다.
   `데이터 플로우 그래프를 설계하면서 리코일을 사용해보니` 뭔가 컴포넌트들이 더 `생동감 넘치는듯한 느낌`을 받았습니다.
   리코일이 빠른 시일내에 더 성숙해진 라이브러리가 되었으면 좋겠습니다.

2. UI 크게 신경을 쓰지 못한점이 아쉬움이 남습니다.

3. 최적화를 더 잘하고 싶었는데 조금 아쉬운듯합니다.

## 느낀점

C#으로 WPF 프로그램을 구현할 때 1초당 1000개의 데이터를 분석하고 차트를 그리는 프로그램을 만든적 있었는데  
그때는 잘 모르고 멀티스레드, 원형큐, busy flag로 이벤트루프 비슷하게 만들어서 구현한 경험이 있습니다.  
이번 프로젝트에서도 web worker를 통해 병렬처리로 최적화를 진행하면서 속도가 개선되는것을 느끼고 promise이슈를 보면서 자바스크립트의 특징을 조금은 알게 되었습니다.  
다음번에는 조금 더 욕심부려서 배열을 chunk로 나눠서 더 많은 스레드를 이용해 병렬로 처리도 해보고 싶습니다.

## 궁금한 점

1. trade-info api에서 넘어오는 buySellGb는 왜 사용하지 않을까?
   1. API에서 받는 buySellGb를 사용하지않고, 클라이언트에서 직접 이전 값과 비교하여 Up Dn을 구현하고있는걸로 추정되는데 이유가 궁금합니다.
2. 브라우저 성능탭으로 보아 빗썸의 거래소 페이지의 JS스크립트 최적화가 매우 잘 되어 있는 것 같은데 어떤 스택으로 구현되어있는지 궁금합니다.
3. 빗썸은 web worker를 사용하지 않는것으로 보여지는데 궁금합니다.
