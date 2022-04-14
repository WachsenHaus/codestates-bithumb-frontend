import { TypeCoinClassCode, TypeCoinObj } from './coinList.type';
import { atom } from 'recoil';
import { TypeWebSocketTickerReturnType } from './ws.type';

export type TypeDrawTicker = {
  coinType?: string;
  coinName?: string;
  coinNameEn?: string;
  coinSymbol?: string;
  coinClassCode?: TypeCoinClassCode;
  isLive?: boolean;
} & TypeWebSocketTickerReturnType;

export const atomDrawTicker = atom<Array<TypeDrawTicker>>({
  key: 'atomDrawTicker',
  default: [],
});
