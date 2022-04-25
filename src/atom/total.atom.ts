import { TypeCoinKind, TypeCoinClassCode } from './coinList.type';
import { atom, selector } from 'recoil';
import { generateKeywordForSearch, getCookie, order, unpackCookie } from '../utils/utils';
import { atomCoinList } from './coinList.atom';
import { TypeDrawTicker } from './drawData.atom';
import { TypeWebSocketTickerReturnType, TypeWebSocketTransactionReturnType } from './ws.type';
import _ from 'lodash';
import { TypeTradeTransaction } from './tradeData.atom';

// 1. draw atom은 ticker, coinBar, chart, orderbook,transaction 총 다섯개이다.
// 각 요소들에서 그리기위한 정보는 다음과 같다.

// ticker 웹소켓에서 받아오는 정보이다.
// u24 // 거래금액
// r // chgRate
// e // closePrice
// a // chgAmt 변동금액

// 필터링하면서 추가될 정보들이다.
// isFavorite // 즐겨찾기 유무
// consonant?: string; // 검색용 단어
// isUp?: boolean | undefined; // 변동률 색상.

// 코인리스트에서 받아오는 기본정보이다. 여기서 필요한 정보만을 넣을까?
// coinType: TypeCoinKind;  // ex)C0103
// coinClassCode: TypeCoinClassCode; // ex)"C", "F"
// coinSymbol: string; // ex) 'DASH',
// coinName: string; // ex)'대시'
// coinNameEn: string; // ex)'Dash',
// decimalDigits: number; // ex) 8
// canDeposit: boolean; // ex) false
// canWithdrawal: boolean;
// displayInOut: boolean;
// hasSecondAddr: boolean;
// secondAddrName: string; // ''
// secondAddrNameEn: string; // ''
// siseCrncCd: TypeCoinKind; // '-','C0100'
// isLive: boolean;

export const atomDrawTicker = atom({
  key: 'atomDrawTicker',
  default: undefined,
});

// coinType
// coinSymbol
// coinName
// coinNameEn
// r //변동률 chgRate
// e //현재 금액 closePrice
// v24 //거래량(24H)  volume24H
// u24 //거래금액(24H) value24H
// h //고가(당일) highPrice
// l //저가(당일) lowPrice
// f //전일종가 closePrice

export const atomDrawChart = atom({
  key: 'atomDrawChart',
  default: undefined,
});

export const atomDrawOrderBook = atom({
  key: 'atomDrawOrderBook',
  default: undefined,
});

export const atomDrawTransaction = atom<Array<TypeTradeTransaction>>({
  key: 'atomDrawTransaction',
  default: [],
});

export const atomFinalTransaction = atom<Array<TypeTradeTransaction>>({
  key: 'atomFinalTransaction',
  default: [],
});
export interface IDisplayCoinsFilter {
  isLive: boolean;
  coinClassCode: TypeCoinClassCode;
  siseCrncCd: TypeCoinKind;
}
export const atomDisplayCoinsFilter = atom<IDisplayCoinsFilter>({
  key: 'atomDisplayCoinsFilter',
  default: {
    isLive: true,
    coinClassCode: 'C',
    siseCrncCd: 'C0100',
  },
});

export type TypefilterMode = 'normal' | 'isFavorite';

export const atomFilterMode = atom<TypefilterMode>({
  key: 'atomFilterMode',
  default: 'normal',
});

export const atomFilterKeyword = atom<string>({
  key: 'atomFilterKeyword',
  default: '',
});
export const atomFilterOrderBy = atom<'e' | 'r' | 'u24'>({
  key: 'atomFilterOrderBy',
  default: 'e',
});
export const atomFilterDirection = atom<'desc' | 'asc'>({
  key: 'atomFilterDirection',
  default: 'desc',
});
export const atomUseCoins = atom<TypeDrawTicker[]>({
  key: 'atomUseCoins',
  default: [],
});

export const atomPriceInfoUseCoins = atom<TypeDrawTicker[]>({
  key: 'atomPriceInfoUseCoins',
  default: [],
});

export const atomTickers = atom<TypeWebSocketTickerReturnType>({
  key: 'atomTickers',
  default: {},
});

export const atomTransactions = atom<TypeWebSocketTransactionReturnType>({
  key: 'atomTransactions',
  default: {
    m: 'C0100',
    c: '',
    l: [],
  },
});

export const atomFilteredCoins = atom<TypeDrawTicker[]>({
  key: 'atomFilteredCoins',
  default: [],
});

export const atomFinalCoins = atom<TypeDrawTicker[]>({
  key: 'atomFinalCoins',
  default: [],
});

