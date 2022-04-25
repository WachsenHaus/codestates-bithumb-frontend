import React, { useEffect } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { atomDrawCoinBar } from '../atom/coinBar.atom';
import { atomDrawChart, atomDrawCoinInfo } from '../atom/drawData.atom';
import { atomOrderBook } from '../atom/orderBook.atom';
import { atomSelectCoinDefault } from '../atom/selectCoinDefault.atom';
import {
  atomDrawTransaction,
  atomFinalTransaction,
  atomTransactions,
} from '../atom/total.atom';

/**
 * 코인이 선택되면 그리는 값들을 초기화하는 기능입니다.
 */
const useResetObserverDrawData = () => {
  const selectCoin = useRecoilValue(atomSelectCoinDefault);
  const drawTransaction = useSetRecoilState(atomDrawTransaction);
  // const rowTransaction = useSetRecoilState(atomTransactions);
  const drawChartData = useSetRecoilState(atomDrawChart);
  const drawOrderBook = useSetRecoilState(atomOrderBook);

  const resetCoinBar = useResetRecoilState(atomDrawCoinBar);
  const resetRowTransaction = useResetRecoilState(atomTransactions);

  useEffect(() => {
    drawTransaction([]);
    drawChartData([]);
    resetRowTransaction();
    resetCoinBar();
    drawOrderBook({
      ask: [],
      bid: [],
    });
  }, [selectCoin]);
};

export default useResetObserverDrawData;
