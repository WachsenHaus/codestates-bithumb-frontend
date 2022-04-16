import produce from 'immer';
import React, { useEffect } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { API_BITHUMB_STATUS_CODE } from '../api/bt.api';
import { atomCoinList, atomGetCoinList } from '../atom/coinList.atom';
import { TypeCoinObj } from '../atom/coinList.type';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import _ from 'lodash';

const useGetCoinList = () => {
  const [coinState, setCoinState] = useRecoilState(atomCoinList);
  const setDrawTicker = useSetRecoilState(atomDrawTicker);
  const queryResults = useRecoilValueLoadable(atomGetCoinList);
  useEffect(() => {
    const { state, contents } = queryResults;
    if (state === 'hasValue') {
      if (contents?.status === API_BITHUMB_STATUS_CODE.SUCCESS) {
        console.log(contents?.data);
        setCoinState(contents?.data);
      }
    }
  }, [queryResults.state]);

  useEffect(() => {
    // 받아온 코인리스트에서 그리기위한 정보만 집어넣음.
    const result = new Promise((resolve, reject) => {
      if (coinState?.coinList === undefined) return;
      const rawData = _.cloneDeep(coinState?.coinList);
      /**
       * 코인타입이고 사용중인 코인만 필터링합니다.
       */
      const filteredData = rawData.filter(
        (item) => item.coinClassCode !== 'F' && item.isLive === true
      );
      const drawDummy = filteredData.map((item) => {
        return {
          coinClassCode: item.coinClassCode,
          coinName: item.coinName,
          coinNameEn: item.coinNameEn,
          coinSymbol: item.coinSymbol,
          coinType: item.coinType,
          isLive: item.isLive,
        };
      });
      if (drawDummy) {
        resolve(drawDummy);
      } else {
        reject('err');
      }
    });
    result
      .then((data) => {
        setDrawTicker(data as TypeDrawTicker[]);
      })
      .catch((err) => console.error(err));
  }, [coinState]);

  return undefined;
};

export default useGetCoinList;
