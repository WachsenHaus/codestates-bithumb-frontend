import { atom } from 'recoil';
import { TypeCoinKind } from './coinList.type';

//coinType 코인의 고유 번호
//siseCrncCd 코인이 등록된시장
//chartTime 1M 차트에서 보고싶은 데이터

interface ISelectCoin {
  coinType: string;
  siseCrncCd: TypeCoinKind;
  chartTime: string;
}

export const atomSelectCoin = atom<ISelectCoin>({
  key: 'AtomSelectCoin',
  default: {
    coinType: 'C0101',
    siseCrncCd: 'C0100',
    chartTime: '1M',
  },
});
