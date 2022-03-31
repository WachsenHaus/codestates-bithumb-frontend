import { CoinSymbolBTCTypes } from './../type/coinTypes';
import React from 'react';
import { atom } from 'recoil';
import { CoinSymbolKRWTypes, TickTypes } from '../type/coinTypes';
import { ITickerTypes } from './user.atom';
import CONST from '../const';

/**
 * 현재 클라이언의 초기값 상태.
 */
export const atomTickerState = atom<ITickerTypes>({
  key: 'tickerState',
  default: CONST.DEFAULT_TICKER_SOCKET,
});

export const atomUserFavouriteState = atom({
  key: 'userFavouriteState',
  default: '',
});
