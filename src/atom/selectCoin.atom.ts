import { atom } from 'recoil';
import { TypeCoinKind } from './coinList.type';

//coinType 코인의 고유 번호
//siseCrncCd 코인이 등록된시장
//chartTime 1M 차트에서 보고싶은 데이터

interface ISelectCoin {
  coinType: string;
  siseCrncCd: TypeCoinKind;
  chartTime: string;
  coinSymbol: string;
  marketSymbol: string;
  e?: string; // 현재가
  v24?: string; // 거래량 24
  u24?: string; // 거래금액 24
  h?: string; // 고가
  l?: string; // 저가
  f?: string; // 전일종가
}

export const atomSelectCoin = atom<ISelectCoin>({
  key: 'AtomSelectCoin',
  default: {
    coinType: 'C0101',
    siseCrncCd: 'C0100',
    chartTime: '1M',
    coinSymbol: 'BTC',
    marketSymbol: 'KRW',
  },
});
