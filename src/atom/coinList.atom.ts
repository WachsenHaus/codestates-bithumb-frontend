import axios from 'axios';
import qs from 'qs';
import { atom, selector } from 'recoil';
import { API_BITHUMB } from '../api/bt.api';
import { ResponseVO } from '../type/api';

import { Log } from '../utils/log';
import { ICoinList } from './coinList.type';
import { atomUserSelectCoin } from './user.atom';

/**
 * 코인의 종류들을 가지고있는 아톰
 * 한글이름, 코인코드, 클래스코드, 거래가능,.isLive, decimalDigits(모름))등의 정보를 가지고있음
 */
export const atomCoinList = atom<ICoinList | undefined>({
  key: 'atomCoinList',
  default: undefined,
});

/**
 * 코인의 종류들을 받아옴.
 */
export const atomGetCoinList = selector({
  key: 'atomGetCoinList',
  get: async () => {
    try {
      const result = await axios.get<ResponseVO<ICoinList>>(
        API_BITHUMB.COIN_LIST
      );

      return result.data;
    } catch (err) {
      // console.error(err)
      Log(err);
      return undefined;
      // return
    }
  },
});
