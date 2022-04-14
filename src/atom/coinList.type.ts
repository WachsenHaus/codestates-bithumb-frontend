export type TypeCoinKind = 'C0100 | C0101';
export type TypeCoinName = '원화';
export type TypeCoinNameEn = 'KRW';
export type TypeCoinClassCode = 'F' | 'C';

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
export type TypeMarketObj = {
  crncCd: TypeCoinKind;
  marketSymbol: 'KRW' | 'BTC' | 'ETH';
  minFeeAmt: string;
  marketSiseOrd: string;
  isOpened: boolean;
};
export type TypeCoinsOnMaretListObj = {
  crncCd: string;
  coinType: string;
  canTrad: boolean;
  hasEven: boolean;
  coinSymbol: string;
  coinName: string;
  coinNameEn: string;
  closeExceptedDate: number;
  sellOpenDate: string;
  buyOpenDate: string;
  listedLowerLimitRate: number;
  listedUpperLimitRate: number;
  listedPrice: number;
  disClosur: boolean;
  topFixedNe: boolean;
  isListedNe: boolean;
  isStakin: boolean;
  isInvestmen: boolean;
  isKakaoPixe: boolean;
};

export interface ICoinList {
  version: string;
  coinList: Array<TypeCoinObj>;
  marketList: Array<TypeMarketObj>;
  coinsOnMarketList: {
    [key in TypeCoinKind]: Array<TypeCoinsOnMaretListObj>;
  };
}
