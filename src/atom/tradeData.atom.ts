import { TypeCoinKind } from './coinList.type';

import axios from 'axios';
import { atom, selector } from 'recoil';
import { ResponseVO } from '../type/api';
import { Log } from '../utils/log';
import { API_BITHUMB, API_BITHUMB_STATUS_CODE } from './../api/bt.api';
import {
  atomSelectCoinDetail,
  ISelectCoinDetail,
} from './selectCoinDetail.atom';
import _ from 'lodash';
import produce from 'immer';
import { atomSelectCoinDefault } from './selectCoinDefault.atom';
import { atomUseCoins } from './total.atom';

export type TypeTradeTikcer = {
  crncCd: TypeCoinKind; // 'C0100"
  coinType: string; //"C0102"
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
  volume24H: string; //24시간 거래량
  value24H: string; // 24시간 거래금액
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
export const atomTradeData = atom<ITradeData | undefined>({
  key: 'atomTradeData',
  default: undefined,
});

export const selectorTradeData = selector({
  key: 'selectorTradeData',
  get: async ({ get }) => {
    try {
      const { siseCrncCd, coinType } = get(atomSelectCoinDefault);
      if (coinType === '') {
        return;
      }
      console.log('무한반복?');
      console.log(coinType);
      const url = {
        type: 'custom',
        crncCd: siseCrncCd,
        coin: coinType,
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
    }
  },

  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

export const selectPriceInfoToCoins = selector({
  key: 'selectPriceInfoToCoins',
  get: ({ get }) => {
    const tradeData = get(atomTradeData);
    const selectDefaultCoin = get(atomSelectCoinDefault);
    const useCoins = get(atomUseCoins);
    if (tradeData === undefined) {
      return;
    }

    const tickerData = tradeData[selectDefaultCoin.siseCrncCd]['ticker'];
    const tickerKeys = Object.keys(tickerData);
    let detailObj: ISelectCoinDetail = {};

    const cloneUseCoin = _.clone(useCoins);
    for (let i = 0; i < tickerKeys.length; i++) {
      const {
        coinType,
        buyVolume,
        chgAmt,
        chgRate,
        openPrice,
        volume24H,
        value24H,
        prevClosePrice,
        highPrice,
        lowPrice,
        closePrice,
      } = tickerData[tickerKeys[i]];
      const isExist = cloneUseCoin.findIndex(
        (item) => item.coinType === coinType
      );
      if (coinType === selectDefaultCoin.coinType) {
        detailObj = {
          e: closePrice,
          u24: value24H,
          v24: volume24H,
          h: highPrice,
          r: chgRate,
          l: lowPrice,
          f: prevClosePrice,
        };
      }
      if (isExist === -1) {
      } else {
        cloneUseCoin[isExist] = {
          ...cloneUseCoin[isExist],
          u24: value24H,
          r: chgRate,
          e: closePrice,
          a: chgAmt,
        };
      }
    }

    const result = cloneUseCoin;
    return { result, detailObj };
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

export const selectTransactionInfoToCoins = selector({
  key: 'selectTransactionInfoToCoins',
  get: ({ get }) => {
    const tradeData = get(atomTradeData);
    const selectDefaultCoin = get(atomSelectCoinDefault);
    if (tradeData === undefined) {
      return;
    }

    const transactionData =
      tradeData[selectDefaultCoin.siseCrncCd]['transaction'];
    const transactionKeys = Object.keys(transactionData);

    const keys = transactionData[transactionKeys[0]];
    const next = produce(keys, (draft) => {
      let color;
      for (let i = 0; i < draft.length; i++) {
        if (i !== 0) {
          const prevPrice = draft[i - 1].contPrice;
          const curPrice = draft[i].contPrice;
          if (curPrice === prevPrice) {
            color = draft[i - 1].buySellGb;
          } else if (curPrice > prevPrice) {
            color = '2';
          } else {
            color = '1';
          }
          draft[i].buySellGb = color;
        }
      }
    });
    return next;
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});
