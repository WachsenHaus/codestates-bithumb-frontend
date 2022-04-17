import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { atomSelectCoin } from '../atom/selectCoin.atom';

const useChangeWebTitle = () => {
  const selectCoin = useRecoilValue(atomSelectCoin);

  useEffect(() => {
    const htmlTitle = document.querySelector('title');
    // ${Number(rcvTicker.content.openPrice).toLocaleString(
    //   'ko-kr'
    // )}
    const title = `/ ${selectCoin.coinSymbol}`;
    if (htmlTitle) {
      htmlTitle.innerHTML = title;
    }
  }, [selectCoin]);
};

export default useChangeWebTitle;
