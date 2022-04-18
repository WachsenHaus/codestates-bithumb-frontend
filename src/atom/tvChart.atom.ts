import { atomSelectCoin } from './selectCoin.atom';
import axios from 'axios';
import { atom, selector } from 'recoil';
import { API_BITHUMB } from '../api/bt.api';
import { ResponseVO } from '../type/api';
import { Log } from '../utils/log';
import { UTCTimestamp } from 'lightweight-charts';

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

export const atomGetStChartData = atom<iStChartData | undefined>({
  key: 'AtomGetStChartData',
  default: undefined,
});
