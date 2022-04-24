import { atom } from 'recoil';

export interface ISelectCoinDetail {
  r?: string;
  e?: string;
  v24?: string;
  u24?: string;
  h?: string;
  l?: string;
  f?: string;
}

export const DEFAULT_SELECT_COIN_DETAIL: ISelectCoinDetail = {
  r: '',
  e: '',
  v24: '',
  u24: '',
  h: '',
  l: '',
  f: '',
};
export const atomSelectCoinDetail = atom({
  key: 'atomSelectCoinDetail',
  default: DEFAULT_SELECT_COIN_DETAIL,
});
