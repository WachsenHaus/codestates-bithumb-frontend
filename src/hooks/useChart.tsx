import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { API_BITHUMB } from '../api/bt.api';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { atomChartData, ICoinChart } from '../atom/tvChart.atom';
import { ResponseVO } from '../type/api';
import { Log } from '../utils/log';

export const useGetChartDatas = () => {
  const timerId = useRef<NodeJS.Timer | null>(null);
  const selectCoin = useRecoilValue(atomSelectCoin);
  const setChartData = useSetRecoilState(atomChartData);

  const getData = async () => {
    const { coinType, chartTime, siseCrncCd } = selectCoin;
    const coinDataUrl = `${coinType}_${siseCrncCd}/${chartTime}`;
    try {
      const result = await axios.get<ResponseVO<ICoinChart>>(
        `${API_BITHUMB.GET_CANDLESTICKNEW_TRVIEW}/${coinDataUrl}`
      );
      setChartData(result.data.data);
    } catch (err) {
      Log(err);
      return undefined;
    }
  };
  useEffect(() => {
    console.log('getChartData');
    getData();
    timerId.current = setInterval(async () => {
      getData();
    }, 60 * 1000);

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [selectCoin]);
};
