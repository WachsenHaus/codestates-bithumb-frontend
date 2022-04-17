import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { atomDrawChart, atomDrawTransaction } from '../atom/drawData.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { atomChartData } from '../atom/tvChart.atom';

/**
 * 코인이 선택되면 그리는 값들을 초기화하는 기능입니다.
 */
const useResetObserverDrawData = () => {
  const selectCoin = useRecoilValue(atomSelectCoin);

  const drawTranSaction = useSetRecoilState(atomDrawTransaction);
  const drawChartData = useSetRecoilState(atomDrawChart);

  useEffect(() => {
    drawTranSaction([]);
    drawChartData([]);
    // drawch
  }, [selectCoin]);
};

export default useResetObserverDrawData;
