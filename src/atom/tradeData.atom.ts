import { TypeCoinKind } from './coinList.type';
import { atomSelectCoin } from './selectCoin.atom';
import axios from 'axios';
import { atom, selector } from 'recoil';
import { ResponseVO } from '../type/api';
import { Log } from '../utils/log';
import { API_BITHUMB } from './../api/bt.api';

export type TypeTradeTikcer = {
  crncCd: TypeCoinKind;
  coinType: string;
  tickType: string; //변동 기준시간 - 30M, 1H,12H,24H,MID
  date: string; //일자
  time: string; //시간
  openPrice: string; //시가
  closePrice: string; //종가
  lowPrice: string; //저가
  highPrice: string; //고가
  value: string; //누적거래금액
  volume: string; //누적 거래량
  sellVolume: string; //매도누적거래량
  buyVolume: string; //매수누적거래량
  prevClosePrice: string; //전일종가
  chgRate: string; //변동률
  chgAmt: string; //변동금액
  volumePower: string; //체결강도
  volume24H: string; //24시간 거래금액
  value24H: string;
  volumePower24H: string; //24시간 체결강도
};

export type TypeTradeTransaction = {
  crncCd: TypeCoinKind;
  coinType: string;
  buySellGb: string;
  contPrice: string;
  contQty: string;
  contAmt: string;
  contDtm: string;
};

export type ITradeData = {
  [key in TypeCoinKind]: {
    ticker: {
      [key in string]: TypeTradeTikcer;
    };
    transaction: {
      [key in string]: TypeTradeTransaction[];
    };
  };
};

export const forceReloadTradeData = atom<number | undefined>({
  key: 'ForceReloadTradeData',
  default: 0,
});

export const atomTradeData = selector({
  key: 'AtomTradeData',
  get: async ({ get }) => {
    try {
      get(forceReloadTradeData);
      const url = {
        type: 'custom',
        crncCd: get(atomSelectCoin).siseCrncCd,
        coin: get(atomSelectCoin).coinType,
        lists: {
          ticker: { coinType: 'ALL', tickType: 'MID' },
          transaction: { limit: 31 },
        },
      };
      const result = await axios.get<ResponseVO<ITradeData>>(
        `${API_BITHUMB.GET_TRADE_DATA}`,
        {
          params: url,
        }
      );
      return result.data;
    } catch (err) {
      Log(err);
      return undefined;
      // return
    }
  },
  set: ({ set }) => {
    console.log('set');
    set(forceReloadTradeData, Math.random());
  },
});
