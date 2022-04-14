import { atom } from 'recoil';

export const atomSelectCoin = atom<any | undefined>({
  key: 'atomCoinList',
  default: undefined,
});
