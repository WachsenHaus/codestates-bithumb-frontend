export type TypeWebSocketTypes = 'SUBSCRIBE';

/**
 * tr : 트랜잭션
 * tk : 티커
 * st : 캔들스틱
 */
export type TypeWebSocketDetailTypes = 'tr' | 'tk' | 'st';

export type TypeWebSocketDetailObj = {
  filters: string[];
  type: TypeWebSocketDetailTypes;
};

export type TypeWebSocketSubscribeReturnType = {
  type: string;
  subtype: TypeWebSocketDetailTypes;
  content: any;
};

export interface IWebSocketSubscribeMessage {
  events: TypeWebSocketDetailObj[];
  type: TypeWebSocketTypes;
}

export type TypeWebSocketTickerReturnType = {
  a?: string; //변화금액
  c?: string; //코인번호
  e?: string; //현재가
  f?: string; //f전일가
  h?: string; //고가(당일)
  k?: string; //MID
  l?: string; //저가(당일)
  m?: string; //원화코인
  o?: string; //?시작가로 추정됨
  r?: string; //변동률(퍼센트)
  u?: string; //거래금액
  u24?: string; //24시간 거래금액
  v?: string; //거래량
  v24?: string; //24시간 거래량
  w?: string; // 모르겠음
};

// export interface IWebSocketTickerRetrun extends TypeWebSocketTickerReturnType {}
