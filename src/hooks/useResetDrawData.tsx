import React, { useEffect } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { atomCoinBar, atomDrawCoinBar } from '../atom/coinBar.atom';
import { atomDrawChart, atomDrawCoinInfo } from '../atom/drawData.atom';
import { atomOrderBook } from '../atom/orderBook.atom';
import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import { atomFinalTransaction } from '../atom/total.atom';

import { atomChartData } from '../atom/tvChart.atom';

/**
 * 코인이 선택되면 그리는 값들을 초기화하는 기능입니다.
 */
const useResetObserverDrawData = () => {
  const selectCoin = useRecoilValue(atomSelectCoinDefault);
  const drawTranSaction = useSetRecoilState(atomFinalTransaction);
  const drawChartData = useSetRecoilState(atomDrawChart);
  const resetCoinBar = useResetRecoilState(atomDrawCoinBar);
  // const resetCoinDetail = useResetRecoilState(atomSelectCoinDetail);
  // const drawCoinInfo = useSetRecoilState(atomCoinBar);
  const drawOrderBook = useSetRecoilState(atomOrderBook);

  useEffect(() => {
    drawTranSaction([]);
    drawChartData([]);
    // resetCoinDefault();
    resetCoinBar();
    drawOrderBook({
      ask: [],
      bid: [],
    });
  }, [selectCoin]);
};

export default useResetObserverDrawData;
