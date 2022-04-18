import { atom } from 'recoil';

export interface IOrderBookData {
  ask: Array<{
    p: string; // 금액
    q: string; // 수량
  }>;
  bid: Array<{
    p: string; // 금액
    q: string; // 수량
  }>;
}

export const atomOrderBook = atom<IOrderBookData>({
  key: 'AtomOrderBook',
  default: {
    ask: [],
    bid: [],
  },
});
