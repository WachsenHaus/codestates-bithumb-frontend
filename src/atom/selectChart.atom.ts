import { atom } from 'recoil';

export interface ISelectChartSetup {
  chartTime: '1M' | '10M' | '30M' | '1H';
}

export const atomSelectChartSetup = atom<ISelectChartSetup>({
  key: 'atomSelectChartSetup',
  default: {
    chartTime: '1M',
  },
});