// 해당 티커가 갱신될때,
export const selectorMergeTickerAndCoins = selector({
  key: 'selectorMergeTickerAndCoins',
  get: async ({ get }) => {
    const tickerObj = get(atomTickers);
    const coins = get(atomFilteredCoins);
    const result = new Promise<TypeDrawTicker[]>((resolve, reject) => {
      const isExist = coins.findIndex((item) => item.coinType === tickerObj.c);
      if (isExist === -1) {
        resolve(coins);
        return;
      } else if (tickerObj.m === 'C0101') {
        resolve(coins);
      } else {
        const draft = _.cloneDeep(coins);
        let isUp;
        const currentPrice = Number(tickerObj.e);
        const prevPrice = Number(draft[isExist].e);
        if (currentPrice > prevPrice) {
          isUp = true;
        } else if (currentPrice === prevPrice) {
          isUp = undefined;
        } else {
          isUp = false;
        }
        draft[isExist] = { ...draft[isExist], ...tickerObj, isUp };
        resolve(draft);
      }
    });
    return result;
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

/**
 * 가격정보가 포함되고 사용중인 코인목록을 의존하면서, keyword와 mode, orderby로 필터링을 하는 함수
 */
export const selectorPriceFilterdCoins = selector({
  key: 'selectorPriceFilterdCoins',
  get: async ({ get }) => {
    const filterMode = get(atomFilterMode);
    const filterKeyword = get(atomFilterKeyword);
    const orderBy = get(atomFilterOrderBy);
    const direction = get(atomFilterDirection);
    const prevUseCoins = get(atomPriceInfoUseCoins);

    const result = new Promise<TypeDrawTicker[]>((resolve, reject) => {
      let resultUseCoins;

      if (filterMode === 'normal') {
        if (filterKeyword === '') {
          resultUseCoins = prevUseCoins;
        } else {
          resultUseCoins = _.filter(prevUseCoins, (i) => i.consonant?.toLowerCase().indexOf(filterKeyword) !== -1);
        }
      } else {
        if (filterKeyword === '') {
          resultUseCoins = _.filter(prevUseCoins, (i) => i.isFavorite === true);
        } else {
          resultUseCoins = _.filter(prevUseCoins, (i) => i.isFavorite === true && i.consonant?.toLowerCase().indexOf(filterKeyword) !== -1);
        }
      }
      const result = order(orderBy, resultUseCoins, direction);
      resolve(result);
    });
    return result;
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

/**
 * 표시하려는 코인만 추리는 셀렉터
 */
export const selectorFilterUseCoins = selector({
  key: 'selectorFilterUseCoins',
  get: async ({ get }) => {
    const defaultInfoCoins = get(atomCoinList);
    const displayFilter = get(atomDisplayCoinsFilter);

    const result = new Promise<TypeDrawTicker[]>((resolve, reject) => {
      const useFilterCoins = defaultInfoCoins?.coinList.filter(
        (item) => item.coinClassCode === displayFilter.coinClassCode && item.siseCrncCd === displayFilter.siseCrncCd && item.isLive === displayFilter.isLive
      );
      const cookieFavorites = getCookie('marketFavoritesCoin');
      const unPackCookie = unpackCookie(cookieFavorites);

      const resultCoins = useFilterCoins?.map((item) => {
        const consonant = generateKeywordForSearch({
          coinName: item.coinName,
          coinNameEn: item.coinNameEn,
          coinSymbol: item.coinSymbol,
        });
        const cookieCoinSymbol = unPackCookie.find((i) => i.split('_')[0] === item.coinType);
        return {
          isFavorite: cookieCoinSymbol ? true : false,
          siseCrncCd: item.siseCrncCd,
          coinClassCode: item.coinClassCode,
          coinName: item.coinName,
          coinNameEn: item.coinNameEn,
          coinSymbol: item.coinSymbol,
          coinType: item.coinType,
          isLive: item.isLive,
          consonant,
        };
      });
      if (resultCoins) {
        resolve(resultCoins as TypeDrawTicker[]);
      }
    });
    return result;
  },

  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

export const selectorWebSocketTransaction = selector({
  key: 'selectorWebSocketTransaction',
  get: async ({ get }) => {
    const transaction = get(atomTransactions);
    const drawTransaction = get(atomDrawTransaction);
    if (transaction === undefined && drawTransaction === undefined) {
      return;
    }
    const deepCopyDrawTransaction = _.cloneDeep(drawTransaction);
    if (transaction === undefined) {
      return;
    }
    const { m, c, l } = transaction;
    let coinbarPrice;
    for (let i = 0; i < l.length; i++) {
      const { o, n, p, q, t } = transaction.l[i];
      let color = '1';
      let prevPrice;
      const lastItem = deepCopyDrawTransaction[deepCopyDrawTransaction.length - 1];
      if (lastItem) {
        prevPrice = lastItem.contPrice;
        if (p === prevPrice) {
          color = lastItem.buySellGb;
        } else if (p > prevPrice) {
          color = '2';
        } else {
          color = '1';
        }
      }

      deepCopyDrawTransaction.push({
        coinType: c, //
        contAmt: n, //
        crncCd: m, //
        buySellGb: color,
        contPrice: p, //현재가
        contQty: q, // 수량
        contDtm: t, //
      });

      // 트랜잭션은 20개의 데이터만 보관함.
      if (deepCopyDrawTransaction.length > 20) {
        deepCopyDrawTransaction.shift();
      }
    }

    return await { deepCopyDrawTransaction, coinbarPrice };
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});
