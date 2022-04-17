import React from 'react';
import { useRecoilValue } from 'recoil';
import { atomDrawCoinInfo } from '../../atom/drawData.atom';
import { atomSelectCoin } from '../../atom/selectCoin.atom';

const CoinBar = () => {
  const { coinSymbol, e, v24, u24, h, l, f } = useRecoilValue(atomDrawCoinInfo);
  return (
    <div>
      {coinSymbol}/{e}/{v24}/{u24}/{h}/{l}/{f}/
    </div>
  );
};

export default CoinBar;
