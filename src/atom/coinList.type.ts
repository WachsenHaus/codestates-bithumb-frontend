export type TypeCoinKind = 'C0100 | C0101';
export type TypeCoinName = '원화';
export type TypeCoinNameEn = 'KRW';
export type TypeCoinClassCode = 'F' | 'C';

// "coinType": "C0100",
// "coinClassCode": "F",
// "coinSymbol": "KRW",
// "coinName": "원화",
// "coinNameEn": "KRW",
// "decimalDigits": 6,
// "canDeposit": true,
// "canWithdrawal": true,
// "displayInOut": true,
// "hasSecondAddr": false,
// "secondAddrName": "",
// "secondAddrNameEn": "",
// "siseCrncCd": "-",
// "isLive": false

export type TypeCoinObj = {
  coinType: TypeCoinKind;
  coinClassCode: TypeCoinClassCode;
  coinName: TypeCoinName;
  coinNameEn: TypeCoinNameEn;
  decimalDigits: number;
  canDeposit: boolean;
  canWithdrawal: boolean;
  displayInOut: boolean;
  hasSecondAddr: boolean;
  secondAddrName: string;
  secondAddrNameEn: string;
  siseCrncCd: string;
  isLive: boolean;
};

// "crncCd": "C0100",
// "marketSymbol": "KRW",
// "minFeeAmt": "0.01",
// "marketSiseOrd": "1",
// "isOpened": true
export type TypeMarketObj = {
  crncCd: TypeCoinKind;
  marketSymbol: 'KRW' | 'BTC' | 'ETH';
  minFeeAmt: string;
  marketSiseOrd: string;
  isOpened: boolean;
};

export interface ICoinList {
  version: string;
  coinList: Array<TypeCoinObj>;
  marketList: string;
  coinsOnMarketList: string;
}
