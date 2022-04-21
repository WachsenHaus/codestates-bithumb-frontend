import { atom } from 'recoil';

export type TypeOrderObj = {
  p: string; // 금액
  q: string; // 수량
};
export interface IOrderBookData {
  ask: Array<TypeOrderObj>;
  bid: Array<TypeOrderObj>;
}

export const atomOrderBook = atom<IOrderBookData>({
  key: 'AtomOrderBook',
  default: {
    ask: [],
    bid: [],
  },
});
