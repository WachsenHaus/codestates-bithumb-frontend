import React, { useEffect, useRef } from 'react';
import {
  useRecoilStateLoadable,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import { atomChartData, selectorGetChartData } from '../atom/tvChart.atom';

export const useGetChartDatas = () => {
  const timerId = useRef<NodeJS.Timer | null>(null);
  const selectCoinDefault = useRecoilValue(atomSelectCoinDefault);

  const [getChartData, reload] = useRecoilStateLoadable(selectorGetChartData);
  const setChartData = useSetRecoilState(atomChartData);
  const isFetching = useRef(false);

  /**
   * 차트데이터를 성공적으로 받아오면 atomchartdata에 할당합니다.
   */
  useEffect(() => {
    if (getChartData.state === 'hasValue') {
      getChartData.contents && setChartData(getChartData.contents);
      isFetching.current = false;
    }
  }, [getChartData]);

  /**
   * 1분 주기로 차트데이터를 받아옵니다.
   */
  useEffect(() => {
    timerId.current = setInterval(async () => {
      if (isFetching.current) {
        return;
      }
      isFetching.current = true;
      reload(undefined);
    }, 60 * 1000);

    return () => {
      if (timerId.current) {
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
  }, [selectCoinDefault]);
};
