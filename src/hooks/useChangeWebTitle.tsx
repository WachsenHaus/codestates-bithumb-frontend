import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { atomCoinBar } from '../atom/coinBar.atom';
import { convertStringPriceToKRW } from '../utils/utils';

/**
 * 선택된 코인에 대한 정보를 타이틀에 표기합니다.
 */
const useChangeWebTitle = () => {
  const { e, coinSymbol, siseCrncCd, marketSymbol } =
    useRecoilValue(atomCoinBar);

  useEffect(() => {
    const htmlTitle = document.querySelector('title');
    const koreaCost = convertStringPriceToKRW(e);
    if (koreaCost && coinSymbol && siseCrncCd) {
      const title = `${koreaCost} ${coinSymbol}/${marketSymbol}`;

      if (htmlTitle) {
        htmlTitle.innerHTML = title;
      }
    }
  }, [e, coinSymbol, siseCrncCd]);
};

export default useChangeWebTitle;
