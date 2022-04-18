import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { atomDrawCoinInfo } from '../atom/drawData.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';

const useChangeWebTitle = () => {
  const drawCoinInfo = useRecoilValue(atomDrawCoinInfo);

  useEffect(() => {
    const htmlTitle = document.querySelector('title');
    // ${Number(rcvTicker.content.openPrice).toLocaleString(
    //   'ko-kr'
    // )}
    const title = `${drawCoinInfo.e} ${drawCoinInfo.coinSymbol}/${drawCoinInfo.siseCrncCd} `;
    if (htmlTitle) {
      htmlTitle.innerHTML = title;
    }
  }, [drawCoinInfo]);
};

export default useChangeWebTitle;
