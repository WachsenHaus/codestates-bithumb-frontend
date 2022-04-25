import { atom, selector } from 'recoil';
import { TypeCoinKind } from './coinList.type';
import {
  atomSelectCoinDefault,
  ISelectCoinDefault,
} from './selectCoinDefault.atom';
import {
  atomSelectCoinDetail,
  ISelectCoinDetail,
} from './selectCoinDetail.atom';

export type IDrawCoinBar = ISelectCoinDefault & ISelectCoinDetail;

const DEFAULT_DRAW_COINBAR: IDrawCoinBar = {
  // default
  coinSymbol: '',
  coinType: '',
  marketSymbol: '',
  siseCrncCd: 'C0100',
  // detail
  e: '',
  f: '',
  h: '',
  l: '',
  r: '',
  u24: '',
  v24: '',
};

export const atomDrawCoinBar = atom<IDrawCoinBar>({
  key: 'atomDrawCoinBar',
  default: DEFAULT_DRAW_COINBAR,
});

export const selectorCoinBar = selector({
  key: 'selectorCoinBar',
  get: ({ get }) => {
    const selectDefaultInfo = get(atomSelectCoinDefault);
    const selectDetailInfo = get(atomSelectCoinDetail);

    const result = {
      ...selectDefaultInfo,
      ...selectDetailInfo,
    };
    return result;
  },
});
