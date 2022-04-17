import React from 'react';
import { useRecoilValue } from 'recoil';
import { atomSelectCoin } from '../../atom/selectCoin.atom';

const CoinBar = () => {
  const { coinSymbol, e, v24, u24, h, l, f } = useRecoilValue(atomSelectCoin);
  return (
    <div>
      {coinSymbol}/{e}/{v24}/{u24}/{h}/{l}/{f}/
    </div>
  );
};

export default CoinBar;
