import { TypeCoinClassCode, TypeCoinKind, TypeCoinObj } from './coinList.type';
import { atom } from 'recoil';
import { TypeWebSocketTickerReturnType } from './ws.type';

export type TypeDrawTicker = {
  coinType?: TypeCoinKind;
  coinName?: string;
  coinNameEn?: string;
  coinSymbol?: string;
  coinClassCode?: TypeCoinClassCode & 'C';
  isLive?: true;
} & TypeWebSocketTickerReturnType;

export const atomDrawTicker = atom<Array<TypeDrawTicker>>({
  key: 'AtomDrawTicker',
  default: [],
});
