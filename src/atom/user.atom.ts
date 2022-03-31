import React from 'react';
import { atom, selector } from 'recoil';
import CONST from '../const';
import { CoinSymbolKRWTypes, CoinSymbolBTCTypes, TickTypes } from '../type/coinTypes';

export interface ITickerTypes {
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
export interface IOrderBookDepthTypes {
  type: 'orderbookdepth';
  symbols: CoinSymbolKRWTypes[] | CoinSymbolBTCTypes[];
}
export interface IOrderBookReceiverTypes {
  type: 'orderbookdepth';
  content: {
    list: [
      {
        symbol: string;
        orderType: 'ask' | 'bid'; // 주문타입 - bit / ask
        price: string; // 호가
        quantity: string; // 잔량
        total: string; // 건수
      }
    ];
    datetime: string; // 일시
  };
}
export interface ITransactionTypes {
  type: 'transaction';
  symbols: CoinSymbolKRWTypes[] | CoinSymbolBTCTypes[];
}

export interface ITransactionReceiverTypes {
  type: 'transaction';
  content: {
    list: [
      {
        symbol: string; // 통화코드
        buySellGb: string; // 체결종류(1:매도체결, 2:매수체결)
        contPrice: string; // 체결가격
        contAmt: string; // 체결수량
        contDtm: string; // 체결금액
        updn: string; // 직전 시세와 비교 up-상승, dn-하락
      }
    ];
  };
}

export type SocketNamesType = 'ticker' | 'orderbookdepth' | 'transaction';

export type SocketType = {
  identifiler: SocketNamesType;
  // 웹 소캣 객체
  ws: WebSocket | undefined;
  // 보내는 웹소캣 내용
  senderType: ITickerTypes | IOrderBookDepthTypes | ITransactionTypes;
  // 받는 내용을 담는 배열
  receiverType: ITickerReceiverTypes | IOrderBookReceiverTypes | ITransactionReceiverTypes;
};
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
 *  socket은 배열로 N개를 가지지만. type이 중복된다면 추가를 하지 않는다.
 */
export const atomSocketsState = atom<Array<SocketType>>({
  key: 'atomSimbolsState',
  default: [],
});
export const atomFixSocketsState = selector<Array<SocketType>>({
  key: 'FilteredDailyState',
  get: ({ get }) => {
    const dailyInfo = get(atomSocketsState);
    return dailyInfo;
  },
  set: ({ set }, newValue) => {
    return set(atomSocketsState, (oldState) => {
      return {
        ...oldState,
        ...newValue,
      };
    });
  },
});

/**
 *
 */

export type AtomWebSocketTypes = WebSocket;

export const atomWebSocketState = atom<AtomWebSocketTypes[] | undefined>({
  key: 'userWebSocketState',
  default: undefined,
});
export const atomFavouriteState = atom({
  key: 'userFavouriteState',
  default: [''],
});