import React from 'react';
import { atom } from 'recoil';

// type: 'ticker',
// symbols: ['BTC_KRW', 'ETH_KRW'],
// tickTypes: ['30M', '1H', '12H', '24H', 'MID'],

/**
 * 사용자는 구독의 종류를
 */
export const userState = atom({
  key: 'userState',
  default: '',
});

export const userFavouriteState = atom({
  key: 'userFavouriteState',
  default: [''],
});
