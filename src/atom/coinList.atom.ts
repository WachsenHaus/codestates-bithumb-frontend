import { atom, selector } from 'recoil';

export const atomCoinList = atom<any>({
  key: 'atomCoinList',
  default: undefined,
});
