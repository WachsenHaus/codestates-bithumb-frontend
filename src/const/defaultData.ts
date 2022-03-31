import {
  IOrderBookDepthTypes,
  IOrderBookReceiverTypes,
  ITickerReceiverTypes,
  ITickerTypes,
  ITransactionReceiverTypes,
  ITransactionTypes,
} from '../atom/user.atom';

export const DEFAULT_TICKER_SOCKET: ITickerTypes = {
  type: 'ticker',
  symbols: ['BTC_KRW'],
  tickTypes: ['30M'],
};

export const DEFAULT_TICKER_RECEIV_DATA: ITickerReceiverTypes = {
  type: 'ticker',
  content: {
    symbol: '', // 통화코드
    tickType: '', // 변동 기준시간- 30M, 1H, 12H, 24H, MID
    date: '', // 일자
    time: '', // 시간
    openPrice: '', // 시가
    closePrice: '', // 종가
    lowPrice: '', // 저가
    highPrice: '', // 고가
    value: '', // 누적거래금액
    volume: '', // 누적거래량
    sellVolume: '', // 매도누적거래량
    buyVolume: '', // 매수누적거래량
    prevClosePrice: '', // 전일종가
    chgRate: '', // 변동률
    chgAmt: '', // 변동금액
    volumePower: '', // 체결강도
  },
};

export const DEFAULT_ORDERBOOK_DEPTH_SOCKET: IOrderBookDepthTypes = {
  type: 'orderbookdepth',
  symbols: ['BTC_KRW'],
};
export const DEFAULT_ORDERBOOK_DEPTH_RECEIV_DATA: IOrderBookReceiverTypes = {
  type: 'orderbookdepth',
  content: {
    list: [
      {
        symbol: '',
        orderType: 'ask',
        price: '',
        quantity: '',
        total: '',
      },
    ],
    datetime: '',
  },
};
export const DEFAULT_TRANSACTION_SOCKET: ITransactionTypes = {
  type: 'transaction',
  symbols: ['BTC_KRW'],
};
export const DEFAULT_TRANSACTION_RECEIV_DATA: ITransactionReceiverTypes = {
  type: 'transaction',
  content: {
    list: [
      {
        symbol: '', // 통화코드
        buySellGb: '', // 체결종류(1:매도체결, 2:매수체결)
        contPrice: '', // 체결가격
        contAmt: '', // 체결수량
        contDtm: '', // 체결금액
        updn: '', // 직전 시세와 비교 up-상승, dn-하락
      },
    ],
  },
};
