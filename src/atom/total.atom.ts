import { atom } from 'recoil';

// 1. draw atom은 ticker, coinBar, chart, orderbook,transaction 총 다섯개이다.
// 각 요소들에서 그리기위한 정보는 다음과 같다.

// ticker에서 받아오는 정보이다.
// u24
// r
// e
// a
// isFavorite
// 코인리스트에서 받아오는 기본정보이다.
// coinType: TypeCoinKind;
// coinClassCode: TypeCoinClassCode;
// coinSymbol: string;
// coinName: string;
// coinNameEn: string;
// decimalDigits: number;
// canDeposit: boolean;
// canWithdrawal: boolean;
// displayInOut: boolean;
// hasSecondAddr: boolean;
// secondAddrName: string;
// secondAddrNameEn: string;
// siseCrncCd: TypeCoinKind;
// isLive: boolean;

export const atomDrawTicker = atom({
  key: 'atomDrawTicker',
  default: undefined,
});

export const atomDrawCoinBar = atom({
  key: 'atomDrawCoinBar',
  default: undefined,
});

export const atomDrawChart = atom({
  key: 'atomDrawChart',
  default: undefined,
});

export const atomDrawOrderBook = atom({
  key: 'atomDrawOrderBook',
  default: undefined,
});

export const atomDrawTransaction = atom({
  key: 'atomDrawTransaction',
  default: undefined,
});
