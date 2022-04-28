import React, { useEffect } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { atomDrawCoinBar } from '../atom/coinBar.atom';
import { atomDrawChart, atomDrawCoinInfo } from '../atom/drawData.atom';
import { atomOrderBook } from '../atom/orderBook.atom';
import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import { atomDrawTransaction, atomFilteredCoins } from '../atom/total.atom';

/**
 * 코인이 선택되면 그리는 값들을 초기화하는 기능입니다.
 */
const useResetObserverDrawData = () => {
  const selectCoin = useRecoilValue(atomSelectCoinDefault);

  const resetCoinBar = useResetRecoilState(atomDrawCoinBar);
  const resetTransaction = useResetRecoilState(atomDrawTransaction);
  const resetOrderBook = useResetRecoilState(atomOrderBook);
  const resetChartData = useResetRecoilState(atomDrawChart);
  // const resetTicker = useResetRecoilState(atomFilteredCoins);

  useEffect(() => {
    resetTransaction();
    resetCoinBar();
    resetOrderBook();
    resetChartData();
    // resetTicker();
  }, [selectCoin]);
};

export default useResetObserverDrawData;
