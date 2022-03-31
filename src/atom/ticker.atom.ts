import React from 'react';
import { atom } from 'recoil';
import { CoinSymbolTypes, TickTypes } from '../type/coinTypes';

// type: 'ticker',
// symbols: ['BTC_KRW', 'ETH_KRW'],
// tickTypes: ['30M', '1H', '12H', '24H', 'MID'],

export interface ITickerTypes {
  type: 'ticker';
  symbols: CoinSymbolTypes[];
  tickTypes: TickTypes[];
}

/**
 * 현재 클라이언의 초기값 상태.
 */
export const tickerState = atom<ITickerTypes>({
  key: 'tickerState',
  default: {
    type: 'ticker',
    symbols: ['BTC_KRW'],
    tickTypes: ['30M'],
  },
});

export const userFavouriteState = atom({
  key: 'userFavouriteState',
  default: '',
});
