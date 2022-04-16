import React from 'react';
import { atom, selector } from 'recoil';
import CONST from '../const';
import {
  CoinSymbolKRWTypes,
  CoinSymbolBTCTypes,
  TickTypes,
} from '../type/coinTypes';

export type SocketNamesType =
  | 'ticker'
  | 'orderbookdepth'
  | 'transaction'
  | 'SUBSCRIBE';
export interface ITickerSenderTypes {
  type: 'ticker';
  symbols: CoinSymbolKRWTypes[] | CoinSymbolBTCTypes[];
  tickTypes: TickTypes[];
}
export interface ITickerReceiverTypes {
  type: 'ticker';
  content: {
    symbol: string; // 통화코드
    tickType: string; // 변동 기준시간 - 30M, 1H, 12H ,24H, MID
    date: string; // 일자
    time: string; // 시간
    openPrice: string; // 시가
    closePrice: string; // 종가
    lowPrice: string; // 저가
    highPrice: string; // 고가
    value: string; // 누적거래금액
    volume: string; // 누적거래량
    sellVolume: string; // 매도누적거래량
    buyVolume: string; // 매수누적거래량
    prevClosePrice: string; // 전일종가
    chgRate: string; // 변동률
    chgAmt: string; // 변동금액
    volumePower: string; // 체결강도
  };
}
export interface IOrderBookDepthSenderTypes {
  type: 'orderbookdepth';
  symbols: CoinSymbolKRWTypes[] | CoinSymbolBTCTypes[];
}

export type OrderBookReceiverListType = {
  symbol: string;
  orderType: 'ask' | 'bid'; // 주문타입 - ask(매도) bid(매수)
  price: string; // 호가
  quantity: string; // 잔량
  total: string; // 건수
};
export interface IOrderBookReceiverTypes {
  type: 'orderbookdepth';
  content: {
    list: Array<OrderBookReceiverListType>;
    datetime: string; // 일시
  };
}
export interface ITransactionSenderTypes {
  type: 'transaction';
  symbols: CoinSymbolKRWTypes[] | CoinSymbolBTCTypes[];
}
export type TransactionReceiverListType = {
  symbol: string; // 통화코드
  buySellGb: string; // 체결종류(1:매도체결, 2:매수체결)
  contPrice: string; // 체결가격
  contQty: string; //체결수량
  contAmt: string; // 체결금액
  contDtm: string; // 체결시각
  updn: string; // 직전 시세와 비교 up-상승, dn-하락
};

export interface ITransactionReceiverTypes {
  type: 'transaction';
  content: {
    list: Array<TransactionReceiverListType>;
  };
}

// export type SocketNamesType = 'ticker' | 'orderbookdepth' | 'transaction';

// export type SocketType = {
//   identifiler: SocketNamesType;
//   // 웹 소캣 객체
//   ws: WebSocket | undefined;
//   // 보내는 웹소캣 내용
//   senderType: ITickerTypes | IOrderBookDepthTypes | ITransactionTypes;
//   // 받는 내용을 담는 배열
//   receiverType:
//     | ITickerReceiverTypes
//     | IOrderBookReceiverTypes
//     | ITransactionReceiverTypes;
// };
export interface ISimbolsTypes {
  symbols: {
    KRW: CoinSymbolKRWTypes[];
    BTC: CoinSymbolBTCTypes[];
  };
}

/**
 *  socket은 배열로 N개를 가지지만. type이 중복된다면 추가를 하지 않는다.
 */
export const atomSimbolsState = atom<ISimbolsTypes>({
  key: 'atomSimbolsState',
  default: {
    symbols: {
      KRW: CONST.ENABLE_KRW_SYMBOL,
      BTC: CONST.ENABLE_BTC_SYMBOL,
    },
  },
});

/**
 * 티커
 */
export const tickerSocketState = atom<WebSocket | undefined>({
  key: 'tickerSocketState',
  default: undefined,
});

export const tickerReceiveState = atom<ITickerReceiverTypes>({
  key: 'tickerReceiveState',
  default: CONST.DEFAULT_TICKER_RECEIV_DATA,
});

export const tickerSenderState = atom<ITickerSenderTypes>({
  key: 'tickerSenderState',
  default: CONST.DEFAULT_TICKER_SENDER,
});

/**
 * orderbookdepth
 */
export const orderbookdepthSocketState = atom<WebSocket | undefined>({
  key: 'orderbookdepthSocketState',
  default: undefined,
});

export const orderbookdepthReceiveState = atom<IOrderBookReceiverTypes>({
  key: 'orderbookdepthReceiveState',
  default: CONST.DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA,
});

export const orderbookdepthSenderState = atom<IOrderBookDepthSenderTypes>({
  key: 'orderbookdepthSenderState',
  default: CONST.DEFAULT_ORDERBOOK_DEPTH_SENDER,
});

/**
 * transaction
 */
export const transactionSocketState = atom<WebSocket | undefined>({
  key: 'transactionSocketState',
  default: undefined,
});

export const transactionReceiveState = atom<ITransactionReceiverTypes>({
  key: 'transactionReceiveState',
  default: CONST.DEFAULT_TRANSACTION_RECEIV_DATA,
});

export const transactionSenderState = atom<ITransactionSenderTypes>({
  key: 'transactionSenderState',
  default: CONST.DEFAULT_TRANSACTION_SENDER,
});

// /**
//  *  socket은 배열로 N개를 가지지만. type이 중복된다면 추가를 하지 않는다.
//  */
// export const atomSocketsState = atom<Array<SocketType>>({
//   key: 'atomSimbolsState',
//   default: [],
// });

// export const atomSocketIdentifier = atom<SocketNamesType>({
//   key: 'atomSocketIdentifier',
//   default: 'ticker',
// });

/**
 *
 */

// export type AtomWebSocketTypes = WebSocket;

// export const atomWebSocketState = atom<AtomWebSocketTypes[] | undefined>({
//   key: 'userWebSocketState',
//   default: undefined,
// });
// export const atomFavouriteState = atom({
//   key: 'userFavouriteState',
//   default: [''],
// });

export const atomUserSelectCoin = atom<{
  crncCd: string;
  coin: string;
}>({
  key: 'AtomUserSelectCoin',
  default: {
    crncCd: 'C0100',
    coin: 'C0101',
  },
});
