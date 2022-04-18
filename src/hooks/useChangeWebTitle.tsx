import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { atomDrawCoinInfo } from '../atom/drawData.atom';
import { atomSelectCoin } from '../atom/selectCoin.atom';

/**
 * 선택된 코인에 대한 정보를 타이틀에 표기합니다.
 */
const useChangeWebTitle = () => {
  const { e, coinSymbol, siseCrncCd } = useRecoilValue(atomDrawCoinInfo);

  useEffect(() => {
    const htmlTitle = document.querySelector('title');
    const koreaCost = `${Number(e).toLocaleString('ko-kr')}`;
    const title = `${koreaCost} ${coinSymbol}/${siseCrncCd} `;

    if (htmlTitle) {
      htmlTitle.innerHTML = title;
    }
  }, [e, coinSymbol, siseCrncCd]);
};

export default useChangeWebTitle;
