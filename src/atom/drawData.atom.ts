import { TypeCoinClassCode, TypeCoinKind, TypeCoinObj } from './coinList.type';
import { atom } from 'recoil';
import { TypeWebSocketTickerReturnType } from './ws.type';
import { TypeTradeTransaction } from './tradeData.atom';

export type TypeDrawTicker = {
  coinType?: string;
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

export const atomDrawTransaction = atom<Array<TypeTradeTransaction>>({
  key: 'AtomDrawTransaction',
  default: [],
});