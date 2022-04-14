import axios from 'axios';
import { atom, selector } from 'recoil';
import { API_BITHUMB } from '../api/bt.api';
import { ResponseVO } from '../type/api';

import { Log } from '../utils/log';
import { ICoinList } from './coinList.type';

export const atomCoinList = atom<ICoinList | undefined>({
  key: 'atomCoinList',
  default: undefined,
});

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
