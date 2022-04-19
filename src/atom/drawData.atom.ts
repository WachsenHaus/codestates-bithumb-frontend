import { TypeCoinClassCode, TypeCoinKind, TypeCoinObj } from './coinList.type';
import { atom } from 'recoil';
import { TypeWebSocketTickerReturnType } from './ws.type';
import { TypeTradeTransaction } from './tradeData.atom';
import { TypeChartData } from './tvChart.atom';

export type TypeDrawTicker = {
  coinType?: string;
  coinName?: string;
  coinNameEn?: string;
  coinSymbol?: string;
  coinClassCode?: TypeCoinClassCode & 'C';
  isLive?: true;
  consonant?: string;
  isFavorite?: boolean;

  isUp?: boolean | undefined; //custom
  siseCrncCd?: TypeCoinKind;
} & TypeWebSocketTickerReturnType;

export const atomDrawTicker = atom<Array<TypeDrawTicker>>({
  key: 'AtomDrawTicker',
  default: [],
});

export const atomDrawTransaction = atom<Array<TypeTradeTransaction>>({
  key: 'AtomDrawTransaction',
  default: [],
});

export const atomDrawChart = atom<Array<TypeChartData>>({
  key: 'AtomDrawChart',
  default: [],
});

export const atomDrawCoinInfo = atom<TypeDrawTicker>({
  key: 'AtomDrawCoinInfo',
  default: {
    a: '', //변화금액
    c: '', //코인번호
    e: '', //현재가
    f: '', //f전일가
    h: '', //고가(당일)
    k: '', //MID
    l: '', //저가(당일)
    m: '', //원화코인
    o: '', //?시작가로 추정됨
    r: '', //변동률(퍼센트)
    u: '', //거래금액
    u24: '', //24시간 거래금액
    v: '', //거래량
    v24: '', //24시간 거래량
    w: '', // 모르겠음
  },
});
