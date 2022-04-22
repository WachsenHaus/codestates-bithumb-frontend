import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  atomDrawChart,
  atomDrawCoinInfo,
  atomDrawTransaction,
} from '../atom/drawData.atom';
import { atomOrderBook } from '../atom/orderBook.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';
import { atomChartData } from '../atom/tvChart.atom';

/**
 * 코인이 선택되면 그리는 값들을 초기화하는 기능입니다.
 */
const useResetObserverDrawData = () => {
  const selectCoin = useRecoilValue(atomSelectCoin);
  const drawTranSaction = useSetRecoilState(atomDrawTransaction);
  const drawChartData = useSetRecoilState(atomDrawChart);
  const drawCoinInfo = useSetRecoilState(atomDrawCoinInfo);
  const drawOrderBook = useSetRecoilState(atomOrderBook);

  useEffect(() => {
    drawTranSaction([]);
    drawChartData([]);
    drawCoinInfo({});
    drawOrderBook({
      ask: [],
      bid: [],
    });
  }, [selectCoin]);
};

export default useResetObserverDrawData;
