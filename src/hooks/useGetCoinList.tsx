import produce from 'immer';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { API_BITHUMB_STATUS_CODE } from '../api/bt.api';
import { atomCoinList, atomGetCoinList } from '../atom/coinList.atom';
import { TypeCoinObj } from '../atom/coinList.type';
import { atomDrawTicker, TypeDrawTicker } from '../atom/drawData.atom';
import _ from 'lodash';

const useGetCoinList = () => {
  const [coinState, setCoinState] = useRecoilState(atomCoinList);
  const [drawTicker, setDrawTicker] = useRecoilState(atomDrawTicker);
  const queryResults = useRecoilValue(atomGetCoinList);

  useEffect(() => {
    if (queryResults?.status === API_BITHUMB_STATUS_CODE.SUCCESS) {
      console.log(queryResults.data);
      setCoinState(queryResults.data);
    }
  }, [queryResults]);

  useEffect(() => {
    // 받아온 코인리스트에서 그리기위한 정보만 집어넣음.
    if (coinState?.coinList === undefined) return;

    const rawData = _.cloneDeep(coinState?.coinList);

    const nextData: TypeDrawTicker[] = rawData.map((item) => {
      return {
        coinClassCode: item.coinClassCode,
        coinName: item.coinName,
        coinNameEn: item.coinNameEn,
        coinSymbol: item.coinSymbol,
        coinType: item.coinType,
        isLive: item.isLive,
      };
    });
    setDrawTicker(nextData);

    if (coinState?.coinList) {
    }
  }, [coinState]);
};

export default useGetCoinList;
