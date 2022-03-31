import { CoinSymbolBTCTypes } from './../type/coinTypes';
import React from 'react';
import { atom } from 'recoil';
import { CoinSymbolKRWTypes } from '../type/coinTypes';
import CONST from '../const';

export interface IUserTypes {
  symbols: {
    KRW: CoinSymbolKRWTypes[];
    BTC: CoinSymbolBTCTypes[];
  };
}

// /**
//  * 사용자는 구독의 종류를
//  */
// export const userState = atom<IUserTypes>({
//   key: 'userState',
//   default: {
//     symbols: {
//       KRW: CONST.ENABLE_KRW_SYMBOL,
//       BTC: CONST.ENABLE_BTC_SYMBOL,
//     },
//   },
// });

export const userFavouriteState = atom({
  key: 'userFavouriteState',
  default: '',
});
