import React from 'react';
import { atom } from 'recoil';

/**
 * 사용자는 구독의 종류를
 */
export const userState = atom({
  key: 'userState',
  default: '',
});

export const userFavouriteState = atom({
  key: 'userFavouriteState',
  default: '',
});
