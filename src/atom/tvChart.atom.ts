import axios from 'axios';
import { atom, DefaultValue, selector } from 'recoil';
import { API_BITHUMB } from '../api/bt.api';
import { ResponseVO } from '../type/api';
import { UTCTimestamp } from 'lightweight-charts';
import { atomSelectCoinDefault } from './selectCoinDefault.atom';
import { atomSelectChartSetup } from './selectChart.atom';
import _ from 'lodash';

export interface ICoinChart {
  t: Array<UTCTimestamp>;
  o: Array<string>;
  h: Array<string>;
  l: Array<string>;
  c: Array<string>;
  v: Array<string>;
}

/**
 * 차트데이터를 가져온다. 이때 차트는 selectAtom에서 선택된 아톰데이터를 가져온다.
 * C0565_C0100/1M
 */
export const atomChartData = atom<ICoinChart>({
  key: 'AtomChartData',
  default: {
    t: [],
    o: [],
    h: [],
    l: [],
    c: [],
    v: [],
  },
});

// c: "C0101"
// e: "50532000"
// h: "50532000"
// k: "1S"
// l: "50532000"
// m: "C0100"
// o: "50532000"
// t: "20220416164633"
// v: "0.0188"
export interface iStChartData {
  c: string;
  e: string;
  h: string;
  k: string;
  l: string;
  m: string;
  o: string;
  t: string;
  v: string;
}

export type TypeChartData = {
  time: UTCTimestamp;
  open: string;
  high: string;
  low: string;
  close: string;
};

export const atomWsStBar = atom<iStChartData | undefined>({
  key: 'atomWsStBar',
  default: undefined,
});

export const atomForceGetChartData = atom<undefined | number>({
  key: 'atomForceGetChartData',
  default: undefined,
});

const CONST_KR_UTC = 9 * 60 * 60 * 1000;

export interface iStBar {
  close: string;
  high: string;
  low: string;
  open: string;
  time: UTCTimestamp;
}

export const atomDrawStBars = atom<Array<iStBar>>({
  key: 'atomDrawStBars',
  default: [],
});
export const selectorDrawStBars = selector({
  key: 'selectorDrawStBars',
  get: async ({ get }) => {
    const stbars = get(atomChartData);
    const { c, h, l, o, t, v } = stbars;
    const result = new Promise<iStBar[]>((resolve, reject) => {
      let obj = [];
      for (let i = 0; i < t.length; i++) {
        const time = ((t[i] + CONST_KR_UTC) / 1000) as UTCTimestamp;
        obj.push({
          time: time,
          open: o[i],
          high: h[i],
          low: l[i],
          close: c[i],
        });
      }
      resolve(obj);
    });
    return await result;
  },
});

export const selectorGetChartData = selector({
  key: 'selectorGetChartData',
  get: async ({ get }) => {
    try {
      get(atomForceGetChartData);
      const { coinType, siseCrncCd } = get(atomSelectCoinDefault);
      if (coinType === '') {
        return;
      }
      const { chartTime } = get(atomSelectChartSetup);
      const coinDataUrl = `${coinType}_${siseCrncCd}/${chartTime}`;

      const result = await axios.get<ResponseVO<ICoinChart>>(
        `${API_BITHUMB.GET_CANDLESTICKNEW_TRVIEW}/${coinDataUrl}`
      );
      return result.data.data;
    } catch (err) {}
  },
  set: ({ set }) => set(atomForceGetChartData, Math.random()),
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});
