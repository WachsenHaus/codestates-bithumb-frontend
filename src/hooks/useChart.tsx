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
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const isFetching = useRef(false);

  const getData = async () => {
    const { coinType, chartTime, siseCrncCd } = selectCoin;
    const coinDataUrl = `${coinType}_${siseCrncCd}/${chartTime}`;
    try {
      isFetching.current = true;
      const result = await axios.get<ResponseVO<ICoinChart>>(
        `${API_BITHUMB.GET_CANDLESTICKNEW_TRVIEW}/${coinDataUrl}`,
        {
          cancelToken: source.token,
        }
      );
      setChartData(result.data.data);
      isFetching.current = false;
    } catch (err) {
      Log(err);
      return undefined;
    }
  };
  useEffect(() => {
    console.log('getChartData');
    getData();
    timerId.current = setInterval(async () => {
      if (isFetching.current) {
        return;
      }
      getData();
    }, 60 * 1000);

    return () => {
      if (timerId.current) {
        source.cancel('호출취소2');
        setChartData({
          t: [],
          o: [],
          h: [],
          l: [],
          c: [],
          v: [],
        });
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [selectCoin]);
};
